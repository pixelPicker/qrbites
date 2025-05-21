import { useQuery } from "@tanstack/react-query";
import { ReactNode } from "@tanstack/react-router";
import { createContext, useContext, useEffect, useRef } from "react";
import { createStore, StoreApi, useStore } from "zustand";

interface RestaurantInterface {
  restaurant: Restaurant | null;
  restaurantIsLoading: boolean;
  setRestaurant: (restaurant: Restaurant) => void;
  clearRestaurant: () => void;
}

const RestaurantContext = createContext<StoreApi<RestaurantInterface> | null>(
  null
);

export const RestaurantProvider = ({ children }: { children: ReactNode }) => {
  const restaurantRef = useRef<StoreApi<RestaurantInterface> | null>(null);

  if (!restaurantRef.current) {
    restaurantRef.current = createStore((set) => ({
      restaurant: null,
      restaurantIsLoading: true,
      setRestaurant: (restaurant: Restaurant) =>
        set({
          restaurant,
        }),
      clearRestaurant: () =>
        set({
          restaurant: null,
        }),
    }));
  }

  const getRestaurant = async () => {
    const res = await fetch("http://localhost:3000/business/restaurant/get", {
      credentials: "include",
    });
    if (res.status >= 400) {
      throw new Error("Failed to fetch restaurant");
    }
    return res.json();
  };

  const query = useQuery({
    queryKey: ["fetch-restaurant"],
    queryFn: getRestaurant,
  });

  useEffect(() => {
    const store = restaurantRef.current;
    if (!store) {
      return;
    }

    if(query.isLoading) {
      store.setState({restaurantIsLoading: true});
      return;
    }

    if (query.data) {
      store.getState().setRestaurant(query.data.restaurant);
      store.setState({ restaurantIsLoading: false });
    } else {
      store.getState().clearRestaurant();
      store.setState({ restaurantIsLoading: false });
    }
  }, [query.isError, query.data, query.isLoading]);

  return (
    <RestaurantContext.Provider value={restaurantRef.current}>
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurantStoreContext = <T,>(
  selector: (state: RestaurantInterface) => T
): T => {
  const store = useContext(RestaurantContext);
  if (!store) {
    throw new Error(
      "Restaurant Context not initialized. Please make sure you are using it in a store provider"
    );
  }
  return useStore(store, selector);
};
