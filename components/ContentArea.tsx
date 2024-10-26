import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from '../styles/page.module.css';
import { EditorView } from '@codemirror/view';
import 'github-markdown-css/github-markdown.css';
import '../styles/starryNight.css';
import '../styles/markdownStyles.css';

import { createStarryNight, common } from '@wooorm/starry-night';
import { toHtml } from 'hast-util-to-html';

interface ContentAreaProps {
  content: string;
  handleContentChange?: (value: string) => void;
  viewMode?: boolean;
  isEditable?: boolean;
}

type StarryNightType = Awaited<ReturnType<typeof createStarryNight>>;

const ContentArea: React.FC<ContentAreaProps> = ({
  content,
  handleContentChange,
  viewMode = true,
  isEditable = false,
}) => {
  const [editorValue, setEditorValue] = useState(content || '');
  const [isFocused, setIsFocused] = useState(false);
  const [starryNight, setStarryNight] = useState<StarryNightType | null>(null);

  useEffect(() => {
    setEditorValue(content);
  }, [content]);

  // Load Starry Night for syntax highlighting
  useEffect(() => {
    async function loadStarryNight() {
      const sn = await createStarryNight(common);
      setStarryNight(sn);
    }
    if (!starryNight) {
      loadStarryNight();
    }
  }, [starryNight]);

  const onChange = (value: string) => {
    setEditorValue(value);
    if (handleContentChange) {
      handleContentChange(value);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const myTheme = EditorView.theme({
    '&': {
      color: 'inherit',
      backgroundColor: 'transparent',
      fontFamily: 'inherit',
      fontSize: '16px',
      lineHeight: '1.5',
      border: 'none',
    },
    '.cm-content': {
      caretColor: '#000',
      lineHeight: 'inherit',
    },
    '.cm-scroller': {
      fontFamily: 'inherit',
      fontSize: 'inherit',
      lineHeight: 'inherit',
      overflowWrap: 'break-word',
      whiteSpace: 'pre-wrap',
    },
    '.cm-gutters': {
      backgroundColor: 'transparent',
      border: 'none',
    },
    '.cm-line': {
      padding: '0',
      margin: '0',
      lineHeight: 'inherit',
    },
    '.cm-header-1': {
      fontSize: '32px',
      fontWeight: 'bold',
      margin: '10px 0',
    },
    '.cm-header-2': {
      fontSize: '28px',
      fontWeight: 'bold',
      margin: '0.75em 0',
    },
    '.cm-header-3': {
      fontSize: '24px',
      fontWeight: 'bold',
      margin: '0.83em 0',
    },
    '.cm-blockquote': {
      borderLeft: '4px solid #ccc',
      paddingLeft: '10px',
      color: 'inherit',
      margin: '0.5em 0',
    },
    '.cm-inline-code': {
      backgroundColor: '#f5f5f5',
      padding: '2px 4px',
      borderRadius: 'inherit',
    },
    '.cm-link': {
      color: '#0366d6', // GitHub link color
      textDecoration: 'inherit',
    },
    '&.cm-focused .cm-selectionBackground, ::selection': {
      backgroundColor: '#b3d4fc',
    },
  });

  // Custom CodeBlock component using Starry Night for syntax highlighting
  const CodeBlock: React.FC<{
    node: any;
    inline?: boolean;
    className?: string;
    children?: React.ReactNode[];
    [key: string]: any;
  }> = ({ node, inline, className, children, ...props }) => {
    const [html, setHtml] = useState<string | null>(null);

    useEffect(() => {
      if (starryNight) {
        const content = String(children?.[0] || '');
        if (!inline) {
          const language = className?.replace('language-', '') || 'text';
          const scope = starryNight.flagToScope(language);
          if (scope) {
            const highlighted = starryNight.highlight(content, scope);
            const htmlString = toHtml(highlighted);
            setHtml(htmlString);
          } else {
            setHtml(`<pre><code>${content}</code></pre>`);
          }
        } else {
          setHtml(`<code>${content}</code>`);
        }
      }
    }, [children, className, inline, starryNight]);

    if (html) {
      return (
        <div
          className="code-container"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    } else {
      return <code>{children}</code>;
    }
  };

  return isEditable && !viewMode ? (
    <div className={`${styles.contentEditable} markdown-body`}>
      {!isFocused && !editorValue && (
        <div className={styles.placeholder}>Start typing here...</div>
      )}
      <CodeMirror
        value={editorValue}
        extensions={[markdown(), EditorView.lineWrapping, myTheme]}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        height="100%"
        basicSetup={{
          lineNumbers: false,
          highlightActiveLine: false,
          foldGutter: false,
        }}
        className={`${styles.codeMirror} markdown-body`}
      />
    </div>
  ) : (
    <div className={`${styles.markdownView} markdown-body markdown-content`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
      >
        {editorValue || ''}
      </ReactMarkdown>
    </div>
  );
};

export default ContentArea;
