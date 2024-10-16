// app/admin/components/NotAuthenticatedPage.tsx

"use client";

import { signIn } from "next-auth/react";
import styles from "@/styles/page.module.css";
import { FaGithub } from "react-icons/fa"; // Import GitHub logo

const NotAuthenticatedPage: React.FC = () => {
  return (
    <div className={styles.signInContainer}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Admin Dashboard</h2>
        <p>You need to sign in to access the admin dashboard.</p>
        <div className={styles.modalActionsRight}>
          <button
            className={styles.oauthButton}  // Use the new button styling class
            onClick={() => signIn("github", { callbackUrl: "/admin" })}
          >
            Sign in with GitHub
            <FaGithub className={styles.githubIcon} /> 
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotAuthenticatedPage;
