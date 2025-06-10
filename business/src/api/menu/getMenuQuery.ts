import { Dish } from "@/store/menuStore";
import { useQuery } from "@tanstack/react-query";

export const getMenuQuery = (restaurantSlug: string) => {
  return useQuery({
    queryKey: ["get-menu"],
    queryFn: async function () {
      const res = await fetch(`http://localhost:3000/menu/${restaurantSlug}`, {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Couldn't fetch menu. Please try again");
      }
      return await res.json();
    },
    retry: 3,
  });
};

export const getDishQuery = (dishId: string) => {
  return useQuery({
    queryKey: ["get-dish"],
    queryFn: async function (): Promise<{ dish: Dish }> {
      const res = await fetch(`http://localhost:3000/menu/dish/${dishId}`, {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Couldn't fetch menu. Please try again");
      }
      return await res.json();
    },
    retry: 3,
  });
};
