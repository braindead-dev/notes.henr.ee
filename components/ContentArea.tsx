import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from '../styles/page.module.css';
import { EditorView } from '@codemirror/view';
import '../styles/remark.css';
import '../styles/starryNight.css';

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

  const getCSSVariables = () => {
    if (typeof window === 'undefined') {
      return {
        fontSize: '16px',
        lineHeight: '1.5',
        header1Size: '32px',
        header2Size: '28px',
        header3Size: '24px',
        blockquoteBorder: '4px solid #ccc',
        blockquotePadding: '10px',
        codeBackground: '#f5f5f5',
        linkColor: '#0070f3',
        selectionBackground: '#b3d4fc',
      };
    }

    const root = getComputedStyle(document.documentElement);
    return {
      fontSize: root.getPropertyValue('--font-size').trim(),
      lineHeight: root.getPropertyValue('--line-height').trim(),
      header1Size: root.getPropertyValue('--header1-size').trim(),
      header2Size: root.getPropertyValue('--header2-size').trim(),
      header3Size: root.getPropertyValue('--header3-size').trim(),
      blockquoteBorder: root.getPropertyValue('--blockquote-border').trim(),
      blockquotePadding: root.getPropertyValue('--blockquote-padding').trim(),
      codeBackground: root.getPropertyValue('--code-background').trim(),
      linkColor: root.getPropertyValue('--link-color').trim(),
      selectionBackground: root.getPropertyValue('--selection-background').trim(),
    };
  };

  const cssVars = getCSSVariables();

  const myTheme = EditorView.theme({
    '&': {
      color: 'inherit',
      backgroundColor: 'transparent',
      fontFamily: 'inherit',
      fontSize: cssVars.fontSize,
      lineHeight: cssVars.lineHeight,
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
      fontSize: cssVars.header1Size,
      fontWeight: 'bold',
      margin: '10px 0',
    },
    '.cm-header-2': {
      fontSize: cssVars.header2Size,
      fontWeight: 'bold',
      margin: '0.75em 0',
    },
    '.cm-header-3': {
      fontSize: cssVars.header3Size,
      fontWeight: 'bold',
      margin: '0.83em 0',
    },
    '.cm-blockquote': {
      borderLeft: cssVars.blockquoteBorder,
      paddingLeft: cssVars.blockquotePadding,
      color: 'inherit',
      margin: '0.5em 0',
    },
    '.cm-inline-code': {
      backgroundColor: cssVars.codeBackground,
      padding: '2px 4px',
      borderRadius: 'inherit',
    },
    '.cm-link': {
      color: cssVars.linkColor,
      textDecoration: 'inherit',
    },
    '&.cm-focused .cm-selectionBackground, ::selection': {
      backgroundColor: cssVars.selectionBackground,
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
        if (!inline && className) {
          const language = className.replace('language-', '');
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
      return <div dangerouslySetInnerHTML={{ __html: html }} />;
    } else {
      return <code>{children}</code>;
    }
  };

  return isEditable && !viewMode ? (
    <div className={`${styles.contentEditable} content`}>
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
        className={`${styles.codeMirror} content`}
      />
    </div>
  ) : (
    <div className={`${styles.markdownView} content`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
      >
        {editorValue || ''}
      </ReactMarkdown>
    </div>
  );
};

export default ContentArea;
