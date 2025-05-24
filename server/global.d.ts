import { dishCategory } from "./src/db/schema.ts";

declare global {
  interface PostgresError extends Error {
    code?: string;
  }
  type DishCategory = (typeof dishCategory.enumValues)[number];

  interface Permissions {
    edit_menu: boolean;
    view_menu: boolean;
    view_staff: boolean;
    view_orders: boolean;
    manage_staff: boolean;
    view_billing: boolean;
    add_menu_item: boolean;
    cancel_orders: boolean;
    view_analytics: boolean;
    update_settings: boolean;
    delete_menu_item: boolean;
    update_order_status: boolean;
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
  interface Dish {
    id: string;
    restaurantId: string;
    name: string;
    description: string;
    price: number;
    category: DishCategory;
    tags: string[] | null;
    imageUrl: string;
    isAvailable: boolean | null;
    discountPercentage: number | null;
    createdAt: string;
    updatedAt: string;
    preparationTime: number | null;
  }
  interface VerificationEmail {
    verificationToken: string;
    email: string;
    party: "client" | "business";
  }
}
export {};
