// app/page.tsx

"use client";

import { useRef } from "react";
import TitleInput from "@/components/TitleInput";
import ContentArea from "@/components/ContentArea";
import PageHeader from "@/components/PageHeader";
import ScrollContainer from "@/components/ScrollContainer";
import JsonLd from "@/components/JsonLd";
import styles from "@/styles/page.module.css";
import { pageTitle, pageContent } from "@/content/home";

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Henry's Notes",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  description: "A free, simple, and secure markdown pastebin.",
  url: "https://notes.henr.ee",
  featureList: [
    "Markdown Support",
    "Client-side Encryption",
    "Free to Use",
    "No Account Required",
  ],
};

export default function Home() {
  const titleEditableRef = useRef<HTMLDivElement>(null);
  const title = pageTitle;
  const content = pageContent;

  return (
    <div className={styles.pageContainer}>
      <JsonLd data={websiteSchema} />
      <PageHeader />
      <ScrollContainer>
        <div className={styles.contentWrapper}>
          <TitleInput
            initialTitle={title}
            titleEditableRef={titleEditableRef}
            isEditable={false}
          />
          <ContentArea content={content} isEditable={false} isInfoPage={true} />
        </div>
      </ScrollContainer>
    </div>
  );
}
