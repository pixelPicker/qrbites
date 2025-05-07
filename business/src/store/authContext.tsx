import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ReactNode } from "@tanstack/react-router";
import { createContext, useContext, useEffect, useRef } from "react";
import { createStore, useStore, StoreApi } from "zustand";
import { toast } from "sonner";
interface AuthInterface {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

const AuthContext = createContext<StoreApi<AuthInterface> | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const authRef = useRef<StoreApi<AuthInterface> | null>(null);
  const queryClient = useQueryClient();

  if (!authRef.current) {
    authRef.current = createStore((set) => ({
      user: null,
      setUser: (user: User) => set({ user }),
      clearUser: () => set({ user: null }),
    }));
  }

  const getUser = async () => {
    const res = await fetch("http://localhost:3000/client/auth/verify-staff");
    const user = await res.json();
  };

  useEffect(() => {
    try {
      const res = useQuery({ queryKey: ["auth-key"], queryFn: getUser });
      if (res.error) {
        toast("Uh, on. Something wrong happened", {});
      }
    } catch (error) {}
  }, []);

  return (
    <AuthContext.Provider value={authRef.current}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthStoreContext = <T,>(
  selector: (state: AuthInterface) => T
): T => {
  const store = useContext(AuthContext);
  if (!store) {
    throw new Error(
      "AuthContext not initialized. Please make sure you are using it in a store provider"
    );
  }
  return useStore(store, selector);
};
