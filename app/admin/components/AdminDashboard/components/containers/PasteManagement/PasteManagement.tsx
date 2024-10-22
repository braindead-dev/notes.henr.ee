// app/admin/components/AdminDashboard/components/PasteManagement.tsx

import React, { useState, useEffect, useRef } from 'react';
import styles from '@/styles/AdminDashboard.module.css';

// Define the type for each Paste
interface Paste {
  id: string;
  title: string;
  isEncrypted: boolean;
  createdAt: string;
  size: number;
}

interface ApiResponse {
  pastes: Paste[];
  totalPages: number;
  totalPastes: number;
}

const PasteManagement: React.FC = () => {
  const [pastes, setPastes] = useState<Paste[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filter, setFilter] = useState<string>('');

  // Sorting
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<string>('desc');
  const [tempSortBy, setTempSortBy] = useState<string>(sortBy);
  const [tempSortOrder, setTempSortOrder] = useState<string>(sortOrder);
  const [showSortMenu, setShowSortMenu] = useState<boolean>(false);

  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalPastes, setTotalPastes] = useState<number>(0);
  const [selectedPastes, setSelectedPastes] = useState<string[]>([]);
  const pastesPerPage = 20;

  const sortMenuRef = useRef<HTMLDivElement>(null);

  const fetchPastes = async () => {
    try {
      const res = await fetch(
        `/api/admin/manage?page=${page}&search=${searchQuery}&filter=${filter}&sortBy=${sortBy}&sortOrder=${sortOrder}`
      );
      const data: ApiResponse = await res.json();

      setPastes(data.pastes);
      setTotalPages(data.totalPages);
      setTotalPastes(data.totalPastes);
    } catch (error) {
      console.error('Error fetching pastes:', error);
    }
  };

  useEffect(() => {
    fetchPastes();
  }, [page, searchQuery, filter, sortBy, sortOrder]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPastes([]);
    setPage(1);
  };

  // Handle the selection of a checkbox
  const handleCheckboxChange = (pasteId: string) => {
    setSelectedPastes((prevSelected) =>
      prevSelected.includes(pasteId)
        ? prevSelected.filter((id) => id !== pasteId)
        : [...prevSelected, pasteId]
    );
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

  // Sort functions
  const toggleSortMenu = () => {
    if (!showSortMenu) {
      setTempSortBy(sortBy);
      setTempSortOrder(sortOrder);
    }
    setShowSortMenu(!showSortMenu);
  };

  const applySort = () => {
    setSortBy(tempSortBy);
    setSortOrder(tempSortOrder);
    setShowSortMenu(false);
  };

  const resetSort = () => {
    setTempSortBy(sortBy);
    setTempSortOrder(sortOrder);
    setShowSortMenu(false);
  };

  const closeSortMenu = () => {
    setTempSortBy(sortBy);
    setTempSortOrder(sortOrder);
    setShowSortMenu(false);
  };

  // Hook to handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target as Node)) {
        closeSortMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sortMenuRef]);

  // Calculate the range of entries being displayed
  const startEntry = (page - 1) * pastesPerPage + 1;
  const endEntry = Math.min(page * pastesPerPage, totalPastes);

  return (
    <div className={styles.container} style={{ width: '100%' }}>
      <h2 className={styles.sectionTitle}>Paste Management</h2>

      {/* Search and Filter Buttons Wrapper */}
      <div className={styles.controlsContainer}>
        <input
          type="text"
          placeholder="Search pastes"
          value={searchQuery}
          onChange={handleSearch}
          className={styles.searchBar}
        />

        <div className={styles.modifierButtonsWrapper}>
          <button onClick={toggleSortMenu} className={styles.modifierButton}>
            {/* SVG and "Sort by" text */}
            <span>Sort by</span>

            {showSortMenu && (
              <div
                ref={sortMenuRef}
                className={styles.sortMenu}
                onClick={(e) => e.stopPropagation()}
              >
                <p>Sort by</p>

                <div className={styles.sortGroup}>
                  <p>Date</p>
                  <label>
                    <input
                      type="radio"
                      checked={tempSortBy === 'date' && tempSortOrder === 'asc'}
                      onChange={() => {
                        setTempSortBy('date');
                        setTempSortOrder('asc');
                      }}
                    />
                    Ascending
                  </label>
                  <label>
                    <input
                      type="radio"
                      checked={tempSortBy === 'date' && tempSortOrder === 'desc'}
                      onChange={() => {
                        setTempSortBy('date');
                        setTempSortOrder('desc');
                      }}
                    />
                    Descending
                  </label>
                </div>

                <div className={styles.sortGroup}>
                  <p>Name</p>
                  <label>
                    <input
                      type="radio"
                      checked={tempSortBy === 'name' && tempSortOrder === 'asc'}
                      onChange={() => {
                        setTempSortBy('name');
                        setTempSortOrder('asc');
                      }}
                    />
                    A-Z
                  </label>
                  <label>
                    <input
                      type="radio"
                      checked={tempSortBy === 'name' && tempSortOrder === 'desc'}
                      onChange={() => {
                        setTempSortBy('name');
                        setTempSortOrder('desc');
                      }}
                    />
                    Z-A
                  </label>
                </div>

                <div className={styles.sortGroup}>
                  <p>Size</p>
                  <label>
                    <input
                      type="radio"
                      checked={tempSortBy === 'size' && tempSortOrder === 'asc'}
                      onChange={() => {
                        setTempSortBy('size');
                        setTempSortOrder('asc');
                      }}
                    />
                    Ascending
                  </label>
                  <label>
                    <input
                      type="radio"
                      checked={tempSortBy === 'size' && tempSortOrder === 'desc'}
                      onChange={() => {
                        setTempSortBy('size');
                        setTempSortOrder('desc');
                      }}
                    />
                    Descending
                  </label>
                </div>

                <div className={styles.sortActions}>
                  <button onClick={resetSort} className={styles.modifierButton}>
                    Cancel
                  </button>
                  <button onClick={applySort} className={styles.applyButton}>
                    Apply
                  </button>
                </div>
              </div>
            )}
          </button>

          {/* Filter Button */}
          <button className={styles.modifierButton}>
            {/* SVG and "Filter" text */}
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Table for displaying pastes */}
      <table className={styles.pasteTable}>
        <thead>
          <tr>
            <th>
              <input type="checkbox" className={styles.customCheckbox} />
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
                  href={`https://notes.henr.ee/${paste.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {paste.title}
                </a>
                <span className={styles.pasteID}> ({paste.id})</span>
              </td>
              <td>{new Date(paste.createdAt).toISOString().split('T')[0]}</td>
              <td>
                {paste.isEncrypted ? (
                  <span className={styles.encryptedTag}>Encrypted</span>
                ) : (
                  <span className={styles.noneTag}>None</span>
                )}
              </td>
              <td>{formatBytes(paste.size)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.paginationWrapper}>
        <div className={styles.paginationContainer}>
          {/* Center-aligned Pagination Controls */}
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
        {/* Right-aligned Entries Info */}
        <div className={styles.entriesInfo}>
          Entries {startEntry} - {endEntry} of {totalPastes}
        </div>
      </div>
    </div>
  );
};

export default PasteManagement;
