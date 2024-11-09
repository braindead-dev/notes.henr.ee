// app/admin/components/AdminDashboard/components/PerformanceAnalytics.tsx

import React, { useEffect, useState } from 'react';
import styles from '@/styles/AdminDashboard.module.css';
import { Group } from '@visx/group';
import { scaleLinear } from '@visx/scale';
import { Tooltip, withTooltip, defaultStyles } from '@visx/tooltip';
import { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip';

interface DailyData {
  date: string;
  count: number;
}

interface TooltipData {
  date: string;
  count: number;
}

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
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 6);
        
        const dateMap = new Map<string, number>(
          dailyData.map((d: DailyData) => [d.date, d.count])
        );

        const allDates: DailyData[] = [];
        const currentDate = new Date(startDate);

        while (currentDate <= endDate) {
          const dateStr = currentDate.toISOString().split('T')[0];
          const count = dateMap.get(dateStr) ?? 0; // Ensure count is a number
          allDates.push({
            date: dateStr,
            count: count,
          });
          currentDate.setDate(currentDate.getDate() + 1);
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
  const gap = 2;
  const weeks = 26; // Half year
  const days = 7;
  const width = (squareSize + gap) * weeks;
  const height = (squareSize + gap) * days;

  // Color scale
  const counts = data.map((d: DailyData) => d.count);
  const maxCount = Math.max(...counts);
  const colorScale = scaleLinear<string>({
    domain: [0, maxCount || 1], // Use 1 as max if all counts are 0
    range: ['#ebedf0', '#216e39'], // GitHub-style colors
  });

  // Format date for tooltip
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    
    // Handle ordinal suffixes
    const getOrdinalSuffix = (d: number) => {
      if (d > 3 && d < 21) return 'th';
      switch (d % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };

    return `${date.toLocaleDateString('en-US', { month: 'long' })} ${day}${getOrdinalSuffix(day)}`;
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>Performance Analytics</h2>
      <div className={styles.heatmapContainer}>
        <svg width={width} height={height}>
          <Group>
            {data.map((day: DailyData, i: number) => {
              const weekIndex = Math.floor(i / 7);
              const dayIndex = i % 7;
              const x = weekIndex * (squareSize + gap);
              const y = dayIndex * (squareSize + gap);

              return (
                <rect
                  key={day.date}
                  x={x}
                  y={y}
                  width={squareSize}
                  height={squareSize}
                  fill={colorScale(day.count)}
                  rx={2}
                  onMouseEnter={(event) => {
                    const bounds = event.currentTarget.getBoundingClientRect();
                    showTooltip({
                      tooltipData: { 
                        date: formatDate(day.date),
                        count: day.count 
                      },
                      tooltipTop: bounds.top - 40,
                      tooltipLeft: bounds.left + bounds.width / 2,
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
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            transform: 'translate(-50%, -100%)',
            zIndex: 9999,
            position: 'fixed',
          }}
        >
          <div>
            {tooltipData.count} paste{tooltipData.count !== 1 ? 's' : ''} on {tooltipData.date}.
          </div>
        </Tooltip>
      )}
    </div>
  );
};

export default withTooltip<{}, TooltipData>(PerformanceAnalytics);
