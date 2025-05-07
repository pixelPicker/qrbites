declare global {
  interface User {
    id: string;
    username: string;
    email: string;
    profilePic: string | null;
    role: "staff" | "admin" | "manager";
    alias: string | null;
  }
}

export {};
