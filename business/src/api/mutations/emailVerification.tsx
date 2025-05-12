import { useQuery } from "@tanstack/react-query";

export const emailVerificationQuery = (email: string, token: string) => {
  return useQuery({
    queryFn: () => emailVerificationFn(email, token),
    queryKey: ["auth", "signup", "magic-link", "callback"],
  });
};

async function emailVerificationFn(email: string, token: string) {
  const res = await fetch(
    `http://localhost:3000/business/auth/signup/magic-link/callback?token=${token}&email=${email}`,
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
