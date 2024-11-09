// app/admin/components/AdminDashboard/components/PerformanceAnalytics.tsx

import React, { useEffect, useState } from 'react';
import styles from '@/styles/AdminDashboard.module.css';
import { Group } from '@visx/group';
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

  const nonZeroCounts = sortedCounts.filter((c) => c > 0);
  if (nonZeroCounts.length === 0) return '#9be9a8';

  const q1Index = Math.floor(nonZeroCounts.length / 4);
  const q2Index = Math.floor(nonZeroCounts.length / 2);
  const q3Index = Math.floor((3 * nonZeroCounts.length) / 4);

  const q1 = nonZeroCounts[q1Index];
  const q2 = nonZeroCounts[q2Index];
  const q3 = nonZeroCounts[q3Index];

  if (count <= q1) return '#9be9a8'; // Level 1: Light green (0-25th percentile)
  if (count <= q2) return '#40c463'; // Level 2: Medium green (25th-50th percentile)
  if (count <= q3) return '#30a14e'; // Level 3: Deep green (50th-75th percentile)
  return '#216e39'; // Level 4: Darkest green (75th-100th percentile)
};

const getBorderColorForCount = (count: number, sortedCounts: number[]): string => {
  if (count === 0) return '#dfe1e4';

  const nonZeroCounts = sortedCounts.filter((c) => c > 0);
  if (nonZeroCounts.length === 0) return '#94dda1';

  const q1Index = Math.floor(nonZeroCounts.length / 4);
  const q2Index = Math.floor(nonZeroCounts.length / 2);
  const q3Index = Math.floor((3 * nonZeroCounts.length) / 4);

  const q1 = nonZeroCounts[q1Index];
  const q2 = nonZeroCounts[q2Index];
  const q3 = nonZeroCounts[q3Index];

  if (count <= q1) return '#94dda1'; // Level 1: Light green border
  if (count <= q2) return '#40bb60'; // Level 2: Medium green border
  if (count <= q3) return '#309a4b'; // Level 3: Deep green border
  return '#226937'; // Level 4: Darkest green border
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

  // Add new state variables for the statistics
  const [totalPastes, setTotalPastes] = useState<number>(0);
  const [pastesLast7Days, setPastesLast7Days] = useState<number>(0);
  const [averagePasteSize, setAveragePasteSize] = useState<number>(0);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await fetch('/api/admin/analytics');
        const result = await response.json();

        const dailyData = result.dailyData as DailyData[];
        setTotalPastes(result.totalPastes);
        setPastesLast7Days(result.pastesLast7Days);
        setAveragePasteSize(result.averageSize); // averageSize is in KB

        // Generate complete date range for 188 days
        const endDate = new Date();
        endDate.setUTCHours(0, 0, 0, 0);
        const startDate = new Date();
        startDate.setUTCDate(endDate.getUTCDate() - 188);
        startDate.setUTCHours(0, 0, 0, 0);

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
        console.error('Error fetching analytics data:', error);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  // Calculate 'firstDate' as the Sunday on or before 'startDate'
  const [startYear, startMonth, startDayNum] = data[0].date
    .split('-')
    .map(Number);
  const startDateObj = new Date(Date.UTC(startYear, startMonth - 1, startDayNum));
  const dayOfWeek = startDateObj.getUTCDay();
  const firstDate = new Date(startDateObj);
  firstDate.setUTCDate(firstDate.getUTCDate() - dayOfWeek); // Adjust to Sunday

  // Calculate total weeks to set the width of the SVG
  const [endYear, endMonth, endDayNum] = data[data.length - 1].date
    .split('-')
    .map(Number);
  const endDateObj = new Date(Date.UTC(endYear, endMonth - 1, endDayNum));

  const totalDays = Math.ceil(
    (endDateObj.getTime() - firstDate.getTime()) / (24 * 60 * 60 * 1000)
  );
  const weeks = Math.ceil(totalDays / 7);

  // Dimensions
  const squareSize = 15;
  const gap = 5;
  const dayLabelWidth = 20;
  const monthLabelHeight = 20;
  const width = dayLabelWidth + (squareSize + gap) * weeks + 2;
  const height = monthLabelHeight + (squareSize + gap) * 7 + 2;

  // Generate month labels
  const monthLabels: { month: string; x: number }[] = [];
  let prevMonth = null;
  for (let i = 0; i <= weeks; i++) {
    const weekStartDate = new Date(firstDate);
    weekStartDate.setUTCDate(weekStartDate.getUTCDate() + i * 7);
    const month = weekStartDate.getUTCMonth();
    if (month !== prevMonth) {
      const monthName = weekStartDate.toLocaleString('default', { month: 'short' });
      const x = i * (squareSize + gap) + 2;
      monthLabels.push({ month: monthName, x });
      prevMonth = month;
    }
  }

  // Day labels
  const dayLabels = [
    { day: 'M', y: (squareSize + gap) * 1 + 2 },
    { day: 'W', y: (squareSize + gap) * 3 + 2 },
    { day: 'F', y: (squareSize + gap) * 5 + 2 },
  ];

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
      timeZone: 'UTC', // Ensure UTC time zone
    });
  };

  // Helper function to format bytes
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
      <h2 className={styles.sectionTitle}>Performance Analytics</h2>

      <div className={styles.heatmapContainer}>
        <svg width={width} height={height}>
          {/* Month labels */}
          <Group left={dayLabelWidth} top={0}>
            {monthLabels.map((label, idx) => (
              <text
                key={idx}
                x={label.x}
                y={monthLabelHeight - 5}
                fontSize={10}
                fill="#000"
              >
                {label.month}
              </text>
            ))}
          </Group>
          {/* Day labels */}
          <Group left={0} top={monthLabelHeight}>
            {dayLabels.map((label, idx) => (
              <text
                key={idx}
                x={10}
                y={label.y + squareSize / 2 + 3}
                fontSize={10}
                fill="#000"
                textAnchor="middle"
              >
                {label.day}
              </text>
            ))}
          </Group>
          {/* Heatmap squares */}
          <Group left={dayLabelWidth} top={monthLabelHeight}>
            {data.map((day) => {
              // Parse the date
              const [year, month, dayNum] = day.date.split('-').map(Number);
              const dateObj = new Date(Date.UTC(year, month - 1, dayNum));

              // Get day of week (0 = Sunday, 6 = Saturday)
              const dayOfWeek = dateObj.getUTCDay();

              // Calculate week index
              const weekDiff = Math.floor(
                (dateObj.getTime() - firstDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
              );

              const x = weekDiff * (squareSize + gap) + 2;
              const y = dayOfWeek * (squareSize + gap) + 2;

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

      <h2> Statistics </h2>
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
