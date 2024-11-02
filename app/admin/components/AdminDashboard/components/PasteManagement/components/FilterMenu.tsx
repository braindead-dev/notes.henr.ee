// app/admin/components/AdminDashboard/components/PasteManagement/components/FilterMenu.tsx

import React from 'react';
import styles from '@/styles/AdminDashboard.module.css';

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

interface FilterMenuProps {
  filterMenuRef: React.RefObject<HTMLDivElement>;
  tempFilter: FilterState;
  setTempFilter: React.Dispatch<React.SetStateAction<FilterState>>;
  applyFilter: () => void;
  resetFilter: () => void;
  closeFilterMenu: () => void;
}

const FilterMenu: React.FC<FilterMenuProps> = ({
  filterMenuRef,
  tempFilter,
  setTempFilter,
  applyFilter,
  resetFilter,
  closeFilterMenu,
}) => {
  return (
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
            onChange={(e) =>
              setTempFilter({
                ...tempFilter,
                dateFrom: e.target.value,
              })
            }
            placeholder="From"
          />
          <input
            type="date"
            value={tempFilter.dateTo}
            onChange={(e) =>
              setTempFilter({
                ...tempFilter,
                dateTo: e.target.value,
              })
            }
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
            onChange={(e) =>
              setTempFilter({
                ...tempFilter,
                sizeFrom: e.target.value,
              })
            }
            placeholder="Min size"
          />
          <input
            type="number"
            value={tempFilter.sizeTo}
            onChange={(e) =>
              setTempFilter({
                ...tempFilter,
                sizeTo: e.target.value,
              })
            }
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
            onChange={(e) =>
              setTempFilter({
                ...tempFilter,
                encryption: {
                  ...tempFilter.encryption,
                  none: e.target.checked,
                },
              })
            }
          />
          None
        </label>
        <label>
          <input
            type="checkbox"
            className={styles.customCheckbox}
            checked={tempFilter.encryption.key}
            onChange={(e) =>
              setTempFilter({
                ...tempFilter,
                encryption: {
                  ...tempFilter.encryption,
                  key: e.target.checked,
                },
              })
            }
          />
          Encrypted
        </label>
        <label>
          <input
            type="checkbox"
            className={styles.customCheckbox}
            checked={tempFilter.encryption.password}
            onChange={(e) =>
              setTempFilter({
                ...tempFilter,
                encryption: {
                  ...tempFilter.encryption,
                  password: e.target.checked,
                },
              })
            }
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
  );
};

export default FilterMenu;
