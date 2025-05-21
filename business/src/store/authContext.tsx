import { useQuery } from "@tanstack/react-query";
import { ReactNode } from "@tanstack/react-router";
import { createContext, useContext, useEffect, useRef } from "react";
import { createStore, useStore, StoreApi } from "zustand";

interface AuthInterface {
  user: User | null;
  authIsLoading: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
}

const AuthContext = createContext<StoreApi<AuthInterface> | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const authRef = useRef<StoreApi<AuthInterface> | null>(null);

  if (!authRef.current) {
    authRef.current = createStore((set) => ({
      user: null,
      authIsLoading: true,
      setUser: (user: User) => set({ user }),
      clearUser: () => set({ user: null }),
    }));
  }

  const getUser = async () => {
    const res = await fetch("http://localhost:3000/business/auth/verify", {
      credentials: "include",
    });
    if (res.status >= 400) {
      throw new Error("User is unauthorized");
    }
    return await res.json();
  };

  const query = useQuery({ queryKey: ["fetch-user"], queryFn: getUser });

  useEffect(() => {
    const store = authRef.current;
    if (!store) {
      return;
    }
    if(query.isLoading) {
      store.setState({authIsLoading: true})
      return;
    }
    if (query.data) {
      authRef.current?.getState().setUser(query.data.user);
      authRef.current?.setState({ authIsLoading: false });
    } else {
      authRef.current?.getState().clearUser();
      authRef.current?.setState({ authIsLoading: false });
    }
  }, [query.isError, query.data, query.isLoading]);

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
      "Auth Context not initialized. Please make sure you are using it in a store provider"
    );
  }
  return useStore(store, selector);
};
