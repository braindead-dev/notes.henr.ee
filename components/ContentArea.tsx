import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from '../styles/page.module.css';
import { EditorView } from '@codemirror/view';
import '../styles/markdownStyles.css';

import '../styles/remark.css';
import '../styles/starryNight.css';

interface ContentAreaProps {
  content: string;
  handleContentChange?: (value: string) => void; // Optional in case it's used in the paste page
  viewMode?: boolean; // Optional, as paste pages will always be in view mode
  isEditable?: boolean; // To determine if the content area is editable or just displays content
}

const ContentArea: React.FC<ContentAreaProps> = ({
  content,
  handleContentChange,
  viewMode = true,
  isEditable = false, // By default, it’s not editable
}) => {
  const [editorValue, setEditorValue] = useState(content || '');
  const [isFocused, setIsFocused] = useState(false); // Track focus state

  useEffect(() => {
    setEditorValue(content); // Sync editor value with incoming content changes
  }, [content]);

  const onChange = (value: string) => {
    setEditorValue(value);
    if (handleContentChange) {
      handleContentChange(value);
    }
  };

  const handleFocus = () => {
    setIsFocused(true); // Textbox is focused
  };

  const handleBlur = () => {
    setIsFocused(false); // Textbox is blurred
  };

  const getCSSVariables = () => {

    if (typeof window === "undefined") {
      // Return some default values for SSR
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

  return isEditable && !viewMode ? (
    <div className={`${styles.contentEditable} markdown-content`}>
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
        className={`${styles.codeMirror} markdown-content`}
      />
    </div>
  ) : (
    <div className={`${styles.markdownView} markdown-content`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {editorValue || ''}
      </ReactMarkdown>
    </div>
  );
};

export default ContentArea;
