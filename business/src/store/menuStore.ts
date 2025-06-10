import { menuCategories } from "@/constants/menuCategories";
import { create } from "zustand";

export type DishCategory = (typeof menuCategories)[number]["id"];

export type Dish = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Exclude<DishCategory, "all">;
  tags: string[] | null;
  imageUrl: string;
  isVeg: boolean;
  isAvailable: boolean | null;
  discountPercentage: number | null;
  preparationTime: number | null;
};

export type DishCategoryState = {
  menu: Dish[];
  currentFilter: DishCategory;
  setCurrentFilter: (category: DishCategory) => void;
  appendDishes: (dishes: Dish[]) => void;
  setDishes: (dishes: Dish[]) => void;
  clearDishes: () => void;
  deleteDish: (id: string) => void;
  updateDish: (id: string, updates: Partial<Dish>) => void;
};

export const useMenuStore = create<DishCategoryState>()((set) => ({
  menu: [] as Dish[],
  currentFilter: "all",
  setCurrentFilter: (category) => set(() => ({ currentFilter: category })),
  clearDishes: () => set({ menu: [] }),
  appendDishes: (dishes) =>
    set((state) => ({
      menu: state.menu ? [...state.menu, ...dishes] : dishes,
    })),
  deleteDish: (id) =>
    set((state) => ({ menu: state.menu.filter((value) => value.id !== id) })),
  setDishes: (dishes) => set({ menu: dishes }),
  updateDish: (id, updates) =>
    set((state) => ({
      menu: state.menu.map((dish) =>
        dish.id === id ? { ...dish, ...updates } : dish
      ),
    })),
}));
