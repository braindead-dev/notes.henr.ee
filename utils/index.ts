export const stripMarkdown = (text: string): string => {
    return text.replace(/[#*_`~\[\]]/g, '');
  };
  