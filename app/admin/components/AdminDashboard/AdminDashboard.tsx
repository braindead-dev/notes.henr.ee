// app/admin/components/AdminDashboard/AdminDashboard.tsx

import React from 'react';
import styles from '@/styles/AdminDashboard.module.css';

const AdminDashboard: React.FC<{ userName: string }> = ({ userName }) => {
  return (
    <div className={styles.contentWrapper}>
      <h1>Welcome, {userName}</h1>

      <div className={styles.dashboardContainer}>

        {/* Row 1: Performance and Analytics & Overview/Statistics */}
        <div className={styles.gridRow}>
          {/* Performance and Analytics */}
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Performance and Analytics</h2>
            <div className={styles.label}>Graph for pastes created over time (coming soon)</div>
            <h3>Average Paste Size</h3>
            <p>300 bytes</p>
            <p>include a notification system for alerts</p>
          </div>

          {/* Overview/Statistics */}
            <div className={styles.statsContainer}>
              <div className={styles.statsCard}>
                <h3>Total Pastes</h3>
                <p>1200</p>
                <h3>Recent Pastes</h3>
                <ul>
                  <li>Paste 1 - Encrypted</li>
                  <li>Paste 2 - Non-Encrypted</li>
                  <li>Paste 3 - Encrypted</li>
                </ul>
                <h3>Encryption Stats</h3>
                <p>75% Encrypted / 25% Non-Encrypted</p>
                <h3>Storage Usage</h3>
                <p>500MB used</p>
              </div>
            </div>
        </div>

        {/* Row 2: Paste Management Tools */}
        <div className={styles.row}>
          <div className={styles.container} style={{ width: '100%' }}>
            <h2 className={styles.sectionTitle}>Paste Management Tools</h2>
            <div className={styles.label}>Table with search and filter options AND Search bar and filter options  (coming soon)</div>
          </div>
        </div>

        {/* Row 3: Export and Backup Options */}
        <div className={styles.row}>
          <div className={styles.container} style={{ width: '100%' }}>
            <h2 className={styles.sectionTitle}>Export and Backup Options</h2>
            <div className={styles.label}>Export tools and backup schedule (coming soon)</div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
