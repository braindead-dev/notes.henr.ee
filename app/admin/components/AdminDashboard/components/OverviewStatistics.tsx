// app/admin/components/AdminDashboard/components/OverviewStatistics.tsx

import React, { useEffect, useState } from 'react';
import { BarStackHorizontal } from '@visx/shape';
import { Group } from '@visx/group';
import { scaleLinear, scaleBand, scaleOrdinal } from '@visx/scale';
import styles from '@/styles/AdminDashboard.module.css';

interface Paste {
  id: string;
  title: string;
  encryptionMethod: 'key' | 'password' | null;
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
    nonEncrypted: 0,
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

  // Calculate percentages for Encryption Stats
  const totalEncryption =
    encryptionStats.keyEncrypted +
    encryptionStats.passwordEncrypted +
    encryptionStats.nonEncrypted;

  const keyEncryptedPercentage =
    totalEncryption > 0 ? encryptionStats.keyEncrypted / totalEncryption : 0;
  const passwordEncryptedPercentage =
    totalEncryption > 0 ? encryptionStats.passwordEncrypted / totalEncryption : 0;
  const nonEncryptedPercentage =
    totalEncryption > 0 ? encryptionStats.nonEncrypted / totalEncryption : 0;

  const encryptionData = [
    {
      label: 'Encryption',
      keyEncrypted: keyEncryptedPercentage,
      passwordEncrypted: passwordEncryptedPercentage,
      nonEncrypted: nonEncryptedPercentage,
    },
  ];
  const encryptionKeys = ['keyEncrypted', 'passwordEncrypted', 'nonEncrypted'];
  const encryptionColorScale = scaleOrdinal<string, string>({
    domain: encryptionKeys,
    range: ['#4caf50', '#90caf9', '#ebebeb'],
  });

  // Dimensions
  const width = 300;
  const height = 20;

  const margin = { top: 0, left: 0, right: 0, bottom: 0 };
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  // Scales for Encryption Stats
  const xScaleEncryption = scaleLinear<number>({
    domain: [0, 1], // Percentages from 0% to 100%
    range: [0, xMax],
  });
  const yScaleEncryption = scaleBand<string>({
    domain: encryptionData.map((d) => d.label),
    range: [0, yMax],
    padding: 0,
  });

  // Calculate percentages for Storage Usage
  const totalStorage = 512; // Assuming 512 is the total storage capacity
  const usedPercentage = totalStorage > 0 ? storageUsage / totalStorage : 0;
  const unusedPercentage = totalStorage > 0 ? availableStorage / totalStorage : 0;

  const storageData = [
    {
      label: 'Storage',
      used: usedPercentage,
      unused: unusedPercentage,
    },
  ];
  const storageKeys = ['used', 'unused'];
  const storageColorScale = scaleOrdinal<string, string>({
    domain: storageKeys,
    range: ['#90caf9', '#ebebeb'],
  });

  // Scales for Storage Usage
  const xScaleStorage = scaleLinear<number>({
    domain: [0, 1], // Percentages from 0% to 100%
    range: [0, xMax],
  });
  const yScaleStorage = scaleBand<string>({
    domain: storageData.map((d) => d.label),
    range: [0, yMax],
    padding: 0,
  });

  return (
    <div className={styles.container}>
      <h3>Total Pastes</h3>
      <p>{totalPastes}</p>

      <h3>Recent Pastes</h3>
      <table style={{ marginTop: '12px', marginBottom: '12px' }}>
        <tbody>
          {recentPastes.map((paste) => (
            <tr key={paste.id} className={styles.tableRow}>
              <td className={styles.tableCell}>
                <a
                  className={styles.unstyledLink}
                  href={`https://notes.henr.ee/${paste.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ marginRight: '8px' }}
                >
                  {paste.title}
                </a>
                {paste.encryptionMethod && (
                  <span
                    className={
                      paste.encryptionMethod === 'password'
                        ? styles.passwordTag
                        : styles.keyTag
                    }
                  >
                    {paste.encryptionMethod === 'password' ? 'PBKDF2' : 'Encrypted'}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.chartsContainer}>
        {/* Encryption Stats */}
        <div className={styles.graphCard}>
          <b>Encryption Stats</b>
          <div className={styles.barChart}>
            <svg width={width} height={height}>
              <Group>
                <BarStackHorizontal
                  data={encryptionData}
                  keys={encryptionKeys}
                  y={(d) => d.label}
                  xScale={xScaleEncryption}
                  yScale={yScaleEncryption}
                  color={encryptionColorScale}
                >
                  {(barStacks) =>
                    barStacks.map((barStack) =>
                      barStack.bars.map((bar) => (
                        <rect
                          key={`bar-stack-${barStack.index}-${bar.index}`}
                          x={bar.x}
                          y={bar.y}
                          width={bar.width}
                          height={bar.height}
                          fill={bar.color}
                        />
                      ))
                    )
                  }
                </BarStackHorizontal>
              </Group>
            </svg>
          </div>
        </div>

        {/* Storage Usage */}
        <div className={styles.graphCard}>
          <b>Storage Usage</b>
          <div className={styles.barChart}>
            <svg width={width} height={height}>
              <Group>
                <BarStackHorizontal
                  data={storageData}
                  keys={storageKeys}
                  y={(d) => d.label}
                  xScale={xScaleStorage}
                  yScale={yScaleStorage}
                  color={storageColorScale}
                >
                  {(barStacks) =>
                    barStacks.map((barStack) =>
                      barStack.bars.map((bar) => (
                        <rect
                          key={`bar-stack-${barStack.index}-${bar.index}`}
                          x={bar.x}
                          y={bar.y}
                          width={bar.width}
                          height={bar.height}
                          fill={bar.color}
                        />
                      ))
                    )
                  }
                </BarStackHorizontal>
              </Group>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewStatistics;