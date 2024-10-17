import React, { useEffect, useState } from 'react';
import styles from '@/styles/AdminDashboard.module.css';

interface Paste {
  _id: string;
  title: string;
  isEncrypted: boolean;
}

interface EncryptionStats {
  encrypted: number;
  nonEncrypted: number;
}

const OverviewStatistics: React.FC = () => {
  const [totalPastes, setTotalPastes] = useState<number>(0);
  const [recentPastes, setRecentPastes] = useState<Paste[]>([]);
  const [encryptionStats, setEncryptionStats] = useState<EncryptionStats>({ encrypted: 0, nonEncrypted: 0 });
  const [storageUsage, setStorageUsage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch('/api/admin');
        const data = await response.json();

        setTotalPastes(data.totalPastes);
        setRecentPastes(data.recentPastes);
        setEncryptionStats(data.encryptionStats);
        setStorageUsage(data.storageUsage);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching overview statistics:', error);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.statsContainer}>
      <div className={styles.statsCard}>
        <h3>Total Pastes</h3>
        <p>{totalPastes}</p>
        
        <h3>Recent Pastes</h3>
        <ul>
          {recentPastes.map((paste) => (
            <li key={paste._id}>
              {paste.title} - {paste.isEncrypted ? 'Encrypted' : 'Non-Encrypted'}
            </li>
          ))}
        </ul>

        <h3>Encryption Stats</h3>
        <p>{encryptionStats.encrypted} Encrypted / {encryptionStats.nonEncrypted} Non-Encrypted</p>

        <h3>Storage Usage</h3>
        <p>{storageUsage.toFixed(2)} MB used</p>
      </div>
    </div>
  );
};

export default OverviewStatistics;
