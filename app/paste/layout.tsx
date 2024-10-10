// app/encryption/layout.tsx (for server-side metadata)
export const metadata = {
    title: "Paste | Henry's Notes",
    description: "Create a markdown-based paste.",
  };
  
  export default function PasteLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div>
        {children}
      </div>
    );
  }
  