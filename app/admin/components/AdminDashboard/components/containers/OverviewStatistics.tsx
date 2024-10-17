// app/admin/components/AdminDashboard/components/OverviewStatistics.tsx

import React, { useEffect, useState } from 'react';
import { VictoryPie } from 'victory';
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
  const maxStorage = 512; // Maximum storage in MB

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

  const availableStorage = maxStorage - storageUsage; // Calculate available storage

  const encryptedPercentage = ((encryptionStats.encrypted / totalPastes) * 100).toFixed(2);
  const nonEncryptedPercentage = ((encryptionStats.nonEncrypted / totalPastes) * 100).toFixed(2);

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

        {/* Encryption Stats and Storage Usage Pie Charts */}
        <div className={styles.pieChartsContainer}>
            <div className={styles.pieCard}>
                <h5>Encryption Stats</h5>
                <div className={styles.pieChart}>
                    <VictoryPie
                        data={[
                            { y: encryptionStats.encrypted },
                            { y: encryptionStats.nonEncrypted },
                        ]}
                        colorScale={['#4caf50', '#dbdbdb']}
                        labels={() => null} // Remove labels
                        radius={100}
                        innerRadius={65}
                    />
                </div>
                {/* Encryption Stats Key */}
                <div className={styles.key}>
                    <div className={styles.keyItem}>
                        <div className={styles.colorBox} style={{ backgroundColor: '#dbdbdb' }}></div>
                        <span>Regular - {nonEncryptedPercentage}%</span>
                    </div>
                    <div className={styles.keyItem}>
                        <div className={styles.colorBox} style={{ backgroundColor: '#4caf50' }}></div>
                        <span>Encrypted - {encryptedPercentage}%</span>
                    </div>
                </div>
            </div>

            <div className={styles.pieCard}>
                <h5>Storage Usage</h5>
                <div className={styles.pieChart}>
                    <VictoryPie
                        data={[
                            { y: storageUsage },
                            { y: availableStorage },
                        ]}
                        colorScale={['#90caf9', '#dbdbdb']}
                        labels={() => null} // Remove labels
                        radius={100}
                        innerRadius={65}
                    />
                </div>
                {/* Storage Usage Key */}
                <div className={styles.key}>
                    <div className={styles.keyItem}>
                        <span>{storageUsage.toFixed(2)} / {maxStorage} MB </span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewStatistics;
