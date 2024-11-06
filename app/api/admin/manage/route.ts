// app/api/admin/manage/route.ts

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
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

    const dateFrom = url.searchParams.get('dateFrom');
    const dateTo = url.searchParams.get('dateTo');
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    const sizeFrom = url.searchParams.get('sizeFrom');
    const sizeTo = url.searchParams.get('sizeTo');
    if (sizeFrom || sizeTo) {
      query.size = {};
      if (sizeFrom) query.size.$gte = parseInt(sizeFrom);
      if (sizeTo) query.size.$lte = parseInt(sizeTo);
    }

    const encryptionTypes = url.searchParams.get('encryptionTypes')?.split(',') ?? [];
    if (encryptionTypes.length > 0) {
      const encryptionConditions = [];
      
      if (encryptionTypes.includes('none')) {
        encryptionConditions.push({ encryptionMethod: null });
      }
      
      if (encryptionTypes.includes('key')) {
        encryptionConditions.push({ encryptionMethod: 'key' });
      }
      
      if (encryptionTypes.includes('password')) {
        encryptionConditions.push({ encryptionMethod: 'password' });
      }

      if (encryptionConditions.length > 0) {
        query.$or = encryptionConditions;
      }
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
          encryptionMethod: 1,
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