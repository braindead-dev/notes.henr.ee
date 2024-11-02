// app/admin/components/AdminDashboard/components/PasteManagement/components/DeleteModal.tsx

import React from 'react';
import styles from '@/styles/AdminDashboard.module.css';

interface DeleteModalProps {
  selectedPastes: string[];
  totalPastes: number;
  setShowDeleteModal: (value: boolean) => void;
  handleDeleteSelected: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  selectedPastes,
  totalPastes,
  setShowDeleteModal,
  handleDeleteSelected,
}) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h3>Confirm Deletion</h3>
        <p>
          {selectedPastes.length === 0
            ? `Are you sure you want to delete all ${totalPastes} paste(s)?`
            : `Are you sure you want to delete ${selectedPastes.length} selected paste(s)?`}
        </p>
        <p className={styles.warningText}>This action cannot be undone.</p>
        <div className={styles.modalActions}>
          <button
            onClick={() => setShowDeleteModal(false)}
            className={styles.modifierButton}
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteSelected}
            className={styles.deleteButton}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
