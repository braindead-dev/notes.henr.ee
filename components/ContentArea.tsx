import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from '../styles/page.module.css';
import { EditorView } from '@codemirror/view';
import '../styles/markdownStyles.css';

const ContentArea: React.FC<ContentAreaProps> = ({
  handleContentChange,
  viewMode,
  content,
}) => {
  const [editorValue, setEditorValue] = useState(content || '');

  const onChange = (value: string) => {
    setEditorValue(value);
    handleContentChange(value);
  };

  const getCSSVariables = () => {
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

  // Custom theme for CodeMirror
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

  return viewMode ? (
    <div className={`${styles.markdownView} markdown-content`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content || ''}
      </ReactMarkdown>
    </div>
  ) : (
    <div className={`${styles.contentEditable} markdown-content`}>
      <CodeMirror
        value={editorValue}
        extensions={[markdown(), EditorView.lineWrapping, myTheme]}
        onChange={onChange}
        height="100%"
        basicSetup={{
          lineNumbers: false,
          highlightActiveLine: false,
          foldGutter: false,
        }}
        className={`${styles.codeMirror} markdown-content`}
      />
    </div>
  );
};

export default ContentArea;
