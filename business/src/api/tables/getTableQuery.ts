import { Table } from "@/store/tableStore";
import { useQuery } from "@tanstack/react-query";

export const getTablesQuery = (restaurantSlug: string) => {
  return useQuery({
    queryKey: ["get-tables"],
    queryFn: async function (): Promise<{ tables: Table[] }> {
      const res = await fetch(
        `http://localhost:3000/tables/${restaurantSlug}`,
        {
          credentials: "include",
        }
      );
      if (!res.ok) {
        throw new Error("Couldn't fetch tables. Please try again");
      }
      return await res.json();
    },
    retry: 3,
  });
};

export const getTableQuery = (dishId: string) => {
  return useQuery({
    queryKey: ["get-single-table"],
    queryFn: async function (): Promise<{ table: Table }> {
      const res = await fetch(`http://localhost:3000/tables/table/${dishId}`, {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Couldn't fetch table. Please try again");
      }
      return await res.json();
    },
    retry: 3,
  });
};
