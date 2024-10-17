// app/admin/components/AdminDashboard/AdminDashboard.tsx

import React from 'react';
import PerformanceAnalytics from './components/containers/PerformanceAnalytics';
import OverviewStatistics from './components/containers/OverviewStatistics';
import PasteManagement from './components/containers/PasteManagement';
import ExportBackup from './components/containers/ExportBackup';
import styles from '@/styles/AdminDashboard.module.css';

const AdminDashboard: React.FC<{ userName: string }> = ({ userName }) => {
  return (
    <div className={styles.contentWrapper}>
      <h1>Welcome, {userName}</h1>

      <div className={styles.dashboardContainer}>

        {/* Row 1: Performance and Analytics & Overview/Statistics */}
        <div className={styles.gridRow}>
          <PerformanceAnalytics />
          <OverviewStatistics />
        </div>

        {/* Row 2: Paste Management Tools */}
        <div className={styles.row}>
          <PasteManagement />
        </div>

        {/* Row 3: Export and Backup Options */}
        <div className={styles.row}>
          <ExportBackup />
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
