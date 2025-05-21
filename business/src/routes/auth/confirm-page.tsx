import { emailVerificationQuery } from "@/api/queries/emailVerificationQuery";
import { useAuthStoreContext } from "@/store/authContext";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SpinningCircles } from "react-loading-icons";
import { toast } from "sonner";

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
  const verificationQuery = emailVerificationQuery(
    email,
    token,
  );

  if (user) {
    navigate({ to: "/" });
    return;
  }

  if (verificationQuery.isFetching) {
    return (
      <div className="w-screen h-screen bg-hmm-black/50 absolute top-0 left-0 flex flex-col gap-4 justify-center items-center min-h-screen">
        <SpinningCircles speed={0.7} />
        <h3 className="text-xl font-Aeonik-Regular">
          Verification is in process. Please wait ...
        </h3>
      </div>
    );
  }

  if (verificationQuery.error) {
    return (
      <div className="flex flex-col font-Aeonik-Regular justify-center items-center gap-4 min-h-screen">
        <img src="/images/error.jpg" className="w-1/3 aspect-square"></img>
        <h1 className="text-lg font-semibold">
          Opps! An error occurred during verification
        </h1>
        <div className="grid grid-cols-2 items-center gap-4">
          <button
            onClick={() => {
              verificationQuery.refetch();
            }}
            className="w-full rounded-lg !px-3 !py-2 border-[2px] border-b-4 border-the-green bg-the-green/20 shadow-sm cursor-pointer hover:bg-the-green/40 active:border-b-[2px] active:bg-the-green/50 active:mb-[2px] transition-all"
          >
            Retry
          </button>
          <button
            onClick={() => {
              navigate({ to: "/" });
            }}
            className=" min-w-fit rounded-lg !px-3 !py-2 border-[2px] border-b-4 border-hmm-black bg-hmm-black/20 shadow-sm cursor-pointer hover:bg-hmm-black/40 active:border-b-[2px] active:bg-hmm-black/50 active:mb-[2px] transition-all"
          >
            Back to home page
          </button>
        </div>
      </div>
    );
  }

  if (verificationQuery.isSuccess) {
    toast("Successfully verified");
    setUser(verificationQuery.data.user);
    navigate({ to: "/restaurant/create" });
  }
}
