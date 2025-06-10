import { ErrorToast } from "@/components/custom/Toast";
import { useMutation } from "@tanstack/react-query";
import { UseNavigateResult } from "@tanstack/react-router";

export const signupMagicLink = (
  emailInputRef: React.RefObject<HTMLInputElement | null>,
  usernameInputRef: React.RefObject<HTMLInputElement | null>,
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
      ErrorToast(error)
    },
    onSuccess: () => {
      navigate({
        to: "/auth/verify-email/$email",
        params: { email: emailInputRef.current!.value },
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
      },
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        email,
        username,
      }),
    }
  );
  if(!res.ok) {
    throw new Error("Process failed. Please try again")
  }
  return await res.json();
}

export const signupGoogle = (
  navigate: UseNavigateResult<string>
) => {
  return useMutation({
    mutationFn: signupGoogleFn,
    mutationKey: ["auth", "signup", "google"],
    onError: (error) => {
      ErrorToast(error)
    },
    onSuccess: () => {
      navigate({
        to: "/restaurant/create",
      });
    },
  });
};

async function signupGoogleFn() {
  window.location.href = "http://localhost:3000/business/auth/google";
}
