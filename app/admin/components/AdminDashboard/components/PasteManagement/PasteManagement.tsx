// app/admin/components/AdminDashboard/components/PasteManagement/PasteManagement.tsx

import React, { useState, useEffect, useRef } from "react";
import styles from "@/styles/AdminDashboard.module.css";

// Import the new components
import SearchBar from "./components/SearchBar";
import SortMenu from "./components/SortMenu";
import FilterMenu from "./components/FilterMenu";
import ActionMenu from "./components/ActionMenu";
import PasteTable from "./components/PasteTable";
import PaginationControls from "./components/PaginationControls";
import DeleteModal from "./components/DeleteModal";

// Define the type for each Paste
interface Paste {
  id: string;
  title: string;
  encryptionMethod: "key" | "password" | null;
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
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Track the state of the top checkbox
  const [isAllSelected, setIsAllSelected] = useState<boolean>(false);
  const [selectedPastes, setSelectedPastes] = useState<string[]>([]);

  // Filtering
  const [showFilterMenu, setShowFilterMenu] = useState<boolean>(false);
  const filterMenuRef = useRef<HTMLDivElement>(null);
  const [tempFilter, setTempFilter] = useState<FilterState>({
    dateFrom: "",
    dateTo: "",
    sizeFrom: "",
    sizeTo: "",
    encryption: {
      none: false,
      key: false,
      password: false,
    },
  });
  const [activeFilter, setActiveFilter] = useState<FilterState>({
    dateFrom: "",
    dateTo: "",
    sizeFrom: "",
    sizeTo: "",
    encryption: {
      none: false,
      key: false,
      password: false,
    },
  });

