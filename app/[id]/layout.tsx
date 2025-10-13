import { Metadata } from "next";
import clientPromise from "@/lib/mongodb";

type Props = {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
};

// Helper function to truncate content for description
function truncateContent(content: string, maxLength: number = 160): string {
  // Remove markdown syntax for cleaner description
  const cleanContent = content
    .replace(/```[\s\S]*?```/g, "") // Remove code blocks
    .replace(/`[^`]+`/g, "") // Remove inline code
    .replace(/#+\s/g, "") // Remove headers
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Convert links to text
    .replace(/[*_~]/g, "") // Remove emphasis markers
    .trim();

  if (cleanContent.length <= maxLength) {
    return cleanContent;
  }

  return cleanContent.substring(0, maxLength).trim() + "...";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db("notes");
    const paste = await db.collection("pastes").findOne({ id });

    // If paste doesn't exist or is encrypted, return default metadata
    if (!paste || paste.encryptionMethod) {
      return {
        title: "Paste Not Found",
        description: "This paste could not be found or is encrypted.",
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    const title = paste.title || "Untitled Paste";
    const description = truncateContent(paste.content);
    const url = `https://notes.henr.ee/${id}`;

    return {
      title: title,
      description: description,
      openGraph: {
        title: title,
        description: description,
        url: url,
        siteName: "Henry's Notes",
        type: "article",
        publishedTime: paste.createdAt?.toISOString(),
      },
      twitter: {
        card: "summary",
        title: title,
        description: description,
      },
      alternates: {
        canonical: url,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
        },
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Error",
      description: "An error occurred while loading this paste.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

export default function PasteLayout({ children }: Props) {
  return <>{children}</>;
}
