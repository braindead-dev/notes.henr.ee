// app/api/paste/route.ts

import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { generateUniqueId } from '../../../utils/slugUtils';
import { sendDiscordNotification } from '../../../utils/discord';

const validEncryptionMethods = ['key', 'password', null] as const;
type EncryptionMethod = typeof validEncryptionMethods[number];

const MIN_SIZE_BYTES = 1;
const MAX_SIZE_BYTES = 400 * 1024; // 400 KB
const MAX_TITLE_LENGTH = 100;
const MIN_TITLE_LENGTH = 1;

export async function POST(request: Request) {
  try {
    const { title, content, encryptionMethod } = await request.json();

    // Validate incoming data
    if (!title || typeof title !== 'string' || 
        title.length < MIN_TITLE_LENGTH || 
        title.length > MAX_TITLE_LENGTH) {
      return NextResponse.json({ 
        error: `Title must be between ${MIN_TITLE_LENGTH} and ${MAX_TITLE_LENGTH} characters.` 
      }, { status: 400 });
    }
    if (!content || typeof content !== 'string' || content.trim() === '') {
      return NextResponse.json({ error: 'Invalid content. Content cannot be empty.' }, { status: 400 });
    }

    const fullPaste = `${title}\n${content}`;
    const pasteSize = new Blob([fullPaste]).size;

    if (pasteSize < MIN_SIZE_BYTES || pasteSize > MAX_SIZE_BYTES) {
      return NextResponse.json({ 
        error: `Content size must be between ${MIN_SIZE_BYTES} and ${MAX_SIZE_BYTES/1024} KB.` 
      }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('notes'); // Your MongoDB cluster name

    const id = generateUniqueId(title); // Generate a unique ID for the paste

    // Check for ID collisions
    const existingPaste = await db.collection('pastes').findOne({ id });
    if (existingPaste) {
      return NextResponse.json({ error: 'ID collision occurred. Please try again.' }, { status: 500 });
    }

    if (!validEncryptionMethods.includes(encryptionMethod as EncryptionMethod)) {
      return NextResponse.json({ error: 'Invalid encryption method' }, { status: 400 });
    }

    // Insert the paste into the MongoDB database
    const result = await db.collection('pastes').insertOne({
      id,
      title,
      content,
      encryptionMethod: encryptionMethod || null,
      createdAt: new Date(),
    });

    // Send Discord notification after successful paste creation
    await sendDiscordNotification(title, id, encryptionMethod);

    return NextResponse.json({ id });
  } catch (error) {
    console.error('Error storing paste:', error);
    return NextResponse.json({ error: 'Internal Server Error.' }, { status: 500 });
  }
}
