import { useMutation } from "@tanstack/react-query";
import { UseNavigateResult } from "@tanstack/react-router";
import { toast } from "sonner";

export const signupQueryMagicLink = (
  emailInputRef: React.RefObject<HTMLInputElement | null>,
  usernameInputRef: React.RefObject<HTMLInputElement | null>,
  setUser: (user: User) => void,
  navigate: UseNavigateResult<string>
) => {
  return useMutation({
    mutationKey: ["auth", "signup", "magic-link"],
    mutationFn: () =>
      signupMagicLinkFn(
        emailInputRef.current!.value,
        usernameInputRef.current!.value
      ),
    onError: (error) => {
      toast(error.message, { className: "!bg-non-veg-red !text-woo-white" });
    },
    onSuccess: (data) => {
      setUser(data);
      navigate({
        to: "/auth/verify-email",
        search: { email: "", token: "" },
      });
    },
  });
};

async function signupMagicLinkFn(email: string, username: string) {
  const res = await fetch(
    "http://localhost:3000/business/auth/signup/magic-link",
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        email,
        username,
      }),
    }
  );
  return await res.json();
}

export const signupQueryGoogle = (
  setUser: (user: User) => void,
  navigate: UseNavigateResult<string>
) => {
  return useMutation({
    mutationFn: signupGoogleFn,
    mutationKey: ["auth", "signup", "google"],
    onError: (error) => {
      toast(error.message, { className: "!bg-non-veg-red !text-woo-white" });
    },
    onSuccess: (data) => {
      setUser(data);
      navigate({
        to: "/restaurant/create",
      });
    },
  });
};

async function signupGoogleFn() {
  const res = await fetch("http://localhost:3000/business/auth/google", {
    method: "POST",
    credentials: "include",
  });
  return await res.json();
}
