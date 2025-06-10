import { ErrorToast } from "@/components/custom/Toast";
import { DishCategoryState } from "@/store/menuStore";
import { useMutation } from "@tanstack/react-query";
import { UseNavigateResult } from "@tanstack/react-router";

export const addDishMutation = (
  navigate: UseNavigateResult<string>,
  appendDishes: DishCategoryState["setDishes"],
) => {
  return useMutation({
    mutationKey: ["add-dish"],
    mutationFn: async function ({ formData }: { formData: FormData }) {
      const res = await fetch("http://localhost:3000/menu", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (!res.ok) {
        throw new Error("Failed to add Dish. Please try again");
      }
      return await res.json();
    },
    onError(error) {
      ErrorToast(error);
    },
    onSuccess(data) {
      appendDishes([data.dish])
      navigate({to: "/admin/menu"})
    },
  });
};
