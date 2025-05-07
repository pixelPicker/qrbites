import { emailVerificationMutation } from "@/api/mutations/emailMutation";
import { useAuthStoreContext } from "@/store/authContext";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SpinningCircles } from "react-loading-icons";

interface emailVerificationParams {
  email: string;
  token: string;
}

export const Route = createFileRoute("/auth/confirm-page")({
  validateSearch: (
    search: Record<string, unknown>
  ): emailVerificationParams => {
    return {
      email: (search.email as string) || "",
      token: (search.token as string) || "",
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { email, token } = Route.useSearch();
  const { setUser, user } = useAuthStoreContext((state) => state);
  const navigate = useNavigate();
  const verificationMutation = emailVerificationMutation(
    email,
    token,
    setUser,
    navigate
  );
  const [isFetching, setIsFetching] = useState(false);

  if (user) {
    navigate({ to: "/dashboard" });
    return;
  }

  useEffect(() => {
    setIsFetching(verificationMutation.isPending);

    return () => {
      setIsFetching(false);
    };
  }, [verificationMutation.isPending]);
  const handleEmailVerification = () => {
    // if (email === "" || token === "") {
    //   toast("Invalid or expired link. Please request a new one.");
    //   return;
    // }
    verificationMutation.mutate();
  };

  return (
    <>
      {isFetching && (
        <div className="w-screen h-screen bg-hmm-black/50 absolute top-0 left-0 grid place-items-center">
          <SpinningCircles speed={0.7} />
        </div>
      )}
    </>
  );
}
