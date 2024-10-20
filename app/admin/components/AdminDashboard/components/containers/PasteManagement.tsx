// app/admin/components/AdminDashboard/components/PasteManagement.tsx

import React, { useState, useEffect, useRef } from 'react';
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
  totalPastes: number;
}

const PasteManagement: React.FC = () => {
  const [pastes, setPastes] = useState<Paste[]>([]);  // Explicitly type as an array of Paste
  const [searchQuery, setSearchQuery] = useState<string>('');  // Explicitly type as a string
  const [filter, setFilter] = useState<string>('');  // Explicitly type as a string

  // sorting
  const [sortBy, setSortBy] = useState<string>('');  // Explicitly type as a string for sorting
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [showSortMenu, setShowSortMenu] = useState<boolean>(false);

  const [page, setPage] = useState<number>(1);  // Explicitly type as a number
  const [totalPages, setTotalPages] = useState<number>(1);  // Explicitly type as a number
  const [totalPastes, setTotalPastes] = useState<number>(0);  // Track total number of entries=
  const [selectedPastes, setSelectedPastes] = useState<string[]>([]);  // Track selected pastes by ID
  const pastesPerPage = 20; // Assuming 20 pastes per page

  const sortMenuRef = useRef<HTMLDivElement>(null); // Reference for the sort menu

  const fetchPastes = async () => {
    try {
      const res = await fetch(`/api/admin/manage?page=${page}&search=${searchQuery}&filter=${filter}`);
      const data: ApiResponse = await res.json();  // Type the response data

      setPastes(data.pastes);  // Replace current pastes with the new data
      setTotalPages(data.totalPages);
      setTotalPastes(data.totalPastes)
    } catch (error) {
      console.error('Error fetching pastes:', error);
    }
  };

  useEffect(() => {
    fetchPastes();
  }, [page, searchQuery, filter, sortBy]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPastes([]); // Reset paste list for new search
    setPage(1);    // Reset to page 1
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

  // sort functions

  const toggleSortMenu = () => {
    setShowSortMenu(!showSortMenu);
  };

  const applySort = () => {
    // Logic to apply sort by option here
    setShowSortMenu(false);
  };

  const resetSort = () => {
    setSortBy('date');
    setSortOrder('asc');
    setShowSortMenu(false);
  };

  const closeSortMenu = () => {
    setShowSortMenu(false);
  };

  // Hook to handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target as Node)) {
        closeSortMenu();
      }
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup listener when component unmounts or when effect is re-run
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
            <svg
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className={styles.modifierIcon}
              fill="none"
              stroke-width="2"
            >
              <path d="M16.0686 15H7.9313C7.32548 15 7.02257 15 6.88231 15.1198C6.76061 15.2238 6.69602 15.3797 6.70858 15.5393C6.72305 15.7232 6.93724 15.9374 7.36561 16.3657L11.4342 20.4344C11.6323 20.6324 11.7313 20.7314 11.8454 20.7685C11.9458 20.8011 12.054 20.8011 12.1544 20.7685C12.2686 20.7314 12.3676 20.6324 12.5656 20.4344L16.6342 16.3657C17.0626 15.9374 17.2768 15.7232 17.2913 15.5393C17.3038 15.3797 17.2392 15.2238 17.1175 15.1198C16.9773 15 16.6744 15 16.0686 15Z" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M7.9313 9.00005H16.0686C16.6744 9.00005 16.9773 9.00005 17.1175 8.88025C17.2393 8.7763 17.3038 8.62038 17.2913 8.46082C17.2768 8.27693 17.0626 8.06274 16.6342 7.63436L12.5656 3.56573C12.3676 3.36772 12.2686 3.26872 12.1544 3.23163C12.054 3.199 11.9458 3.199 11.8454 3.23163C11.7313 3.26872 11.6323 3.36772 11.4342 3.56573L7.36561 7.63436C6.93724 8.06273 6.72305 8.27693 6.70858 8.46082C6.69602 8.62038 6.76061 8.7763 6.88231 8.88025C7.02257 9.00005 7.32548 9.00005 7.9313 9.00005Z" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Sort by</span>

            {showSortMenu && (
              <div
                ref={sortMenuRef}
                className={styles.sortMenu}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the dropdown
              >
                <h4>Sort by</h4>
                <div className={styles.sortGroup}>
                  <p>Date</p>
                  <label>
                    <input type="radio" checked={sortBy === 'date'} onChange={() => setSortBy('date')} />
                    Ascending
                  </label>
                  <label>
                    <input type="radio" checked={sortBy === 'date'} onChange={() => setSortBy('date-desc')} />
                    Descending
                  </label>
                </div>

                <div className={styles.sortGroup}>
                  <p>Activity</p>
                  <label>
                    <input type="radio" checked={sortBy === 'activity'} onChange={() => setSortBy('activity')} />
                    A-Z
                  </label>
                  <label>
                    <input type="radio" checked={sortBy === 'activity'} onChange={() => setSortBy('activity-desc')} />
                    Z-A
                  </label>
                </div>

                <div className={styles.sortGroup}>
                  <p>Name</p>
                  <label>
                    <input type="radio" checked={sortBy === 'name'} onChange={() => setSortBy('name')} />
                    A-Z
                  </label>
                  <label>
                    <input type="radio" checked={sortBy === 'name'} onChange={() => setSortBy('name-desc')} />
                    Z-A
                  </label>
                </div>

                <div className={styles.sortActions}>
                  <button onClick={resetSort} className={styles.resetButton}>Cancel</button>
                  <button onClick={applySort} className={styles.applyButton}>Apply now</button>
                </div>
              </div>
            )}
          </button>

          {/* Filter Button with SVG */}
          <button className={styles.modifierButton}>
            <svg
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className={styles.modifierIcon}
              fill="none"
              stroke-width="2"
            >
              <g id="style=linear">
                <g id="filter-circle">
                  <path id="vector" d="M2 17.5H7" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                  <path id="vector_2" d="M22 6.5H17" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                  <path id="vector_3" d="M13 17.5H22" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                  <path id="vector_4" d="M11 6.5H2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                  <path id="vector_5" d="M10 20.3999C8.34315 20.3999 7 19.0568 7 17.3999C7 15.743 8.34315 14.3999 10 14.3999C11.6569 14.3999 13 15.743 13 17.3999C13 19.0568 11.6569 20.3999 10 20.3999Z" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                  <path id="vector_6" d="M14 9.3999C15.6569 9.3999 17 8.05676 17 6.3999C17 4.74305 15.6569 3.3999 14 3.3999C12.3431 3.3999 11 4.74305 11 6.3999C11 8.05676 12.3431 9.3999 14 9.3999Z" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                </g>
              </g>
            </svg>
            <span>Filter</span>
          </button>
        </div>
      </div>


      {/* Table for displaying pastes */}
      <table className={styles.pasteTable}>
        <thead>
          <tr>
            <th><input type="checkbox" className={styles.customCheckbox} /></th> {/* Checkbox header */}
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
                <a className={styles.unstyledLink} href={`https://notes.henr.ee/${paste.id}`} target="_blank" rel="noopener noreferrer">
                  {paste.title}
                </a>
                <span className={styles.pasteID}> ({paste.id})</span> {/* Display id next to title */}
              </td>
              <td>{new Date(paste.createdAt).toISOString().split('T')[0]}</td>
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

      <div className={styles.paginationWrapper}>
        <div className={styles.paginationContainer}>
          {/* Center-aligned Pagination Controls */}
          <div className={styles.paginationCenter}>
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
        {/* Right-aligned Entries Info */}
        <div className={styles.entriesInfo}>
          Entries {startEntry} - {endEntry} of {totalPastes}
        </div>
      </div>
    </div>
  );
};

export default PasteManagement;
