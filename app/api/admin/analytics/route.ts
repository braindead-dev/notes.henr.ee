// app/api/admin/analytics/route.ts

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

    const client = await clientPromise;
    const db = client.db('notes');

    // Calculate date range (188 days)
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 188);
    startDate.setHours(0, 0, 0, 0);

    // Aggregate paste counts by day
    const dailyData = await db.collection('pastes').aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt',
              timezone: 'UTC',
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          date: '$_id',
          count: 1,
          _id: 0,
        },
      },
      {
        $sort: { date: 1 },
      },
    ]).toArray();

    // Add new code to fetch additional statistics
    // Fetch general statistics
    const totalPastes = await db.collection('pastes').countDocuments();

    // Count pastes from last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const pastesLast7Days = await db.collection('pastes').countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    // Calculate average paste size
    const pipeline = [
      {
        $project: {
          size: { $bsonSize: '$$ROOT' },
        },
      },
      {
        $group: {
          _id: null,
          averageSize: { $avg: '$size' },
        },
      },
    ];

    const averageSizeResult = await db.collection('pastes').aggregate(pipeline).toArray();
    const averageSizeBytes = averageSizeResult.length > 0 ? averageSizeResult[0].averageSize : 0;
    const averageSizeKB = averageSizeBytes / 1024; // Convert bytes to KB

    // Return all data
    return NextResponse.json({
      dailyData,
      totalPastes,
      pastesLast7Days,
      averageSize: averageSizeKB, // Return average size in KB
    });
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return NextResponse.json({ error: 'Unable to fetch analytics data' }, { status: 500 });
  }
}
