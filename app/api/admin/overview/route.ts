// app/api/admin/overview/route.ts

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
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
    
    // Modified encryption stats queries
    const keyEncryptedCount = await db.collection('pastes').countDocuments({ 
      encryptionMethod: 'key'
    });
    
    const passwordEncryptedCount = await db.collection('pastes').countDocuments({
      encryptionMethod: 'password'
    });
    
    const nonEncryptedCount = await db.collection('pastes').countDocuments({
      encryptionMethod: null
    });

    // Fetch recent pastes with encryption method info
    const recentPastes = await db.collection('pastes')
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .project({
        id: 1,
        title: 1,
        encryptionMethod: 1
      })
      .toArray();

    // Use the dbStats command to get storage statistics
    const stats = await db.command({ dbStats: 1 });
    const storageUsage = stats.storageSize; // Total storage used in bytes
    const averageSize = stats.avgObjSize; // Average size in bytes

    // Respond with the statistics
    return NextResponse.json({
      totalPastes,
      recentPastes,
      encryptionStats: {
        keyEncrypted: keyEncryptedCount,
        passwordEncrypted: passwordEncryptedCount,
        nonEncrypted: nonEncryptedCount
      },
      storageUsage: storageUsage / (1024 * 1024), // Convert bytes to MB for easier reading
      averageSize: averageSize,
    });
  } catch (error) {
    console.error('Error fetching overview data:', error);
    return NextResponse.json({ error: 'Unable to fetch overview data' }, { status: 500 });
  }
}
