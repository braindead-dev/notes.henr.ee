// app/admin/components/AdminDashboard.tsx

"use client";

import styles from "@/styles/page.module.css";

const AdminDashboard: React.FC<{ userName: string }> = ({ userName }) => {
  return (
    <div className={styles.contentWrapper}>
        <h1>Welcome, {userName}</h1>
        <p>This is your admin dashboard.</p>

        {/* Admin dashboard content goes here */}

    </div>
  );
};

export default AdminDashboard;