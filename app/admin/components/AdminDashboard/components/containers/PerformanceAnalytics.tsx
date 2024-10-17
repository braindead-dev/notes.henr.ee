import React from 'react';
import styles from '@/styles/AdminDashboard.module.css';

const PerformanceAnalytics: React.FC = () => {
  return (
    <div className={styles.statsCard}>
        <h2 className={styles.sectionTitle}>Performance and Analytics</h2>
        <div className={styles.label}>Graph for pastes created over time (coming soon)</div>
        <h3>Average Paste Size</h3>
        <p>300 bytes</p>
        <p>include a notification system for alerts</p>
    </div>
  );
};

export default PerformanceAnalytics;