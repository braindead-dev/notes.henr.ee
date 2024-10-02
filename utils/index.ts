export const stripMarkdown = (text: string): string => {
    return text.replace(/[#*_`~\[\]]/g, '');
  };
  
  export const insertTextAtCursor = (text: string): void => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    range.deleteContents();
    const textNode = document.createTextNode(text);
    range.insertNode(textNode);
    // Move the cursor after the inserted text
    range.setStartAfter(textNode);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  };
  