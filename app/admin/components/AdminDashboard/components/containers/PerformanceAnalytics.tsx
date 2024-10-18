import React from 'react';
import styles from '@/styles/AdminDashboard.module.css';

const PerformanceAnalytics: React.FC = () => {
  return (
    <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Performance and Analytics</h2>
        <div className={styles.label}>Graph for pastes created over time (coming soon)</div>
        <p>Average Size 300 bytes</p>
    </div>
  );
};

export default PerformanceAnalytics;