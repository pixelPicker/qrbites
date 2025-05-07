import { useAuthStoreContext } from "@/store/authContext";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/restaurant/create")({
  component: RouteComponent,
});

function RouteComponent() {
  const user = useAuthStoreContext((state) => {
    return state.user;
  });
  const navigate = useNavigate();
  if (!user) {
    navigate({
      to: "/auth/register",
    });
    return;
  }
  return (
    <>
      AYOO WE ARE HERE
      <h2>{user.email}</h2>
      <p>{user.username}</p>
    </>
  );
}
