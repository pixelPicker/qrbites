import { useAuthStoreContext } from "@/store/authContext";
import { useRestaurantStoreContext } from "@/store/restaurantContext";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/restaurant/create")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {user} = useAuthStoreContext(state => state)

  useEffect(() => {
    async function refetch() {
      await Promise.all([
        queryClient.refetchQueries({
          queryKey: ["fetch-user"],
          exact: true,
        }),
        queryClient.refetchQueries({
          queryKey: ["fetch-restaurant"],
          exact: true,
        }),
      ]);
      const user = queryClient.getQueryData(["fetch-user"]);
      const restaurant = queryClient.getQueryData(["fetch-restaurant"]);

      if (!user) {
        navigate({ to: "/auth/login" });
      }
      if (restaurant) {
        navigate({ to: "/" });
      }
    }
    refetch();
  }, [navigate]);

  return (
    <>
      AYOO WE ARE HERE
      <h2>{user?.email}</h2>
      <p>{user?.username}</p>
    </>
  );
}
