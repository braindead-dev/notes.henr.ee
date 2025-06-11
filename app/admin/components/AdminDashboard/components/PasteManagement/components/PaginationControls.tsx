// app/admin/components/AdminDashboard/components/PasteManagement/components/PaginationControls.tsx

import React from "react";
import styles from "@/styles/AdminDashboard.module.css";

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  startEntry: number;
  endEntry: number;
  totalPastes: number;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  page,
  totalPages,
  goToPreviousPage,
  goToNextPage,
  startEntry,
  endEntry,
  totalPastes,
}) => {
  return (
    <div className={styles.paginationWrapper}>
      <div className={styles.paginationContainer}>
        <div className={styles.paginationCenter}>
          <button
            className={styles.paginationButton}
            onClick={goToPreviousPage}
            disabled={page === 1}
          >
            &lt;
          </button>
          <span className={styles.paginationInfo}>
            {page} / {totalPages}
          </span>
          <button
            className={styles.paginationButton}
            onClick={goToNextPage}
            disabled={page === totalPages}
          >
            &gt;
          </button>
        </div>
      </div>
      <div className={styles.entriesInfo}>
        Entries {startEntry} - {endEntry} of {totalPastes}
      </div>
    </div>
  );
};

export default PaginationControls;
