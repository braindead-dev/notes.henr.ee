// app/admin/components/AccessDeniedPage.tsx

"use client";

import styles from "@/styles/page.module.css";

const AccessDeniedPage: React.FC = () => {
  return (
    <div className={styles.contentWrapper}>
      <h1>Access Denied</h1>
      <p>You do not have permission to access this page.</p>
    </div>
  );
};

export default AccessDeniedPage;
