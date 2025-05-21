declare global {
  interface PostgresError extends Error {
    code?: string;
  }
  interface User {
    id: string;
    username: string;
    email: string;
    profilePic: string | null;
    password: string | null;
    provider: "magic_link" | "google";
    createdAt: string;
    updatedAt: string;
    emailVerificationToken: string | null;
    isVerified: boolean | null;
    providerId: string | null;
  }
  interface Staff {
    id: string;
    username: string;
    email: string;
    password: string | null;
    provider: "magic_link" | "google";
    profilePic: string | null;
    alias: string | null;
    emailVerificationToken: string | null;
    isVerified: boolean | null;
    role: "staff" | "admin" | "manager";
    createdAt: string;
    updatedAt: string;
    providerId: string | null;
  }
  interface Restaurant {
    id: string;
    serialNo: number;
    name: string;
    email: string;
    phoneNumber: string | null;
    logoUrl: string | null;
    slug: string;
    openingTime: string | null;
    closingTime: string | null;
    createdAt: string;
    updatedAt: string;
  }
  interface VerificationEmail {
    verificationToken: string;
    email: string;
    party: "client" | "business";
  };
}
export {};
