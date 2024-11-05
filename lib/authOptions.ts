// lib/authOptions.ts

import type { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

// Extend the Session interface to include the id property
declare module "next-auth" {
  interface Session {
    user: {
      id?: number;
      name?: string | null;
    }
  }
}

interface GitHubProfile extends Record<string, any> {
  id?: number; 
}

// Load allowed users from environment variables
const allowedUsers = process.env.ALLOWED_USERS?.split(",") || [];

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin", // Custom sign-in page
    error: "/auth/signin",  // Redirect to sign-in page on error
  },
  session: {
    // Session will expire in 8 hours
    maxAge: 8 * 60 * 60, // 8 hours in seconds
    updateAge: 60 * 60, // Update session every 1 hour
  },
  callbacks: {
    async signIn({ profile }) {
      const githubProfile = profile as GitHubProfile;
      // Check if the GitHub user ID is in the allowed list
      if (githubProfile?.id && allowedUsers.includes(githubProfile.id.toString())) {
        return true;
      }
      return false;
    },
    async jwt({ token, profile }) {
      const githubProfile = profile as GitHubProfile;
      if (githubProfile) {
        token.id = githubProfile.id;  // Store the GitHub user ID in the token
        token.name = githubProfile.login;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        // Cast `token.id` to a number (if it's there), or undefined if not
        session.user.id = token.id as number | undefined;  // Include the GitHub user ID in the session
        session.user.name = token.name;
      }
      return session;
    },
  },
};
