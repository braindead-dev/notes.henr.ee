// app/api/paste/route.ts

import { NextResponse } from 'next/server';
import clientPromise from '../../../utils/mongodb';
import { generateUniqueId } from '../../../utils/slugUtils';
import { sendDiscordNotification } from '../../../utils/discord';

export async function POST(request: Request) {
  try {
    const { title, content, isEncrypted, encryptionMethod } = await request.json();

    // Validate incoming data
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return NextResponse.json({ error: 'Invalid title. Title cannot be empty.' }, { status: 400 });
    }
    if (!content || typeof content !== 'string' || content.trim() === '') {
      return NextResponse.json({ error: 'Invalid content. Content cannot be empty.' }, { status: 400 });
    }
    if (title.length > 100) {
      return NextResponse.json({ error: 'Title is too long. Maximum length is 100 characters.' }, { status: 400 });
    }

    const fullPaste = `${title}\n${content}`;
    const pasteSize = new Blob([fullPaste]).size;

    const MAX_SIZE_BYTES = 400 * 1024; // 400 KB in bytes

    if (pasteSize > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: `Paste exceeds ${(MAX_SIZE_BYTES / 1024)} KB size limit. Current size is ${(pasteSize / 1024).toFixed(2)} KB.` }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('notes'); // Your MongoDB cluster name

    const id = generateUniqueId(title); // Generate a unique ID for the paste

    // Check for ID collisions
    const existingPaste = await db.collection('pastes').findOne({ id });
    if (existingPaste) {
      return NextResponse.json({ error: 'ID collision occurred. Please try again.' }, { status: 500 });
    }

    // Insert the paste into the MongoDB database
    const result = await db.collection('pastes').insertOne({
      id,
      title,
      content,
      isEncrypted: !!isEncrypted, // Ensure it's a boolean
      encryptionMethod: encryptionMethod || null, // Store encryption method ('key' or 'password') or null
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
