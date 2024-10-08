import { NextResponse } from 'next/server';
import clientPromise from '../../../utils/mongodb'; // Updated import

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing id parameter.' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('notes'); // Your MongoDB cluster name

    // Fetch the paste from MongoDB
    const paste = await db.collection('pastes').findOne({ id });

    if (!paste) {
      return NextResponse.json({ error: 'Paste not found.' }, { status: 404 });
    }

    return NextResponse.json(paste);
  } catch (error) {
    console.error('Error fetching paste:', error);
    return NextResponse.json({ error: 'Internal Server Error.' }, { status: 500 });
  }
}
