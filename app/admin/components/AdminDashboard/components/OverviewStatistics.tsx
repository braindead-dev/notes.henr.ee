// app/admin/components/AdminDashboard/components/OverviewStatistics.tsx

import React, { useEffect, useState } from 'react';
import { BarStackHorizontal } from '@visx/shape';
import { Group } from '@visx/group';
import { scaleLinear, scaleBand, scaleOrdinal } from '@visx/scale';
import styles from '@/styles/AdminDashboard.module.css';
import { withTooltip, Tooltip, defaultStyles } from '@visx/tooltip';
import { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip';

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

// Add tooltip type definitions
type TooltipData = {
  key: string;
  value: number;
  percentage: number;
  color: string;
};

const OverviewStatistics: React.FC<WithTooltipProvidedProps<TooltipData>> = ({
  tooltipOpen,
  tooltipLeft,
  tooltipTop,
  tooltipData,
  hideTooltip,
  showTooltip,
}) => {
  const [totalPastes, setTotalPastes] = useState<number>(0);
  const [recentPastes, setRecentPastes] = useState<Paste[]>([]);
  const [encryptionStats, setEncryptionStats] = useState<EncryptionStats>({
    keyEncrypted: 0,
    passwordEncrypted: 0,
    nonEncrypted: 0,
  });
  const [storageUsage, setStorageUsage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [pastesLast7Days, setPastesLast7Days] = useState<number>(0);
  const [averagePasteSize, setAveragePasteSize] = useState<number>(0);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch('/api/admin/overview');
        const data = await response.json();

        setTotalPastes(data.totalPastes);
        setRecentPastes(data.recentPastes);
        setEncryptionStats(data.encryptionStats);
        setStorageUsage(data.storageUsage);
        setPastesLast7Days(data.pastesLast7Days);
        setAveragePasteSize(data.averageSize);
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

  // Add tooltip styles
  const tooltipStyles = {
    ...defaultStyles,
    minWidth: 60,
    backgroundColor: 'rgba(0,0,0,0.9)',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '4px',
  };

  // Add this helper function
  const getTooltipData = (
    key: string,
    value: number,
    total: number,
    color: string
  ) => {
    const percentage = (value / total) * 100;
    const label = 
      key === 'keyEncrypted' 
        ? 'Key Encrypted'
        : key === 'passwordEncrypted'
        ? 'Password Encrypted'
        : key === 'used'
        ? 'Used Storage'
        : key === 'unused'
        ? 'Available Storage'
        : 'Not Encrypted';

    return {
      key: label,
      value,
      percentage,
      color,
    };
  };

  // Add this helper function right after the tooltipStyles object
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className={styles.container}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>Total Pastes</h3>
          <p className={styles.statValue}>{totalPastes}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Last 7 Days</h3>
          <p className={styles.statValue}>{pastesLast7Days}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Average Size</h3>
          <p className={styles.statValue}>{formatBytes(averagePasteSize * 1024)}</p>
        </div>
      </div>

      <table className={styles.pasteTable}>
        <thead>
          <tr>
            <th>Recent Pastes</th>
          </tr>
        </thead>
        <tbody>
          {recentPastes.map((paste) => (
            <tr key={paste.id}>
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
                          onMouseLeave={() => hideTooltip()}
                          onMouseEnter={(event) => {
                            const value = 
                              bar.key === 'keyEncrypted' 
                                ? encryptionStats.keyEncrypted
                                : bar.key === 'passwordEncrypted'
                                ? encryptionStats.passwordEncrypted
                                : encryptionStats.nonEncrypted;

                            const bounds = event.currentTarget.getBoundingClientRect();
                            showTooltip({
                              tooltipData: getTooltipData(
                                bar.key,
                                value,
                                totalEncryption,
                                bar.color
                              ),
                              tooltipTop: bounds.top,
                              tooltipLeft: bounds.right + 10,
                            });
                          }}
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
                          onMouseLeave={() => hideTooltip()}
                          onMouseEnter={(event) => {
                            const value = bar.key === 'used' ? storageUsage : availableStorage;
                            const bounds = event.currentTarget.getBoundingClientRect();
                            showTooltip({
                              tooltipData: getTooltipData(
                                bar.key,
                                value,
                                totalStorage,
                                bar.color
                              ),
                              tooltipTop: bounds.top,
                              tooltipLeft: bounds.right + 10,
                            });
                          }}
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

      {/* Update the tooltip render */}
      {tooltipOpen && tooltipData && (
        <Tooltip 
          top={tooltipTop} 
          left={tooltipLeft} 
          style={{
            ...defaultStyles,
            backgroundColor: 'rgba(0,0,0,0.75)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '4px',
            position: 'fixed',
            pointerEvents: 'none',
          }}
        >
          <div style={{ 
            color: tooltipData.color,
            lineHeight: 1.2,
            marginBottom: '4px'
          }}>
            <strong>{tooltipData.key}</strong>
          </div>
          <div style={{ lineHeight: 1.3 }}>{tooltipData.percentage.toFixed(2)}%</div>
          <div style={{ lineHeight: 1.3 }}>
            {tooltipData.key.includes('Storage') 
              ? `${tooltipData.value.toFixed(2)} MB`
              : `${Math.round(tooltipData.value)} Pastes`
            }
          </div>
        </Tooltip>
      )}
    </div>
  );
};

// Export with tooltip HOC
export default withTooltip<any, TooltipData>(OverviewStatistics);