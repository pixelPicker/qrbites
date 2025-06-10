declare global {
  interface User {
    id: string;
    username: string;
    email: string;
    profilePic: string | null;
    role: "staff" | "admin" | "manager";
    alias: string | null;
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
  }
}

export {};
