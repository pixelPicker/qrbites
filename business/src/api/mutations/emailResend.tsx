import { ErrorToast } from "@/components/custom/Toast";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const emailResendMutation = (email: string) => {
  return useMutation({
    mutationKey: ["auth", "email-resend"],
    mutationFn: () => handleEmailResend(email),
    onError: (error) => {
      ErrorToast(error)
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
