import React, { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import styles from "@/styles/page.module.css";
import { EditorView } from "@codemirror/view";
import "github-markdown-css/github-markdown-light.css";
import "@/styles/markdownStyles.css";
import TurndownService from "turndown";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeRaw from "rehype-raw";

interface ContentAreaProps {
  content: string;
  handleContentChange?: (value: string) => void;
  viewMode?: boolean;
  isEditable?: boolean;
  isInfoPage?: boolean;
}

const turndownService = new TurndownService();

const escapeHtml = (unsafe: string) => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const ContentArea: React.FC<ContentAreaProps> = ({
  content,
  handleContentChange,
  viewMode = true,
  isEditable = false,
  isInfoPage = false,
}) => {
  const [editorValue, setEditorValue] = useState(content || "");
  const [isFocused, setIsFocused] = useState(false);
  const [editorView, setEditorView] = useState<EditorView | null>(null);

  useEffect(() => {
    setEditorValue(content);
  }, [content]);

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

  const handlePaste = (event: ClipboardEvent) => {
    event.preventDefault();
    const clipboardData = event.clipboardData || (window as any).clipboardData;
    const htmlData = clipboardData.getData("text/html");
    const textData = clipboardData.getData("text/plain");

    let markdown = htmlData ? turndownService.turndown(htmlData) : textData;

    if (editorView) {
      const { state } = editorView;
      const transaction = state.replaceSelection(markdown);
      editorView.dispatch(transaction);
    }
  };

  const pasteHandler = EditorView.domEventHandlers({
    paste: handlePaste,
  });

  const myTheme = EditorView.theme({
    "&": {
      color: "inherit",
      backgroundColor: "transparent",
      fontFamily: "inherit",
      fontSize: "16px",
      lineHeight: "1.5",
      border: "none",
    },
    ".cm-content": {
      caretColor: "#000",
      lineHeight: "inherit",
    },
    ".cm-scroller": {
      fontFamily: "inherit",
      fontSize: "inherit",
      lineHeight: "inherit",
      overflowWrap: "break-word",
      whiteSpace: "pre-wrap",
    },
    ".cm-gutters": {
      backgroundColor: "transparent",
      border: "none",
    },
    ".cm-line": {
      padding: "0",
      margin: "0",
      lineHeight: "inherit",
    },
    ".cm-header-1": {
      fontSize: "32px",
      fontWeight: "bold",
      margin: "10px 0",
    },
    ".cm-header-2": {
      fontSize: "28px",
      fontWeight: "bold",
      margin: "0.75em 0",
    },
    ".cm-header-3": {
      fontSize: "24px",
      fontWeight: "bold",
      margin: "0.83em 0",
    },
    ".cm-blockquote": {
      borderLeft: "4px solid #ccc",
      paddingLeft: "10px",
      color: "inherit",
      margin: "0.5em 0",
    },
    ".cm-inline-code": {
      backgroundColor: "#f5f5f5",
      padding: "2px 4px",
      borderRadius: "inherit",
    },
    ".cm-link": {
      color: "#0366d6", // GitHub link color
      textDecoration: "inherit",
    },
    "&.cm-focused .cm-selectionBackground, ::selection": {
      backgroundColor: "#b3d4fc",
    },
  });

  const safeContent = escapeHtml(content);

  return isEditable && !viewMode ? (
    <div className={`${styles.contentEditable} markdown-body`}>
      {!isFocused && !editorValue && (
        <div className={styles.placeholder}>Start typing here...</div>
      )}
      <CodeMirror
        value={editorValue}
        extensions={[
          markdown(),
          EditorView.lineWrapping,
          myTheme,
          pasteHandler,
        ]}
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
        onCreateEditor={(view) => setEditorView(view)}
      />
    </div>
  ) : (
    <div
      className={`${isInfoPage ? styles.markdownViewInfo : styles.markdownView} markdown-body markdown-content`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[
          rehypeKatex,
          rehypeRaw,
          [
            rehypeSanitize,
            {
              ...defaultSchema,
              attributes: {
                ...defaultSchema.attributes,
                code: [...(defaultSchema.attributes?.code || []), "className"],
                span: [...(defaultSchema.attributes?.span || []), "className"],
                "math-display": [
                  ...(defaultSchema.attributes?.["math-display"] || []),
                  "className",
                ],
                "math-inline": [
                  ...(defaultSchema.attributes?.["math-inline"] || []),
                  "className",
                ],
              },
              tagNames: [
                ...(defaultSchema.tagNames || []),
                "math-display",
                "math-inline",
              ],
            },
          ],
        ]}
      >
        {safeContent || ""}
      </ReactMarkdown>
    </div>
  );
};

export default ContentArea;
