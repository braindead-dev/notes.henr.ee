// app/admin/components/AdminDashboard/components/PasteManagement/components/PasteTable.tsx

import React from 'react';
import styles from '@/styles/AdminDashboard.module.css';

interface Paste {
  id: string;
  title: string;
  isEncrypted: boolean;
  encryptionType: 'key' | 'password' | null;
  createdAt: string;
  size: number;
}

interface PasteTableProps {
  pastes: Paste[];
  selectedPastes: string[];
  handleCheckboxChange: (pasteId: string) => void;
  handleSelectAllChange: () => void;
  formatBytes: (bytes: number, decimals?: number) => string;
}

const PasteTable: React.FC<PasteTableProps> = ({
  pastes,
  selectedPastes,
  handleCheckboxChange,
  handleSelectAllChange,
  formatBytes,
}) => {
  return (
    <table className={styles.pasteTable}>
      <thead>
        <tr>
          <th>
            <input
              type="checkbox"
              className={styles.customCheckbox}
              onChange={handleSelectAllChange}
            />
          </th>
          <th>Title</th>
          <th>Date Created</th>
          <th>Encryption</th>
          <th>Size</th>
        </tr>
      </thead>
      <tbody>
        {pastes.map((paste) => (
          <tr key={paste.id}>
            <td>
              <input
                type="checkbox"
                className={styles.customCheckbox}
                checked={selectedPastes.includes(paste.id)}
                onChange={() => handleCheckboxChange(paste.id)}
              />
            </td>
            <td>
              <a
                className={styles.unstyledLink}
                href={`/${paste.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {paste.title}
              </a>
              <span className={styles.pasteID}> ({paste.id})</span>
            </td>
            <td>{new Date(paste.createdAt).toISOString().split('T')[0]}</td>
            <td>
              {paste.encryptionType === 'key' ? (
                <span className={styles.keyTag}>Encrypted</span>
              ) : paste.encryptionType === 'password' ? (
                <span className={styles.passwordTag}>PBKDF2</span>
              ) : (
                <span className={styles.noneTag}>None</span>
              )}
            </td>
            <td>{formatBytes(paste.size)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PasteTable;
