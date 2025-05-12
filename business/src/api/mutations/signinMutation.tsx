import { useMutation } from "@tanstack/react-query";
import { UseNavigateResult } from "@tanstack/react-router";
import React from "react";
import { toast } from "sonner";

export const signinMagicLink = (
  emailInputRef: React.RefObject<HTMLInputElement | null>,
  navigate: UseNavigateResult<string>
) => {
  return useMutation({
    mutationKey: ["auth", "signin", "magic-link"],
    mutationFn: () => signinMagicLinkFn(emailInputRef.current!.value),
    onError: (error) => {
      toast(error.message, { className: "!bg-non-veg-red !text-woo-white" });
    },
    onSuccess: () => {
      navigate({
        to: "/auth/verify-email/$email",
        params: { email: emailInputRef.current!.value },
      });
    },
  });
};

async function signinMagicLinkFn(email: string) {
  const res = await fetch("http://localhost:3000/business/auth/signin/magic-link", {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    method: "POST",
    credentials: "include",
    body: JSON.stringify({
      email,
    }),
  });
  if (!res.ok) {
    throw new Error("Process failed. Please try again");
  }
  return await res.json();
}

export const signinGoogle = (
  navigate: UseNavigateResult<string>
) => {
  return useMutation({
    
    mutationFn: signinGoogleFn,
    mutationKey: ["auth", "signin", "google"],
    onError: (error) => {
      toast(error.message, { className: "!bg-non-veg-red !text-woo-white" });
    },
    onSuccess: () => {
      navigate({
        to: "/restaurant/create",
      });
    },
  });
};

async function signinGoogleFn() {
  window.location.href = "http://localhost:3000/business/auth/google";
}
