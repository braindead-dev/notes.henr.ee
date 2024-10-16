"use client";

import { Suspense } from "react";
import styles from "@/styles/page.module.css";
import DashHeader from "@/components/DashHeader";
import ScrollContainer from "@/components/ScrollContainer";
import NotAuthenticatedPage from "@/app/admin/components/NotAuthenticatedPage";
import ErrorMessage from "@/components/ErrorMessage";
import { useSearchParams } from "next/navigation";

function SignInContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  let errorMessage = "";
  if (error === "AccessDenied") {
    errorMessage = "You are not authorized to access this application.";
  } else if (error === "Signin") {
    errorMessage = "An error occurred during sign-in.";
  }

  return (
    <div className={styles.pageContainer}>
      {errorMessage && <ErrorMessage message={errorMessage} />}
      <ScrollContainer>
        <NotAuthenticatedPage />
      </ScrollContainer>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashHeader isAuthenticated={false} />
      <SignInContent />
    </Suspense>
  );
}
