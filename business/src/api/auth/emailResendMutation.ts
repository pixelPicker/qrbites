import { ErrorToast } from "@/components/custom/Toast";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const emailResendMutation = (
  email: string,
  type: "signin" | "signup"
) => {
  return useMutation({
    mutationKey: ["auth", "email-resend"],
    mutationFn: () => handleEmailResend({ email, type }),
    onError: (error) => {
      ErrorToast(error);
    },
    onSuccess: () => {
      toast("Email sent for verification");
    },
  });
};

async function handleEmailResend({
  email,
  type,
}: {
  email: string;
  type: "signin" | "signup";
}) {
  const res = await fetch(
    `http://localhost:3000/business/auth/resend-email/${type}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email: email,
      }),
    }
  );
  return await res.json();
}
