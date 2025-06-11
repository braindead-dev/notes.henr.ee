// [id]/page.tsx

"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { decryptContent } from "@/utils/cryptoUtils";
import DecryptionModal from "@/components/modals/DecryptionModal";
import ImageWarningModal from "@/components/modals/ImageWarningModal";
import PasteHeader from "@/components/PasteHeader";
import TitleInput from "@/components/TitleInput";
import ContentArea from "@/components/ContentArea";
import ScrollContainer from "@/components/ScrollContainer";
import styles from "@/styles/page.module.css";
import DOMPurify from "dompurify";

// Add this helper function at the top of your file
const sanitizeErrorMessage = (status: number, message?: string): string => {
  const defaultMessages: { [key: number]: string } = {
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Paste not found",
    500: "Internal server error",
  };

  // Use default message if available, otherwise use sanitized custom message
  const errorMessage =
    defaultMessages[status] ||
    (message
      ? message.replace(/[^a-zA-Z0-9\s.,!?-]/g, "")
      : "An error occurred");

  return `\`\`\`\nError ${status}: ${errorMessage}\n\`\`\``;
};

// Helper function to check if content contains images
const containsImages = (content: string): boolean => {
  // Match both inline images ![...](url) and reference style images [...]:[url]
  const imageRegex =
    /!\[.*?\]\(.*?\)|!\[.*?\]\[.*?\]|\[.*?\]:\s*http[s]?:\/\/.*?(?:\.(jpg|jpeg|png|gif|webp))/i;
  return imageRegex.test(content);
};

export default function Paste() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("```\nLoading...\n```");
  const [loading, setLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [encryptionMethod, setEncryptionMethod] = useState<
    "key" | "password" | null
  >(null);
  const [needsDecryption, setNeedsDecryption] = useState(false);
  const [encryptionKey, setEncryptionKey] = useState("");
  const [decryptionError, setDecryptionError] = useState<{
    message: string;
    id: number;
  } | null>(null);
  const [showDecryptionModal, setShowDecryptionModal] = useState(false);
  const [showImageWarning, setShowImageWarning] = useState(false);
  const [hasAcceptedImageWarning, setHasAcceptedImageWarning] = useState(false);
  const [pendingContent, setPendingContent] = useState<string | null>(null);
  const titleEditableRef = useRef<HTMLDivElement>(null);

  const toggleEncryption = () => {
    // No action needed here
  };

  useEffect(() => {
    async function fetchContent() {
      if (id) {
        try {
          const response = await fetch(`/api/fetch/${id}`);
          const data = await response.json();

          if (response.ok) {
            setTitle(data.title);
            setEncryptionMethod(data.encryptionMethod);
            if (data.encryptionMethod) {
              setNeedsDecryption(true);
              setShowDecryptionModal(true);
              setContent(data.content);
            } else {
              // Check for images in unencrypted content
              if (containsImages(data.content)) {
                setPendingContent(data.content);
                setShowImageWarning(true);
              } else {
                setContent(data.content);
              }
            }
          } else {
            // Use the sanitized error message handler
            setTitle("Error");
            setContent(sanitizeErrorMessage(response.status, data.error));
          }
        } catch (error) {
          // Handle network or unexpected errors
          setTitle("Error");
          setContent(sanitizeErrorMessage(500));
        } finally {
          setLoading(false);
        }
      }
    }
    fetchContent();
  }, [id]);

  useEffect(() => {
    try {
      // Attempt to set the document title directly
      document.title = title || "Henry's Notes";
    } catch (error) {
      // Fallback to default title in case of any error
      document.title = "Henry's Notes";
    }
  }, [title]);

  const handleCopy = () => {
    navigator.clipboard.writeText(`# ${title}\n\n${content}`);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  const handleDecryption = async () => {
    try {
      const decryptedContent = await decryptContent(content, encryptionKey);
      // Sanitize the decrypted content
      const sanitizedContent = DOMPurify.sanitize(decryptedContent);

      // Check for images in decrypted content
      if (containsImages(sanitizedContent)) {
        setPendingContent(sanitizedContent);
        setShowImageWarning(true);
      } else {
        setContent(sanitizedContent);
      }

      setNeedsDecryption(false);
      setShowDecryptionModal(false);
      setDecryptionError(null);
    } catch (error) {
      setDecryptionError({
        message: "Invalid encryption key/password or corrupted data.",
        id: Date.now(),
      });
    }
  };

  const handleAcceptImageWarning = () => {
    if (pendingContent) {
      setContent(pendingContent);
      setPendingContent(null);
    }
    setShowImageWarning(false);
    setHasAcceptedImageWarning(true);
  };

  return (
    <div className={styles.pageContainer}>
      <PasteHeader
        isPastePage={true}
        handleCopy={handleCopy}
        isCopied={isCopied}
        toggleEncryption={toggleEncryption}
        encryptionMethod={encryptionMethod}
      />
      <ScrollContainer>
        <div className={styles.contentWrapper}>
          <TitleInput
            initialTitle={loading ? "" : title}
            titleEditableRef={titleEditableRef}
            isEditable={false} // Non-editable in the paste page
          />

          <ContentArea
            content={
              !needsDecryption
                ? loading
                  ? ""
                  : showImageWarning
                    ? "```\nThis paste contains external images. Please accept the warning to view the content.\n```"
                    : content
                : encryptionMethod === "password"
                  ? `\`\`\`\nThis paste is AES-256 encrypted with PBKDF2. \n\nTo re-prompt password input, refresh this page.\n\nEncrypted Content:\n${content}\n\`\`\``
                  : `\`\`\`\nThis paste is AES-256 encrypted. \n\nTo re-prompt decryption key input, refresh this page.\n\nEncrypted Content:\n${content}\n\`\`\``
            }
            isEditable={false}
          />
        </div>
      </ScrollContainer>

      {showDecryptionModal && (
        <DecryptionModal
          encryptionKey={encryptionKey}
          setEncryptionKey={setEncryptionKey}
          onClose={() => setShowDecryptionModal(false)}
          handleDecryption={handleDecryption}
          decryptionError={decryptionError}
          encryptionMethod={encryptionMethod}
        />
      )}

      {showImageWarning && (
        <ImageWarningModal
          onClose={() => {
            setShowImageWarning(false);
            // If they haven't accepted and close the modal, show a placeholder
            if (!hasAcceptedImageWarning) {
              setContent(
                "```\nThis paste contains external images. Refresh the page to view the warning again.\n```",
              );
            }
          }}
          onAccept={handleAcceptImageWarning}
        />
      )}
    </div>
  );
}
