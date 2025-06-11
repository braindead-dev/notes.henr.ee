import React from "react";
import styles from "@/styles/page.module.css";
import { signOut } from "next-auth/react";

const SignOutButton: React.FC = () => {
  return (
    <button
      className={styles.publishButton}
      onClick={() => signOut({ callbackUrl: "/auth/signin" })}
    >
      Sign Out
    </button>
  );
};

export default SignOutButton;
