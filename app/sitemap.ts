import { MetadataRoute } from "next";
import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://notes.henr.ee";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/paste`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/encryption`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  try {
    // Fetch all public (non-encrypted) pastes from MongoDB
    const client = await clientPromise;
    const db = client.db("notes");

    const publicPastes = await db
      .collection("pastes")
      .find({
        encryptionMethod: null, // Only include non-encrypted pastes
      })
      .project({
        id: 1,
        createdAt: 1,
      })
      .sort({ createdAt: -1 }) // Most recent first
      .limit(10000) // Limit to prevent huge sitemaps
      .toArray();

    // Generate sitemap entries for public pastes
    const pastePages: MetadataRoute.Sitemap = publicPastes.map((paste) => ({
      url: `${baseUrl}/${paste.id}`,
      lastModified: paste.createdAt || new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    return [...staticPages, ...pastePages];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Return only static pages if there's an error
    return staticPages;
  }
}
