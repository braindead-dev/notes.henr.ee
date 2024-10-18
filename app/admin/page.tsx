// app/admin/page.tsx

"use client";

import { useSession } from "next-auth/react";
import DashHeader from "@/components/DashHeader";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";
import NotAuthenticatedPage from "./components/NotAuthenticatedPage";
import LoadingPage from "./components/LoadingPage";
import styles from "@/styles/page.module.css";
import ScrollContainer from "@/components/ScrollContainer";

export default function AdminPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className={styles.pageContainer}>
        <DashHeader isAuthenticated={false} />
        <ScrollContainer>
          <LoadingPage />
        </ScrollContainer>
      </div>
    );
  }

  if (!session || !session.user || !session.user.name) {
    return (
      <div className={styles.pageContainer}>
        <DashHeader isAuthenticated={false} />
        <ScrollContainer>
          <NotAuthenticatedPage />
        </ScrollContainer>
      </div>
    );
  }

  return (
    <div className={styles.admindashContainer}>
      <DashHeader isAuthenticated={true} />
      <ScrollContainer>
        <AdminDashboard userName={session.user.name} />
      </ScrollContainer>
    </div>
  );
}
