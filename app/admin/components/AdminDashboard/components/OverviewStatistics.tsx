// app/admin/components/AdminDashboard/components/OverviewStatistics.tsx

import React, { useEffect, useState } from 'react';
import { VictoryPie } from 'victory';
import styles from '@/styles/AdminDashboard.module.css';

interface Paste {
  id: string;
  title: string;
  isEncrypted: boolean;
  encryptionMethod?: 'key' | 'password' | null;
}

interface EncryptionStats {
  keyEncrypted: number;
  passwordEncrypted: number;
  nonEncrypted: number;
}

const OverviewStatistics: React.FC = () => {
  const [totalPastes, setTotalPastes] = useState<number>(0);
  const [recentPastes, setRecentPastes] = useState<Paste[]>([]);
  const [encryptionStats, setEncryptionStats] = useState<EncryptionStats>({
    keyEncrypted: 0,
    passwordEncrypted: 0,
    nonEncrypted: 0
  });
  const [storageUsage, setStorageUsage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch('/api/admin/overview');
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

  const availableStorage = 512 - storageUsage;

  const keyEncryptedPercentage = ((encryptionStats.keyEncrypted / totalPastes) * 100).toFixed(2);
  const passwordEncryptedPercentage = ((encryptionStats.passwordEncrypted / totalPastes) * 100).toFixed(2);
  const nonEncryptedPercentage = ((encryptionStats.nonEncrypted / totalPastes) * 100).toFixed(2);

  return (
    <div className={styles.container}>
      <h3>Total Pastes</h3>
      <p>{totalPastes}</p>

      <h3>Recent Pastes</h3>
      <ul>
        {recentPastes.map((paste) => (
          <li key={paste.id} className={styles.pasteItem}>
            <a className={styles.unstyledLink} href={`https://notes.henr.ee/${paste.id}`} target="_blank" rel="noopener noreferrer">
              {paste.title}
            </a>
            {paste.isEncrypted && (
              paste.encryptionMethod === 'password' ? (
                <span className={styles.passwordTag}>PBKDF2</span>
              ) : (
                <span className={styles.keyTag}>Encrypted</span>
              )
            )}
          </li>
        ))}
      </ul>

      <div className={styles.pieChartsContainer}>
        <div className={styles.pieCard}>
          <h5>Encryption Stats</h5>
          <div className={styles.pieChart}>
            <VictoryPie
              data={[
                { y: encryptionStats.keyEncrypted },
                { y: encryptionStats.passwordEncrypted },
                { y: encryptionStats.nonEncrypted },
              ]}
              colorScale={['#4caf50', '#90caf9', '#ebebeb']}
              labels={() => null}
              radius={100}
              innerRadius={75}
            />
          </div>
          <div className={styles.key}>
            <div className={styles.keyItem}>
              <div className={styles.colorBox} style={{ backgroundColor: '#ebebeb' }}></div>
              <span>Regular - {nonEncryptedPercentage}%</span>
            </div>
            <div className={styles.keyItem}>
              <div className={styles.colorBox} style={{ backgroundColor: '#4caf50' }}></div>
              <span>Encrypted - {keyEncryptedPercentage}%</span>
            </div>
            <div className={styles.keyItem}>
              <div className={styles.colorBox} style={{ backgroundColor: '#90caf9' }}></div>
              <span>PBKDF2 - {passwordEncryptedPercentage}%</span>
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
              colorScale={['#90caf9', '#ebebeb']}
              labels={() => null}
              radius={100}
              innerRadius={75}
            />
          </div>
          <div className={styles.key}>
            <div className={styles.keyItem}>
              <span>{storageUsage.toFixed(2)} / 512 MB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewStatistics;