  // Sorting
  const [sortBy, setSortBy] = useState<string>("date");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [tempSortBy, setTempSortBy] = useState<string>(sortBy);
  const [tempSortOrder, setTempSortOrder] = useState<string>(sortOrder);
  const [showSortMenu, setShowSortMenu] = useState<boolean>(false);
  const sortMenuRef = useRef<HTMLDivElement>(null);

  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalPastes, setTotalPastes] = useState<number>(0);
  const pastesPerPage = 20;

  const [showActionMenu, setShowActionMenu] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const actionMenuRef = useRef<HTMLDivElement>(null);

  // Fetch pastes with filters and sorting
  const fetchPastes = async () => {
    try {
      const filterParams = new URLSearchParams();
      filterParams.append("page", page.toString());
      filterParams.append("search", searchQuery);
      filterParams.append("sortBy", sortBy);
      filterParams.append("sortOrder", sortOrder);

      // Add filter parameters
      if (activeFilter.dateFrom)
        filterParams.append("dateFrom", activeFilter.dateFrom);
      if (activeFilter.dateTo)
        filterParams.append("dateTo", activeFilter.dateTo);
      if (activeFilter.sizeFrom)
        filterParams.append("sizeFrom", activeFilter.sizeFrom);
      if (activeFilter.sizeTo)
        filterParams.append("sizeTo", activeFilter.sizeTo);

      // Handle encryption types
      const encryptionTypes = Object.entries(activeFilter.encryption)
        .filter(([_, value]) => value)
        .map(([key]) => key);
      if (encryptionTypes.length > 0) {
        filterParams.append("encryptionTypes", encryptionTypes.join(","));
      }

      const res = await fetch(`/api/admin/manage?${filterParams.toString()}`);
      const data: ApiResponse = await res.json();

      setPastes(data.pastes);
      setTotalPages(data.totalPages);
      setTotalPastes(data.totalPastes);
    } catch (error) {
      console.error("Error fetching pastes:", error);
    }
  };

  // Filter functions
  const applyFilter = () => {
    setActiveFilter({ ...tempFilter });
    setShowFilterMenu(false);
    setPage(1);
  };

  const resetFilter = () => {
    const emptyFilter = {
      dateFrom: "",
      dateTo: "",
      sizeFrom: "",
      sizeTo: "",
      encryption: {
        none: false,
        key: false,
        password: false,
      },
    };
    setTempFilter({ ...emptyFilter });
    setActiveFilter({ ...emptyFilter });
    setShowFilterMenu(false);
    setPage(1);
  };

  useEffect(() => {
    console.log("Fetching pastes with filters:", activeFilter);
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
        : [...prevSelected, pasteId],
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
    if (bytes === 0) return "0 B";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
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

  const closeSortMenu = () => {
    setTempSortBy(sortBy);
    setTempSortOrder(sortOrder);
    setShowSortMenu(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission or default behavior
      fetchPastes(); // Refresh the search with the current input
      (e.target as HTMLInputElement).blur(); // Unfocus the search input
    }
  };

  // Hook to handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sortMenuRef.current &&
        !sortMenuRef.current.contains(event.target as Node)
      ) {
        closeSortMenu();
      }
      if (
        filterMenuRef.current &&
        !filterMenuRef.current.contains(event.target as Node)
      ) {
        closeFilterMenu();
      }
      if (
        actionMenuRef.current &&
        !actionMenuRef.current.contains(event.target as Node)
      ) {
        setShowActionMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Calculate the range of entries being displayed
  const startEntry = (page - 1) * pastesPerPage + 1;
  const endEntry = Math.min(page * pastesPerPage, totalPastes);

  // Handler functions
  const handleExportSelected = async () => {
    try {
      if (selectedPastes.length === 0) {
        // Fetch all results
        const filterParams = new URLSearchParams();
        filterParams.append("search", searchQuery);
        filterParams.append("sortBy", sortBy);
        filterParams.append("sortOrder", sortOrder);

        // Add filter parameters
        if (activeFilter.dateFrom)
          filterParams.append("dateFrom", activeFilter.dateFrom);
        if (activeFilter.dateTo)
          filterParams.append("dateTo", activeFilter.dateTo);
        if (activeFilter.sizeFrom)
          filterParams.append("sizeFrom", activeFilter.sizeFrom);
        if (activeFilter.sizeTo)
          filterParams.append("sizeTo", activeFilter.sizeTo);

        // Handle encryption types
        const encryptionTypes = Object.entries(activeFilter.encryption)
          .filter(([_, value]) => value)
          .map(([key]) => key);
        if (encryptionTypes.length > 0) {
          filterParams.append("encryptionTypes", encryptionTypes.join(","));
        }

        const res = await fetch(
          `/api/admin/export-all?${filterParams.toString()}`,
        );
        const allPastes = await res.json();

        const exportData = {
          pastes: allPastes,
          exportDate: new Date().toISOString(),
          totalCount: allPastes.length,
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `all-pastes-${new Date().toISOString().split("T")[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        // Export only selected pastes
        const selectedPastesData = pastes.filter((paste) =>
          selectedPastes.includes(paste.id),
        );
        const exportData = {
          pastes: selectedPastesData,
          exportDate: new Date().toISOString(),
          totalCount: selectedPastesData.length,
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `selected-pastes-${new Date().toISOString().split("T")[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      setShowActionMenu(false);
    } catch (error) {
      console.error("Error exporting pastes:", error);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      if (selectedPastes.length === 0) {
        // Delete all results matching current filters
        const filterParams = new URLSearchParams();
        filterParams.append("search", searchQuery);
        if (activeFilter.dateFrom)
          filterParams.append("dateFrom", activeFilter.dateFrom);
        if (activeFilter.dateTo)
          filterParams.append("dateTo", activeFilter.dateTo);
        if (activeFilter.sizeFrom)
          filterParams.append("sizeFrom", activeFilter.sizeFrom);
        if (activeFilter.sizeTo)
          filterParams.append("sizeTo", activeFilter.sizeTo);

        const encryptionTypes = Object.entries(activeFilter.encryption)
          .filter(([_, value]) => value)
          .map(([key]) => key);
        if (encryptionTypes.length > 0) {
          filterParams.append("encryptionTypes", encryptionTypes.join(","));
        }

        const response = await fetch(
          `/api/admin/delete-all?${filterParams.toString()}`,
          {
            method: "DELETE",
          },
        );

        if (!response.ok) throw new Error("Failed to delete pastes");

        const data = await response.json();
        console.log("Deleted count:", data.deletedCount);
      } else {
        // Delete selected pastes
        const response = await fetch("/api/admin/delete", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ pasteIds: selectedPastes }),
        });

        if (!response.ok) throw new Error("Failed to delete pastes");

        const data = await response.json();
        console.log("Deleted count:", data.deletedCount);
      }

      setSelectedPastes([]);
      setIsAllSelected(false);
      await fetchPastes();
      setShowDeleteModal(false);
      setShowActionMenu(false);
    } catch (error) {
      console.error("Error deleting pastes:", error);
    }
  };

  return (
    <div className={styles.container} style={{ width: "100%" }}>
      <h2 className={styles.sectionTitle}>Paste Management</h2>

      {/* Search and Filter Buttons Wrapper */}
      <div className={styles.controlsContainer}>
        <SearchBar
          searchQuery={searchQuery}
          handleSearch={handleSearch}
          handleKeyPress={handleKeyPress}
        />

        <div className={styles.modifierButtonsWrapper}>
          {/* Sort Button */}

          <div style={{ position: "relative", display: "inline-block" }}>
            <button onClick={toggleSortMenu} className={styles.modifierButton}>
              {/* Sort Icon */}
              <svg
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.modifierIcon}
                fill="none"
                strokeWidth="2"
              >
                <path
                  d="M16.0686 15H7.9313C7.32548 15 7.02257 15 6.88231 15.1198C6.76061 15.2238 6.69602 15.3797 6.70858 15.5393C6.72305 15.7232 6.93724 15.9374 7.36561 16.3657L11.4342 20.4344C11.6323 20.6324 11.7313 20.7314 11.8454 20.7685C11.9458 20.8011 12.054 20.8011 12.1544 20.7685C12.2686 20.7314 12.3676 20.6324 12.5656 20.4344L16.6342 16.3657C17.0626 15.9374 17.2768 15.7232 17.2913 15.5393C17.3038 15.3797 17.2392 15.2238 17.1175 15.1198C16.9773 15 16.6744 15 16.0686 15Z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M7.9313 9.00005H16.0686C16.6744 9.00005 16.9773 9.00005 17.1175 8.88025C17.2393 8.7763 17.3038 8.62038 17.2913 8.46082C17.2768 8.27693 17.0626 8.06274 16.6342 7.63436L12.5656 3.56573C12.3676 3.36772 12.2686 3.26872 12.1544 3.23163C12.054 3.199 11.9458 3.199 11.8454 3.23163C11.7313 3.26872 11.6323 3.36772 11.4342 3.56573L7.36561 7.63436C6.93724 8.06273 6.72305 8.27693 6.70858 8.46082C6.69602 8.62038 6.76061 8.7763 6.88231 8.88025C7.02257 9.00005 7.32548 9.00005 7.9313 9.00005Z"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span>Sort by</span>
            </button>

            {showSortMenu && (
              <SortMenu
                sortMenuRef={sortMenuRef}
                tempSortBy={tempSortBy}
                tempSortOrder={tempSortOrder}
                setTempSortBy={setTempSortBy}
                setTempSortOrder={setTempSortOrder}
                applySort={applySort}
                closeSortMenu={closeSortMenu}
              />
            )}
          </div>

          <div style={{ position: "relative", display: "inline-block" }}>
            {/* Filter Button */}
            <button
              onClick={toggleFilterMenu}
              className={styles.modifierButton}
            >
              {/* Filter Icon */}
              <svg
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.modifierIcon}
                fill="none"
                strokeWidth="2"
              >
                <g id="style=linear">
                  <g id="filter-circle">
                    <path
                      id="vector"
                      d="M2 17.5H7"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      id="vector_2"
                      d="M22 6.5H17"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      id="vector_3"
                      d="M13 17.5H22"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      id="vector_4"
                      d="M11 6.5H2"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      id="vector_5"
                      d="M10 20.3999C8.34315 20.3999 7 19.0568 7 17.3999C7 15.743 8.34315 14.3999 10 14.3999C11.6569 14.3999 13 15.743 13 17.3999C13 19.0568 11.6569 20.3999 10 20.3999Z"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      id="vector_6"
                      d="M14 9.3999C15.6569 9.3999 17 8.05676 17 6.3999C17 4.74305 15.6569 3.3999 14 3.3999C12.3431 3.3999 11 4.74305 11 6.3999C11 8.05676 12.3431 9.3999 14 9.3999Z"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                </g>
              </svg>
              <span>Filter</span>
            </button>

            {showFilterMenu && (
              <FilterMenu
                filterMenuRef={filterMenuRef}
                tempFilter={tempFilter}
                setTempFilter={setTempFilter}
                applyFilter={applyFilter}
                resetFilter={resetFilter}
                closeFilterMenu={closeFilterMenu}
              />
            )}
          </div>

          {/* Action Menu */}
          <ActionMenu
            showActionMenu={showActionMenu}
            setShowActionMenu={setShowActionMenu}
            actionMenuRef={actionMenuRef}
            selectedPastes={selectedPastes}
            handleExportSelected={handleExportSelected}
            setShowDeleteModal={setShowDeleteModal}
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteModal
          selectedPastes={selectedPastes}
          totalPastes={totalPastes}
          setShowDeleteModal={setShowDeleteModal}
          handleDeleteSelected={handleDeleteSelected}
        />
      )}

      {/* Table for displaying pastes */}
      <PasteTable
        pastes={pastes}
        selectedPastes={selectedPastes}
        handleCheckboxChange={handleCheckboxChange}
        handleSelectAllChange={handleSelectAllChange}
        formatBytes={formatBytes}
      />

      {/* Pagination Controls */}
      <PaginationControls
        page={page}
        totalPages={totalPages}
        goToPreviousPage={goToPreviousPage}
        goToNextPage={goToNextPage}
        startEntry={startEntry}
        endEntry={endEntry}
        totalPastes={totalPastes}
      />
    </div>
  );
};

export default PasteManagement;
