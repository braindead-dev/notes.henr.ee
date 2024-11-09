// app/admin/components/AdminDashboard/components/PerformanceAnalytics.tsx

import React, { useEffect, useState } from 'react';
import styles from '@/styles/AdminDashboard.module.css';
import { Group } from '@visx/group';
import { scaleLinear } from '@visx/scale';
import { Tooltip, withTooltip, defaultStyles } from '@visx/tooltip';
import { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip';

interface DailyData {
  date: string; // 'YYYY-MM-DD' in UTC
  count: number;
}

interface TooltipData {
  date: string;
  count: number;
}

const getColorForCount = (count: number, sortedCounts: number[]): string => {
  if (count === 0) return '#ebedf0';
  
  const nonZeroCounts = sortedCounts.filter(c => c > 0);
  if (nonZeroCounts.length === 0) return '#9be9a8';
  
  const q1Index = Math.floor(nonZeroCounts.length / 4);
  const q2Index = Math.floor(nonZeroCounts.length / 2);
  const q3Index = Math.floor(3 * nonZeroCounts.length / 4);
  
  const q1 = nonZeroCounts[q1Index];
  const q2 = nonZeroCounts[q2Index];
  const q3 = nonZeroCounts[q3Index];
  
  if (count <= q1) return '#9be9a8';      // Level 1: Light green (0-25th percentile)
  if (count <= q2) return '#41c464';      // Level 2: Medium green (25th-50th percentile)
  if (count <= q3) return '#31a14e';      // Level 3: Deep green (50th-75th percentile)
  return '#206e39';                       // Level 4: Darkest green (75th-100th percentile)
};

const getBorderColorForCount = (count: number, sortedCounts: number[]): string => {
  if (count === 0) return '#dfe1e4';
  
  const nonZeroCounts = sortedCounts.filter(c => c > 0);
  if (nonZeroCounts.length === 0) return '#94dda1';
  
  const q1Index = Math.floor(nonZeroCounts.length / 4);
  const q2Index = Math.floor(nonZeroCounts.length / 2);
  const q3Index = Math.floor(3 * nonZeroCounts.length / 4);
  
  const q1 = nonZeroCounts[q1Index];
  const q2 = nonZeroCounts[q2Index];
  const q3 = nonZeroCounts[q3Index];
  
  if (count <= q1) return '#94dda1';      // Level 1: Light green border
  if (count <= q2) return '#40bb60';      // Level 2: Medium green border
  if (count <= q3) return '#309a4b';      // Level 3: Deep green border
  return '#226937';                       // Level 4: Darkest green border
};

const PerformanceAnalytics: React.FC<WithTooltipProvidedProps<TooltipData>> = ({
  tooltipOpen,
  tooltipLeft,
  tooltipTop,
  tooltipData,
  showTooltip,
  hideTooltip,
}) => {
  const [data, setData] = useState<DailyData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const response = await fetch('/api/admin/performance');
        const dailyData = (await response.json()) as DailyData[];

        // Generate complete date range for last 6 months
        const endDate = new Date();
        endDate.setUTCHours(0, 0, 0, 0);
        const startDate = new Date(Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth() - 6, endDate.getUTCDate()));

        const dateMap = new Map<string, number>(
          dailyData.map((d: DailyData) => [d.date, d.count])
        );

        const allDates: DailyData[] = [];
        let currentDate = new Date(startDate);

        while (currentDate <= endDate) {
          const dateStr = getUTCDateString(currentDate);
          const count = dateMap.get(dateStr) ?? 0;
          allDates.push({
            date: dateStr,
            count: count,
          });
          // Move to next day in UTC
          currentDate.setUTCDate(currentDate.getUTCDate() + 1);
        }

        setData(allDates);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching performance data:', error);
      }
    };

    fetchPerformanceData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  // Dimensions
  const squareSize = 15;
  const gap = 5;
  const weeks = Math.ceil(data.length / 7); // Calculate number of weeks
  const days = 7;
  const width = (squareSize + gap) * weeks + 2;
  const height = (squareSize + gap) * days + 2;

  // Color scale
  const counts = data.map((d) => d.count);
  const sortedCounts = [...counts].sort((a, b) => a - b);

  // Format date for tooltip
  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.toLocaleDateString(undefined, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC', // Specify UTC time zone here
    });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>Performance Analytics</h2>
      <div className={styles.heatmapContainer}>
        <svg width={width} height={height}>
          <Group>
            {data.map((day, i) => {
              const weekIndex = Math.floor(i / 7);
              const dayIndex = i % 7;
              const x = weekIndex * (squareSize + gap) + 2;
              const y = dayIndex * (squareSize + gap) + 2;

              return (
                <rect
                  key={day.date}
                  x={x}
                  y={y}
                  width={squareSize}
                  height={squareSize}
                  fill={getColorForCount(day.count, sortedCounts)}
                  stroke={getBorderColorForCount(day.count, sortedCounts)}
                  strokeWidth={1.5}
                  rx={3}
                  onMouseEnter={(event) => {
                    const bounds = event.currentTarget.getBoundingClientRect();
                    showTooltip({
                      tooltipData: {
                        date: formatDate(day.date),
                        count: day.count,
                      },
                      tooltipTop: bounds.top - 8,
                      tooltipLeft: bounds.left + squareSize / 2,
                    });
                  }}
                  onMouseLeave={() => hideTooltip()}
                />
              );
            })}
          </Group>
        </svg>
      </div>

      {tooltipOpen && tooltipData && (
        <Tooltip
          top={tooltipTop}
          left={tooltipLeft}
          style={{
            ...defaultStyles,
            backgroundColor: 'rgba(0,0,0,0.85)',
            color: 'white',
            padding: '8px 10px',
            borderRadius: '6px',
            fontSize: '12px',
            transform: 'translate(-55%, -120%)',
            zIndex: 9999,
            position: 'fixed',
            pointerEvents: 'none',
          }}
        >
          <div>
            {tooltipData.count} paste{tooltipData.count !== 1 ? 's' : ''} on{' '}
            {tooltipData.date}.
          </div>
        </Tooltip>
      )}
    </div>
  );
};

// Helper function to get date string in 'YYYY-MM-DD' format in UTC
function getUTCDateString(date: Date): string {
  return (
    date.getUTCFullYear() +
    '-' +
    String(date.getUTCMonth() + 1).padStart(2, '0') +
    '-' +
    String(date.getUTCDate()).padStart(2, '0')
  );
}

export default withTooltip<{}, TooltipData>(PerformanceAnalytics);
