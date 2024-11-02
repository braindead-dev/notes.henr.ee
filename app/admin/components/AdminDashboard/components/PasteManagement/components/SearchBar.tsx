// app/admin/components/AdminDashboard/components/PasteManagement/components/SearchBar.tsx

import React from 'react';
import styles from '@/styles/AdminDashboard.module.css';

interface SearchBarProps {
  searchQuery: string;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, handleSearch, handleKeyPress }) => {
  return (
    <div className={styles.searchBarContainer}>
      <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" strokeWidth="2">
        <path
          d="M16.6725 16.6412L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleSearch}
        onKeyDown={handleKeyPress}
        className={styles.searchBar}
      />
    </div>
  );
};

export default SearchBar;