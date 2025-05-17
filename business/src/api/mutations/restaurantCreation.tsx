import { ErrorToast } from "@/components/custom/Toast";
import { useRestaurantStoreContext } from "@/store/restaurantContext";
import { useMutation } from "@tanstack/react-query";

interface restaurantCreationProps {
  email: string;
  phoneNumber: string;
  file?: File | null;
}

export const restaurantCreation = () => {
  const {setRestaurant} = useRestaurantStoreContext(state => state)
  return useMutation({
    mutationKey: ["restaurant", "create"],
    mutationFn: async function ({
      email,
      phoneNumber,
      file,
    }: restaurantCreationProps) {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("phoneNumber", phoneNumber);
      if (file) {
        formData.append("logo", file);
      }
      const res = await fetch("http://localhost:3000/restaurant/create", {
        method: "POST",
        credentials: "include",
        body: formData
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
      setRestaurant(data);
    }
  });
};
