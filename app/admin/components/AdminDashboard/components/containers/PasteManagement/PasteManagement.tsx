// app/admin/components/AdminDashboard/components/PasteManagement.tsx

import React, { useState, useEffect, useRef } from 'react';
import styles from '@/styles/AdminDashboard.module.css';

// Define the type for each Paste
interface Paste {
  id: string;
  title: string;
  isEncrypted: boolean;
  encryptionType: 'key' | 'password' | null; // Add this line
  createdAt: string;
  size: number;
}

interface ApiResponse {
  pastes: Paste[];
  totalPages: number;
  totalPastes: number;
}

interface FilterState {
  dateFrom: string;
  dateTo: string;
  sizeFrom: string;
  sizeTo: string;
  encryption: {
    none: boolean;
    key: boolean;
    password: boolean;
  };
}

const PasteManagement: React.FC = () => {
  const [pastes, setPastes] = useState<Paste[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Track the state of the top checkbox
  const [isAllSelected, setIsAllSelected] = useState<boolean>(false);

  // Filtering
  const [showFilterMenu, setShowFilterMenu] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>('');
  const filterMenuRef = useRef<HTMLDivElement>(null);

  // Add new filter states
  const [tempFilter, setTempFilter] = useState<FilterState>({
    dateFrom: '',
    dateTo: '',
    sizeFrom: '',
    sizeTo: '',
    encryption: {
      none: false,
      key: false,
      password: false,
    }
  });
  const [activeFilter, setActiveFilter] = useState<FilterState>({
    dateFrom: '',
    dateTo: '',
    sizeFrom: '',
    sizeTo: '',
    encryption: {
      none: false,
      key: false,
      password: false,
    }
  });

  // Sorting
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [tempSortBy, setTempSortBy] = useState<string>(sortBy);
  const [tempSortOrder, setTempSortOrder] = useState<string>(sortOrder);
  const [showSortMenu, setShowSortMenu] = useState<boolean>(false);

  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalPastes, setTotalPastes] = useState<number>(0);
  const [selectedPastes, setSelectedPastes] = useState<string[]>([]);
  const pastesPerPage = 20;

  const sortMenuRef = useRef<HTMLDivElement>(null);

  // First, update the fetchPastes function to handle the new filter parameters
  const fetchPastes = async () => {
    try {
      const filterParams = new URLSearchParams();
      filterParams.append('page', page.toString());
      filterParams.append('search', searchQuery);
      filterParams.append('sortBy', sortBy);
      filterParams.append('sortOrder', sortOrder);
      
      // Add filter parameters
      if (activeFilter.dateFrom) filterParams.append('dateFrom', activeFilter.dateFrom);
      if (activeFilter.dateTo) filterParams.append('dateTo', activeFilter.dateTo);
      if (activeFilter.sizeFrom) filterParams.append('sizeFrom', activeFilter.sizeFrom);
      if (activeFilter.sizeTo) filterParams.append('sizeTo', activeFilter.sizeTo);
      
      // Handle encryption types
      const encryptionTypes = Object.entries(activeFilter.encryption)
        .filter(([_, value]) => value)
        .map(([key]) => key);
      if (encryptionTypes.length > 0) {
        filterParams.append('encryptionTypes', encryptionTypes.join(','));
      }

      const res = await fetch(`/api/admin/manage?${filterParams.toString()}`);
      const data: ApiResponse = await res.json();

      setPastes(data.pastes);
      setTotalPages(data.totalPages);
      setTotalPastes(data.totalPastes);
    } catch (error) {
      console.error('Error fetching pastes:', error);
    }
  };

  // Add new filter functions
  const applyFilter = () => {
    setActiveFilter({...tempFilter});
    setShowFilterMenu(false);
    setPage(1);
  };

  const resetFilter = () => {
    const emptyFilter = {
      dateFrom: '',
      dateTo: '',
      sizeFrom: '',
      sizeTo: '',
      encryption: {
        none: false,
        key: false,
        password: false,
      }
    };
    setTempFilter({...emptyFilter});
    setActiveFilter({...emptyFilter});
    setShowFilterMenu(false);
    setPage(1);
  };

  useEffect(() => {
    console.log('Fetching pastes with filters:', activeFilter);
    fetchPastes();
  }, [page, searchQuery, sortBy, sortOrder, activeFilter]);

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

  // Handle top checkbox toggle (select/deselect all)
  const handleSelectAllChange = () => {
    setIsAllSelected(!isAllSelected);
    if (!isAllSelected) {
      // Select all pastes
      const allPasteIds = pastes.map((paste) => paste.id);
      setSelectedPastes(allPasteIds);
    } else {
      // Deselect all pastes
      setSelectedPastes([]);
    }
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

  // Filter functions
  const toggleFilterMenu = () => {
    setShowFilterMenu(!showFilterMenu);
  };
  
  const closeFilterMenu = () => {
    setShowFilterMenu(false);
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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission or default behavior
      fetchPastes(); // Refresh the search with the current input
      (e.target as HTMLInputElement).blur(); // Unfocus the search input
    }
  };  

  // Hook to handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target as Node)) {
        closeSortMenu();
      }
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
        closeFilterMenu();
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
  
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
        <div className={styles.searchBarContainer}>
          <svg
            className={styles.searchIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke-width="2"
          >
            <path d="M16.6725 16.6412L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            onKeyDown={(e) => handleKeyPress(e)}  // Add this line
            className={styles.searchBar}
          />
        </div>

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
                    Oldest
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
                    Newest
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
                  <button onClick={closeSortMenu} className={styles.modifierButton}>
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
          <button onClick={toggleFilterMenu} className={styles.modifierButton}>
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

            {showFilterMenu && (
              <div
                ref={filterMenuRef}
                className={styles.filterMenu}
                onClick={(e) => e.stopPropagation()}
              >
                <p>Filter pastes</p>

                <div className={styles.filterGroup}>
                  <p>Date Range</p>
                  <div className={styles.rangeInputs}>
                    <input
                      type="date"
                      value={tempFilter.dateFrom}
                      onChange={(e) => setTempFilter({
                        ...tempFilter,
                        dateFrom: e.target.value
                      })}
                      placeholder="From"
                    />
                    <input
                      type="date"
                      value={tempFilter.dateTo}
                      onChange={(e) => setTempFilter({
                        ...tempFilter,
                        dateTo: e.target.value
                      })}
                      placeholder="To"
                    />
                  </div>
                </div>

                <div className={styles.filterGroup}>
                  <p>Size Range (bytes)</p>
                  <div className={styles.rangeInputs}>
                    <input
                      type="number"
                      value={tempFilter.sizeFrom}
                      onChange={(e) => setTempFilter({
                        ...tempFilter,
                        sizeFrom: e.target.value
                      })}
                      placeholder="Min size"
                    />
                    <input
                      type="number"
                      value={tempFilter.sizeTo}
                      onChange={(e) => setTempFilter({
                        ...tempFilter,
                        sizeTo: e.target.value
                      })}
                      placeholder="Max size"
                    />
                  </div>
                </div>

                <div className={styles.filterGroup}>
                  <p>Encryption Type</p>
                  <label>
                    <input
                      type="checkbox"
                      className={styles.customCheckbox}
                      checked={tempFilter.encryption.none}
                      onChange={(e) => setTempFilter({
                        ...tempFilter,
                        encryption: {
                          ...tempFilter.encryption,
                          none: e.target.checked
                        }
                      })}
                    />
                    None
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      className={styles.customCheckbox}
                      checked={tempFilter.encryption.key}
                      onChange={(e) => setTempFilter({
                        ...tempFilter,
                        encryption: {
                          ...tempFilter.encryption,
                          key: e.target.checked
                        }
                      })}
                    />
                    Encrypted
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      className={styles.customCheckbox}
                      checked={tempFilter.encryption.password}
                      onChange={(e) => setTempFilter({
                        ...tempFilter,
                        encryption: {
                          ...tempFilter.encryption,
                          password: e.target.checked
                        }
                      })}
                    />
                    PBKDF2
                  </label>
                </div>

                <div className={styles.filterActions}>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      resetFilter();
                    }} 
                    className={styles.modifierButton}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      applyFilter();
                    }} 
                    className={styles.applyButton}
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </button>

          <button className={styles.iconButton}>
            <svg
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className={styles.modifierIcon}
              fill="none"
              stroke-width="2"
            >
              <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Table for displaying pastes */}
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
