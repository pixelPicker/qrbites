import { ErrorToast } from "@/components/custom/Toast";
import { useRestaurantStoreContext } from "@/store/restaurantContext";
import { useMutation } from "@tanstack/react-query";
import { UseNavigateResult } from "@tanstack/react-router";

interface restaurantCreationProps {
  name: string;
  email: string;
  phoneNumber: string;
  file?: File | null;
}

export const restaurantCreation = (navigate: UseNavigateResult<string>) => {
  const { setRestaurant } = useRestaurantStoreContext((state) => state);
  return useMutation({
    mutationKey: ["restaurant", "create"],
    mutationFn: async function (payload: restaurantCreationProps) {
      const formData = new FormData();
      formData.append("name", payload.name);
      formData.append("email", payload.email);
      formData.append("phoneNumber", payload.phoneNumber);
      if (payload.file) {
        formData.append("logo", payload.file);
      }
      const res = await fetch("http://localhost:3000/restaurant/create", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (!res.ok) {
        throw new Error("Failed to uplaod data");
      }
      return await res.json();
    },
    onError: (err) => {
      ErrorToast(err);
    },
    onSuccess: (data) => {
      setRestaurant(data.restaurant);
      navigate({ to: "/" });
    },
  });
};
