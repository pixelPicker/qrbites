import { ErrorToast } from "@/components/custom/Toast";
import { Dish, DishCategoryState } from "@/store/menuStore";
import { useMutation } from "@tanstack/react-query";

export const deleteDishMutation = (
  deleteDish: DishCategoryState["deleteDish"]
) => {
  // return ╙
  return useMutation({
    mutationKey: ["delete-dish"],
    mutationFn: async function ({ dishId }: { dishId: Dish["id"] }) {
      const res = await fetch(`http:/localhost:3000/menu/${dishId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Failed to delele dish. Please try again");
      }
      return await res.json();
    },
    onError: (e) => {
      ErrorToast(e);
    },
    onSuccess: (data) => {
      deleteDish(data.dishId);
    },
  });
};
