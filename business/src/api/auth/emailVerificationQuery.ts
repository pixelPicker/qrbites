import { useQuery } from "@tanstack/react-query";

export const emailVerificationQuery = (email: string, token: string, type: "signup" | "signin") => {
  return useQuery({
    queryFn: () => emailVerificationFn(email, token, type),
    queryKey: ["auth", "signup", "magic-link", "callback"],
  });
};

async function emailVerificationFn(
  email: string,
  token: string,
  type: "signup" | "signin"
) {
  const res = await fetch(
    `http://localhost:3000/business/auth/${type === "signin" ? "signin" : "signup"}/magic-link/callback?token=${token}&email=${email}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );
  return await res.json();
}
