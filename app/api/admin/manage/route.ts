// app/api/admin/manage/route.ts

import { NextResponse } from 'next/server';
import clientPromise from '@/utils/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';

export async function GET(request: Request) {
  try {
    // Authenticate the request
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Parse query parameters for pagination, search, and filtering
    const url = new URL(request.url);
    const searchQuery = url.searchParams.get('search') ?? '';
    const filter = url.searchParams.get('filter') ?? '';
    const page = parseInt(url.searchParams.get('page') ?? '1', 10);
    const limit = 20; // Number of pastes per page
    const skip = (page - 1) * limit;

    // Connect to the database
    const client = await clientPromise;
    const db = client.db('notes');

    // Define the query object
    let query: any = {};
    
    // Add search condition if present
    if (searchQuery) {
      query.content = { $regex: searchQuery, $options: 'i' }; // Case-insensitive search in content
    }

    // Add filter condition
    if (filter === 'encrypted') {
      query.isEncrypted = true;
    } else if (filter === 'nonEncrypted') {
      // Consider pastes as non-encrypted if isEncrypted is false or the field is missing
      query.$or = [{ isEncrypted: false }, { isEncrypted: { $exists: false } }];
    }

    // Fetch total number of pastes that match the query
    const totalPastes = await db.collection('pastes').countDocuments(query);

    // Fetch paginated results
    const pastes = await db.collection('pastes')
      .find(query)
      .skip(skip)
      .limit(limit)
      .toArray();

    // Return pastes along with pagination info
    return NextResponse.json({
      pastes,
      totalPastes,
      totalPages: Math.ceil(totalPastes / limit),
      page,
    });

  } catch (error) {
    console.error('Error fetching pastes:', error);
    return NextResponse.json({ error: 'Unable to fetch pastes' }, { status: 500 });
  }
}
