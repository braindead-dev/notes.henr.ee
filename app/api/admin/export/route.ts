// app/api/admin/export/route.ts

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

    // Fetch data for export

    // Get all collections in the database
    const collections = await db.listCollections().toArray();

    // Prepare an object to store all collection data
    const databaseExport: { [key: string]: any[] } = {};

    // Iterate over all collections and fetch their documents
    for (const collection of collections) {
      const collectionName = collection.name;
      const documents = await db.collection(collectionName).find().toArray();
      databaseExport[collectionName] = documents;
    }

    // Respond with the export
    return NextResponse.json({
      database: databaseExport,
    });
  } catch (error) {
    console.error('Error fetching export data:', error);
    return NextResponse.json({ error: 'Unable to fetch export data' }, { status: 500 });
  }
}