import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const emailResendMutation = (email: string) => {
  return useMutation({
    mutationKey: ["auth", "email-resend"],
    mutationFn: () => handleEmailResend(email),
    onError: (error) => {
      toast(error.message, { className: "!bg-non-veg-red !text-woo-white" });
    },
    onSuccess: () => {
      toast("Email sent for verification");
    },
  });
};

async function handleEmailResend(email: string) {
  const res = await fetch("http://localhost:3000/business/auth/resend-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      email: email,
    }),
  });
  return await res.json()
}
