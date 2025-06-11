// app/admin/components/AdminDashboard/components/PasteManagement/components/SortMenu.tsx

import React from "react";
import styles from "@/styles/AdminDashboard.module.css";

interface SortMenuProps {
  sortMenuRef: React.RefObject<HTMLDivElement>;
  tempSortBy: string;
  tempSortOrder: string;
  setTempSortBy: (value: string) => void;
  setTempSortOrder: (value: string) => void;
  applySort: () => void;
  closeSortMenu: () => void;
}

const SortMenu: React.FC<SortMenuProps> = ({
  sortMenuRef,
  tempSortBy,
  tempSortOrder,
  setTempSortBy,
  setTempSortOrder,
  applySort,
  closeSortMenu,
}) => {
  return (
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
            checked={tempSortBy === "date" && tempSortOrder === "asc"}
            onChange={() => {
              setTempSortBy("date");
              setTempSortOrder("asc");
            }}
          />
          Oldest
        </label>
        <label>
          <input
            type="radio"
            checked={tempSortBy === "date" && tempSortOrder === "desc"}
            onChange={() => {
              setTempSortBy("date");
              setTempSortOrder("desc");
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
            checked={tempSortBy === "name" && tempSortOrder === "asc"}
            onChange={() => {
              setTempSortBy("name");
              setTempSortOrder("asc");
            }}
          />
          A-Z
        </label>
        <label>
          <input
            type="radio"
            checked={tempSortBy === "name" && tempSortOrder === "desc"}
            onChange={() => {
              setTempSortBy("name");
              setTempSortOrder("desc");
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
            checked={tempSortBy === "size" && tempSortOrder === "asc"}
            onChange={() => {
              setTempSortBy("size");
              setTempSortOrder("asc");
            }}
          />
          Ascending
        </label>
        <label>
          <input
            type="radio"
            checked={tempSortBy === "size" && tempSortOrder === "desc"}
            onChange={() => {
              setTempSortBy("size");
              setTempSortOrder("desc");
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
  );
};

export default SortMenu;
