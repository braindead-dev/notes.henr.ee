// app/api/admin/overview/route.ts

import { NextResponse } from 'next/server';
import clientPromise from '@/utils/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';

export async function GET() {
  try {
    // Authenticate the request
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Fetch data from MongoDB 
    const client = await clientPromise;
    const db = client.db('notes'); // Your MongoDB database name

    // Fetch general statistics (e.g., total pastes, encryption stats)
    const totalPastes = await db.collection('pastes').countDocuments();
    const recentPastes = await db.collection('pastes').find().sort({ createdAt: -1 }).limit(5).toArray();
    const encryptedCount = await db.collection('pastes').countDocuments({ isEncrypted: true });
    const nonEncryptedCount = totalPastes - encryptedCount;

    // Use the dbStats command to get storage statistics
    const stats = await db.command({ dbStats: 1 });
    const storageUsage = stats.storageSize; // Total storage used in bytes
    const averageSize = stats.avgObjSize; // Average size in bytes

    // Respond with the statistics
    return NextResponse.json({
      totalPastes,
      recentPastes,
      encryptionStats: {
        encrypted: encryptedCount,
        nonEncrypted: nonEncryptedCount,
      },
      storageUsage: storageUsage / (1024 * 1024), // Convert bytes to MB for easier reading
      averageSize: averageSize,
    });
  } catch (error) {
    console.error('Error fetching overview data:', error);
    return NextResponse.json({ error: 'Unable to fetch overview data' }, { status: 500 });
  }
}
