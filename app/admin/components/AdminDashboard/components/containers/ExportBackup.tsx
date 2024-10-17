import React from 'react';
import styles from '@/styles/AdminDashboard.module.css';

const ExportBackup: React.FC = () => {
  return (
    <div className={styles.container} style={{ width: '100%' }}>
      <h2 className={styles.sectionTitle}>Export and Backup Options</h2>
      <div className={styles.label}>Export tools and backup schedule (coming soon)</div>
    </div>
  );
};

export default ExportBackup;
