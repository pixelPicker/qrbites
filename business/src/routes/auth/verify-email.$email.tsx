import { MdMarkEmailRead } from "react-icons/md";
import { emailResendMutation } from "@/api/mutations/resendMutation";
import { useAuthStoreContext } from "@/store/authContext";
import { QueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SpinningCircles } from "react-loading-icons";
import { Toaster } from "sonner";
import SpacingDiv from "@/components/custom/SpacingDiv";

interface RouteLoaderContext {
  queryClient: QueryClient;
}

export const Route = createFileRoute("/auth/verify-email/$email")({
  loader: ({ context, params }) => {
    const { queryClient } = context as RouteLoaderContext;
    const email = params.email;
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { email } = Route.useParams();
  const [isFetching, setIsFetching] = useState(false);
  const resendMutation = emailResendMutation(email);
  const { user } = useAuthStoreContext((state) => state);
  const navigate = useNavigate();
  const [resendTime, setResendTime] = useState(60);

  useEffect(() => {
    if (resendTime <= 0) {
      return;
    }
    const interval = setInterval(() => {
      setResendTime((prev) => prev - 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [resendTime]);

  if (user) {
    navigate({ to: "/dashboard" });
    return;
  }

  useEffect(() => {
    setIsFetching(resendMutation.isPending);

    return () => {
      setIsFetching(false);
    };
  }, [resendMutation.isPending]);

  const handleEmailResend = () => {
    
  }

  return (
    <>
      <div className="w-screen h-screen bg-linear-to-tr from-light-green via-light-green/75">
        <div className="grid place-items-center min-h-screen">
          <section className="bg-woo-white/70 font-Aeonik-Regular min-w-[280px] text-center shadow-xl/20 rounded-2xl !py-16 !px-20">
            <MdMarkEmailRead className="mx-auto text-7xl" />
            <SpacingDiv measure="h-2" />
            <h2 className="font-Aeonik-Bold text-2xl ">
              Verify your email to continue
            </h2>
            <SpacingDiv measure="h-2" />
            <p className="max-w-[35ch] mx-auto">
              We have sent an email to {email}. Please click on the link to
              verify
            </p>
            <SpacingDiv measure="h-8" />
            <p className="italic max-w-[35ch] text-hmm-black/60">
              If you don't see the email, be sure to check your spam or junk
              folder.
            </p>
            <SpacingDiv measure="h-8" />
            <span>
              <button
                className={`${resendTime > 0 ? "text-hmm-black/60 cursor-not-allowed" : "text-navy-blue cursor-pointer"}`}
                disabled={resendTime > 0 ? true : false}
                onClick={handleEmailResend}
              >
                Resend Email
              </button>
              &nbsp;in {resendTime} seconds.
            </span>
          </section>
        </div>

        {isFetching && (
          <div className="w-screen h-screen bg-hmm-black/50 absolute top-0 left-0 grid place-items-center">
            <SpinningCircles speed={0.7} />
          </div>
        )}
        <Toaster />
      </div>
    </>
  );
}
