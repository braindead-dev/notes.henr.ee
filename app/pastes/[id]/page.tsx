"use client";
import { useState, useEffect, useRef} from 'react';
import { useParams } from 'next/navigation';
import Header from '../../../components/Header';
import TitleInput from '../../../components/TitleInput';
import ContentArea from '../../../components/ContentArea';
import ScrollContainer from '../../../components/ScrollContainer'; 
import styles from '../../../styles/page.module.css';
import '../../../styles/markdownStyles.css';

export default function Paste() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [scrollShadowVisible, setScrollShadowVisible] = useState(false);
  const titleEditableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchContent() {
      if (id) {
        try {
          const response = await fetch(`/api/getPaste?id=${id}`);
          const data = await response.json();

          if (response.ok) {
            setTitle(data.title);
            setContent(data.content);
          } else {
            setContent("Error: Paste not found.");
          }
        } catch {
          setContent("Error: Unable to fetch paste.");
        } finally {
          setLoading(false);
        }
      }
    }
    fetchContent();
  }, [id]);

  const handleCopy = () => {
    navigator.clipboard.writeText(`# ${title}\n\n${content}`);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.pageContainer}>
      <Header
        isPastePage={true}
        handleCopy={handleCopy}
        isCopied={isCopied}
        scrollShadowVisible={scrollShadowVisible}
      />
      <ScrollContainer handleScrollShadow={setScrollShadowVisible}>
        <TitleInput
          title={title}
          titleEditableRef={titleEditableRef}
          isEditable={false} // Non-editable in the paste page
        />
        <ContentArea
          content={content}
          isEditable={false} // Paste page should not be editable
        />
      </ScrollContainer>
    </div>
  );
}