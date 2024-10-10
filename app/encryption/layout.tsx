// app/encryption/layout.tsx (for server-side metadata)
export const metadata = {
    title: "Encryption Details | Henry's Notes",
    description: "Military-grade encryption protecting your pastes.",
  };
  
  export default function EncryptionLayout({
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
  