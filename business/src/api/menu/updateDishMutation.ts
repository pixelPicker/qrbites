import { ErrorToast, SuccessToast } from "@/components/custom/Toast";
import { Dish, DishCategoryState } from "@/store/menuStore";
import { useMutation } from "@tanstack/react-query";
import { UseNavigateResult } from "@tanstack/react-router";

export const updateDishMutation = (
  updateDish: DishCategoryState["updateDish"],
  navigate: UseNavigateResult<string>
) => {
  return useMutation({
    mutationKey: ["update-dish"],
    mutationFn: async function ({
      formData,
      dishId,
    }: {
      formData: FormData;
      dishId: Dish["id"];
    }) {
      const res = await fetch(
        `http://localhost:3000/menu/update/${dishId}`,
        {
          method: "PUT",
          credentials: "include",
          body: formData,
        }
      );
      if (!res.ok) {
        throw new Error("Failed to update dish. Please try again");
      }
      return await res.json();
    },
    onError: (error) => {
      ErrorToast(error);
    },
    onSuccess: (data) => {
      updateDish(data.dish.id, data.dish);
      SuccessToast("Dish Updated successfully");
      navigate({ to: "/admin/menu" });
    },
  });
};
