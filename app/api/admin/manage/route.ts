// app/api/admin/manage/route.ts

import { NextResponse } from 'next/server';
import clientPromise from '@/utils/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const url = new URL(request.url);
    const searchQuery = url.searchParams.get('search') ?? '';
    const filter = url.searchParams.get('filter') ?? '';
    const page = parseInt(url.searchParams.get('page') ?? '1', 10);
    const limit = 20;
    const skip = (page - 1) * limit;

    const sortBy = url.searchParams.get('sortBy') ?? 'date';
    const sortOrder = url.searchParams.get('sortOrder') ?? 'desc';

    const sortFieldMapping: Record<string, string> = {
      date: 'createdAt',
      name: 'title',
      size: 'size',
    };

    const sortField = sortFieldMapping[sortBy] ?? 'createdAt';
    const sortDir = sortOrder === 'asc' ? 1 : -1;

    const client = await clientPromise;
    const db = client.db('notes');

    let query: any = {};

    if (searchQuery) {
      query.content = { $regex: searchQuery, $options: 'i' };
    }

    if (filter === 'encrypted') {
      query.isEncrypted = true;
    } else if (filter === 'nonEncrypted') {
      query.$or = [{ isEncrypted: false }, { isEncrypted: { $exists: false } }];
    }

    // Fetch total number of pastes that match the query
    const totalPastes = await db.collection('pastes').countDocuments(query);

    // Modify the aggregation pipeline
    const pipeline = [
      { $match: query },
      {
        $project: {
          id: '$id',
          title: 1,
          isEncrypted: 1,
          encryptionType: {
            $cond: {
              if: { $eq: ['$isEncrypted', true] },
              then: {
                $cond: {
                  if: { $eq: ['$encryptionMethod', 'password'] },
                  then: 'password',
                  else: {
                    $cond: {
                      if: { $eq: ['$encryptionMethod', 'key'] },
                      then: 'key',
                      else: 'key', // Default to 'key' if encryptionMethod is missing
                    },
                  },
                },
              },
              else: null,
            },
          },
          createdAt: 1,
          size: { $bsonSize: '$$ROOT' },
          _id: 1,
        },
      },
      {
        $addFields: {
          lowerTitle: { $toLower: '$title' },
        },
      },
      {
        $sort: {
          [sortField === 'title' ? 'lowerTitle' : sortField]: sortDir,
          _id: 1,
        },
      },
      { $skip: skip },
      { $limit: limit },
    ];    
    
    const pastes = await db.collection('pastes').aggregate(pipeline).toArray();

    return NextResponse.json({
      pastes,
      totalPastes,
      totalPages: Math.ceil(totalPastes / limit),
      page,
    });
  } catch (error) {
    console.error('Error fetching pastes:', error);
    return NextResponse.json(
      { error: 'Unable to fetch pastes' },
      { status: 500 }
    );
  }
}