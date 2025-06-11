import React from "react";
import styles from "@/styles/page.module.css";

interface CopyButtonProps {
  handleCopy?: () => void;
  isCopied?: boolean;
}

const CopyButton: React.FC<CopyButtonProps> = ({ handleCopy, isCopied }) => (
  <button
    className={styles.toggleButton}
    style={{
      backgroundColor: isCopied ? "#008001" : "#eaeaea",
      border: isCopied ? "2px solid #439443" : "2px solid #bababa",
      color: isCopied ? "#fff" : "#222222",
      width: "auto",
    }}
    onClick={handleCopy}
  >
    {isCopied ? "Copied!" : "Copy"}
  </button>
);

export default CopyButton;
