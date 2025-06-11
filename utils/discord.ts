// utils/discord.ts

interface DiscordWebhookMessage {
  content?: string;
  embeds?: Array<{
    title?: string;
    description?: string;
    color?: number;
    fields?: Array<{
      name: string;
      value: string;
      inline?: boolean;
    }>;
    timestamp?: string;
  }>;
}

type EncryptionMethod = "null" | "key" | "password";

const colors: Record<EncryptionMethod, number> = {
  null: 0xd4d4d4, // Blue for unencrypted
  key: 0x00ff00, // Green for key encryption
  password: 0x3498db, // Blue for password encryption
};

const encryptionStatus: Record<EncryptionMethod, string> = {
  null: "🔓 None",
  key: "🔑 Key",
  password: "🔒 Password",
};

export async function sendDiscordNotification(
  title: string,
  id: string,
  encryptionMethod: EncryptionMethod | null,
) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn("Discord webhook URL not configured");
    return;
  }

  const message: DiscordWebhookMessage = {
    embeds: [
      {
        title: "New Paste Created",
        color: colors[encryptionMethod || "null"],
        fields: [
          {
            name: "Title",
            value: `[${title}](https://notes.henr.ee/${id})`,
            inline: true,
          },
          {
            name: "Encryption",
            value: encryptionStatus[encryptionMethod || "null"],
            inline: true,
          },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  };

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  } catch (error) {
    console.error("Error sending Discord notification:", error);
  }
}
