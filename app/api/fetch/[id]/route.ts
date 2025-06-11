import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json(
        { error: "Missing id parameter." },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db("notes"); // Your MongoDB cluster name

    // Fetch the paste from MongoDB
    const paste = await db.collection("pastes").findOne({ id });

    if (!paste) {
      return NextResponse.json(
        { error: "This paste couldn't be found." },
        { status: 404 },
      );
    }

    const publicPasteData = {
      title: paste.title,
      content: paste.content,
      createdAt: paste.createdAt,
      encryptionMethod: paste.encryptionMethod,
    };

    return NextResponse.json(publicPasteData);
  } catch (error) {
    console.error("Error fetching paste:", error);
    return NextResponse.json(
      { error: "We were unable to fetch this paste." },
      { status: 500 },
    );
  }
}
