import React from "react";
import styles from "@/styles/AdminDashboard.module.css";

const ExportBackup: React.FC = () => {
  const handleExport = async () => {
    try {
      const response = await fetch("/api/admin/export");
      const data = await response.json();

      // Create a Blob from the JSON data
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);

      // Generate a timestamp for the file name (e.g., 2024-10-15-103020)
      const now = new Date();
      const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}-${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`;

      // Set the file name with the timestamp
      const filename = `${timestamp}-notes-henr-ee-backup.json`;

      // Create an invisible link element to trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.download = filename; // Set the file name for the download
      document.body.appendChild(link);
      link.click(); // Trigger the download
      document.body.removeChild(link); // Clean up the link
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  return (
    <div className={styles.container} style={{ width: "100%" }}>
      <h2 className={styles.sectionTitle}>Export Database</h2>
      <button className={styles.exportButton} onClick={handleExport}>
        Export Database
      </button>
    </div>
  );
};

export default ExportBackup;
