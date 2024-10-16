// app/auth/signin/page.tsx

"use client";

import styles from "@/styles/page.module.css";
import DashHeader from "@/components/DashHeader";
import ScrollContainer from "@/components/ScrollContainer";
import NotAuthenticatedPage from "@/app/admin/components/NotAuthenticatedPage";
import ErrorMessage from "@/components/ErrorMessage";
import { useSearchParams } from "next/navigation";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  let errorMessage = "";
  // Check for the default NextAuth error parameter
  if (error === "AccessDenied") {
    errorMessage = "You are not authorized to access this application.";
  } else if (error === "Signin") {
    errorMessage = "An error occurred during sign-in.";
  }

  return (
    <div className={styles.pageContainer}>
      <DashHeader isAuthenticated={false} />
      {errorMessage && <ErrorMessage message={errorMessage} />}
      <ScrollContainer>
        <NotAuthenticatedPage />
      </ScrollContainer>
    </div>
  );
}
