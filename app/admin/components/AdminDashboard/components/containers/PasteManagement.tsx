// app/admin/components/AdminDashboard/components/PasteManagement.tsx

import React, { useState, useEffect } from 'react';
import styles from '@/styles/AdminDashboard.module.css';

// Define the type for each Paste
interface Paste {
  id: string;
  title: string;
  isEncrypted: boolean;
  createdAt: string; // Assuming the backend returns a string timestamp for the creation date
  size: number; // Assuming size is returned in bytes from the backend
}

interface ApiResponse {
  pastes: Paste[];
  totalPages: number;
}

const PasteManagement: React.FC = () => {
  const [pastes, setPastes] = useState<Paste[]>([]);  // Explicitly type as an array of Paste
  const [searchQuery, setSearchQuery] = useState<string>('');  // Explicitly type as a string
  const [filter, setFilter] = useState<string>('');  // Explicitly type as a string
  const [page, setPage] = useState<number>(1);  // Explicitly type as a number
  const [totalPages, setTotalPages] = useState<number>(1);  // Explicitly type as a number

  const fetchPastes = async () => {
    try {
      const res = await fetch(`/api/admin/manage?page=${page}&search=${searchQuery}&filter=${filter}`);
      const data: ApiResponse = await res.json();  // Type the response data

      setPastes(data.pastes);  // Replace current pastes with the new data
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching pastes:', error);
    } 
  };

  useEffect(() => {
    fetchPastes();
  }, [page, searchQuery, filter]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPastes([]); // Reset paste list for new search
    setPage(1);    // Reset to page 1
  };

  const handleFilter = (newFilter: string) => {
    setFilter(newFilter);
    setPastes([]); // Reset paste list for new filter
    setPage(1);    // Reset to page 1
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const goToPreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const goToNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <div className={styles.container} style={{ width: '100%' }}>
      <h2 className={styles.sectionTitle}>Paste Management</h2>
      
      <input
        type="text"
        placeholder="Search pastes"
        value={searchQuery}
        onChange={handleSearch}
        className={styles.searchBar}
      />
      
      <div className={styles.filterButtons}>
        <button onClick={() => handleFilter('')}>All</button>
        <button onClick={() => handleFilter('encrypted')}>Encrypted</button>
        <button onClick={() => handleFilter('nonEncrypted')}>Non-Encrypted</button>
      </div>
      
      {/* Table for displaying pastes */}
      <table className={styles.pasteTable}>
        <thead>
          <tr>
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
                <a className={styles.unstyledLink} href={`https://notes.henr.ee/${paste.id}`} target="_blank" rel="noopener noreferrer">
                  {paste.title}
                </a>
                <span className={styles.pasteID}> ({paste.id})</span> {/* Display id next to title */}
              </td>
              <td>{new Date(paste.createdAt).toLocaleDateString()}</td> {/* Formatting the date */}
              <td>
                {paste.isEncrypted ? (
                  <span className={styles.encryptedTag}>Encrypted</span>
                ) : (
                  <span className={styles.noneTag}>None</span>
                )}
              </td>
              <td>{formatBytes(paste.size)}</td> {/* Format size from bytes */}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className={styles.paginationContainer}>
        <button
          className={styles.paginationButton}
          onClick={goToPreviousPage}
          disabled={page === 1} // Disable if on the first page
        >
          &lt;
        </button>
        <span className={styles.paginationInfo}>
          {page} / {totalPages}
        </span>
        <button
          className={styles.paginationButton}
          onClick={goToNextPage}
          disabled={page === totalPages} // Disable if on the last page
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default PasteManagement;
