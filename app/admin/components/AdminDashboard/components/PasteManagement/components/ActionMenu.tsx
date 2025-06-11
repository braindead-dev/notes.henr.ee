// app/admin/components/AdminDashboard/components/PasteManagement/components/ActionMenu.tsx

import React from "react";
import styles from "@/styles/AdminDashboard.module.css";

interface ActionMenuProps {
  showActionMenu: boolean;
  setShowActionMenu: (value: boolean) => void;
  actionMenuRef: React.RefObject<HTMLDivElement>;
  selectedPastes: string[];
  handleExportSelected: () => void;
  setShowDeleteModal: (value: boolean) => void;
}

const ActionMenu: React.FC<ActionMenuProps> = ({
  showActionMenu,
  setShowActionMenu,
  actionMenuRef,
  selectedPastes,
  handleExportSelected,
  setShowDeleteModal,
}) => {
  return (
    <div style={{ position: "relative" }}>
      <button
        className={styles.iconButton}
        onClick={() => setShowActionMenu(!showActionMenu)}
      >
        {/* Action Icon */}
        <svg
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.modifierIcon}
          fill="none"
          stroke-width="2"
        >
          <path
            d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      {showActionMenu && (
        <div ref={actionMenuRef} className={styles.actionMenu}>
          <button
            onClick={handleExportSelected}
            className={styles.actionButton}
          >
            {selectedPastes.length === 0
              ? "Export all results"
              : `Export selected (${selectedPastes.length})`}
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className={`${styles.actionButton} ${styles.deleteButton}`}
          >
            {selectedPastes.length === 0
              ? "Delete all results"
              : `Delete selected (${selectedPastes.length})`}
          </button>
        </div>
      )}
    </div>
  );
};

export default ActionMenu;
