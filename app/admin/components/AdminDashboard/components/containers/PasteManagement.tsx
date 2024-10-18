// app/admin/components/AdminDashboard/components/PasteManagement.tsx

import React, { useState, useEffect } from 'react';
import styles from '@/styles/AdminDashboard.module.css';

// Define the type for each Paste
interface Paste {
  id: string;
  title: string;
  isEncrypted: boolean;
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
  const [loading, setLoading] = useState<boolean>(false);  // Explicitly type as a boolean

  const fetchPastes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/manage?page=${page}&search=${searchQuery}&filter=${filter}`);
      const data: ApiResponse = await res.json();  // Type the response data

      setPastes((prevPastes) => [...prevPastes, ...data.pastes]);  // Append results for infinite scroll or pagination
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching pastes:', error);
    } finally {
      setLoading(false);
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

  const loadMorePastes = () => {
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
      
      <ul className={styles.pasteList}>
        {pastes.map((paste) => (
          <li key={paste.id}>
            <a className={styles.unstyledLink} href={`https://notes.henr.ee/${paste.id}`} target="_blank" rel="noopener noreferrer">
              {paste.title}
            </a>
          </li>
        ))}
      </ul>

      {loading && <p>Loading...</p>}

      {page < totalPages && !loading && (
        <button className={styles.loadMoreButton} onClick={loadMorePastes}>
          Load More
        </button>
      )}
    </div>
  );
};

export default PasteManagement;
