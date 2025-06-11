import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { pasteIds } = await request.json();

    const client = await clientPromise;
    const db = client.db("notes");

    const result = await db.collection("pastes").deleteMany({
      id: { $in: pasteIds },
    });

    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting pastes:", error);
    return NextResponse.json(
      { error: "Unable to delete pastes" },
      { status: 500 },
    );
  }
}
