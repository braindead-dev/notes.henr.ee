import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function DELETE(request: Request) {
  try {
    // Authenticate the request
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const sizeFrom = searchParams.get("sizeFrom");
    const sizeTo = searchParams.get("sizeTo");
    const encryptionTypes =
      searchParams.get("encryptionTypes")?.split(",") ?? [];

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("notes");

    // Build the query
    const query: any = {};

    // Add search condition if search term exists
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { id: { $regex: search, $options: "i" } },
      ];
    }

    // Add date range conditions
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    // Add size range conditions
    if (sizeFrom || sizeTo) {
      query.size = {};
      if (sizeFrom) query.size.$gte = parseInt(sizeFrom);
      if (sizeTo) query.size.$lte = parseInt(sizeTo);
    }

    // Add encryption type conditions
    if (encryptionTypes.length > 0) {
      const encryptionConditions = [];

      if (encryptionTypes.includes("none")) {
        encryptionConditions.push({ encryptionMethod: null });
      }

      if (encryptionTypes.includes("key")) {
        encryptionConditions.push({ encryptionMethod: "key" });
      }

      if (encryptionTypes.includes("password")) {
        encryptionConditions.push({ encryptionMethod: "password" });
      }

      if (encryptionConditions.length > 0) {
        query.$or = encryptionConditions;
      }
    }

    console.log("Delete-all query:", JSON.stringify(query, null, 2));

    // Delete all matching documents
    const result = await db.collection("pastes").deleteMany(query);

    console.log("Delete-all result:", result);

    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting pastes:", error);
    return NextResponse.json(
      { error: "Failed to delete pastes" },
      { status: 500 },
    );
  }
}
