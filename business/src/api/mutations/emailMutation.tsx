import { useMutation } from "@tanstack/react-query";
import { UseNavigateResult } from "@tanstack/react-router";
import { toast } from "sonner";

export const emailVerificationMutation = (
  email: string,
  token: string,
  setUser: (user: User) => void,
  navigate: UseNavigateResult<string>
) => {
  return useMutation({
    mutationFn: () => emailVerificationFn(email, token),
    mutationKey: ["auth", "signup", "magic-link", "callback"],
    onError: (error) => {
      toast(error.message, { className: "!bg-non-veg-red !text-woo-white" });
    },
    onSuccess: (data) => {
      toast("Successfully verified");
      setUser(data);
      navigate({ to: "/restaurant/create" });
    },
  });
};

async function emailVerificationFn(email: string, token: string) {
  const res = await fetch(
    "http://localhost:3000/business/auth/signup/magic-link/callback",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        token: token,
      }),
      credentials: "include",
    }
  );
  return await res.json();
}
