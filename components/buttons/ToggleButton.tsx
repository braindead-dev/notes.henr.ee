import React from 'react';
import styles from '@/styles/page.module.css';

interface ToggleButtonProps {
  viewMode?: boolean;
  setViewMode?: React.Dispatch<React.SetStateAction<boolean>>;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ viewMode, setViewMode }) => (
  <button
    className={styles.toggleButton}
    onClick={() => setViewMode && setViewMode(!viewMode)}
  >
    {viewMode ? 'Edit' : 'View'}
  </button>
);

export default ToggleButton;
