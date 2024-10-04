// app/api/paste/route.ts

import { NextResponse } from 'next/server';
import { generateUniqueId } from '../../../utils/slugUtils';

declare global {
  var pastes: Map<string, { title: string; content: string }>;
}

if (!global.pastes) {
  global.pastes = new Map();
}

export async function POST(request: Request) {
  try {
    const { title, content } = await request.json();

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

    const id = generateUniqueId(title); // Use the updated unique ID generator

    // Ensure the generated ID is unique
    if (global.pastes.has(id)) {
      // In the rare case of a collision, generate a new ID
      // You can implement a loop or limit the number of retries
      return NextResponse.json({ error: 'ID collision occurred. Please try again.' }, { status: 500 });
    }

    global.pastes.set(id, { title, content });
    console.log("Stored paste:", id, title, content);

    return NextResponse.json({ id });
  } catch (error) {
    console.error('Error storing paste:', error);
    return NextResponse.json({ error: 'Internal Server Error.' }, { status: 500 });
  }
}
