import { HiOutlineDotsVertical } from "react-icons/hi";
import { FaPlus } from "react-icons/fa6";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { menuCategories } from "@/constants/menuCategories";
import { useEffect, useState } from "react";
import { Dish, useMenuStore } from "@/store/menuStore";
import { getMenuQuery } from "@/api/menu/getMenuQuery";
import SpinningCircles from "react-loading-icons/dist/esm/components/spinning-circles";
import { useRestaurantStoreContext } from "@/store/restaurantContext";
import { NonVegIcon, VegIcon } from "@/components/custom/MealIcons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteDishMutation } from "@/api/menu/deleteDishMutation";

export const Route = createFileRoute("/admin/menu")({
  component: RouteComponent,
});

function RouteComponent() {
  const { setDishes } = useMenuStore((s) => s);
  const { restaurant } = useRestaurantStoreContext((s) => s);
  const { data, error, isLoading } = getMenuQuery(restaurant?.slug ?? "");

  useEffect(() => {
    if (data?.dishes) {
      setDishes(data.dishes);
    }
  }, [data, setDishes]);

  if (isLoading) {
    return (
      <div className="grid place-items-center h-full">
        <SpinningCircles stroke="#4b5563" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="grid place-items-center gap-3 h-full">
        <img src="/images/error2.jpg" className="w-2/3 aspect-auto"></img>
        <p>An Error occured. Please try again</p>
        <button className="bg-dark-what hover:bg-dark-what-hover !px-3 !py-1">
          Retry
        </button>
      </div>
    );
  }
  if (data) {
    return (
      <div className="!py-3 font-Aeonik-Regular !px-6 flex flex-col h-full">
        <Menu></Menu>
      </div>
    );
  }
}

function Menu() {
  const { menu, currentFilter, setCurrentFilter } = useMenuStore((s) => s);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMenu = menu.filter((dish) => {
    const matchesCategory =
      currentFilter === "all" || dish.category === currentFilter;
    const matchesSearch = dish.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <section className="flex justify-between items-center !py-3">
        <input
          type="text"
          name="searchMenu"
          id="searchMenu"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search"
          className="font-Aeonik-Regular flex-1 g-light-green/50 placeholder:font-Aeonik-Regular outline-none border-[2px] border-hmm-black/50 focus-within:border-hmm-black/70 bg-woo-white/50 !px-3 flex justify-between items-center !py-2 rounded-lg w-full max-w-[300px]"
        />
      </section>
      <section className="!pt-2 !pb-6 flex justify-between items-center">
        <ul className="flex items-center gap-3">
          {menuCategories.map((category) => (
            <li key={category.id}>
              <button
                onClick={() => setCurrentFilter(category.id)}
                className={
                  (category.id === currentFilter
                    ? "bg-the-green border-[2px] border-the-green "
                    : "border-[2px] border-hmm-black/70 text-hmm-black/70 hover:border-hmm-black/80 hover:text-hmm-black/80 transition-all duration-300 ") +
                  "!px-4 !py-[2px] cursor-pointer rounded-full"
                }
              >
                {category.name}
              </button>
            </li>
          ))}
        </ul>
        <div>
          <Link
            to="/admin/create-dish"
            className="flex items-center bg-the-green hover:bg-the-green-hover active:bg-the-green-active !px-4 !py-2 cursor-pointer rounded-full"
          >
            <FaPlus />
            &nbsp; Add New
          </Link>
        </div>
      </section>
      <section className="flex-1 @container font-Aeonik-Regular overflow-auto">
        {filteredMenu.length <= 0 ? (
          <div className="text-center text-gray-500 pt-10">No dishes found</div>
        ) : (
          <div className="grid grid-cols-1 @min-lg:grid-cols-2 @min-3xl:grid-cols-3 @min-4xl:grid-cols-4 gap-4">
            {filteredMenu.map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function DishCard({ dish }: { dish: Dish }) {
  const { deleteDish } = useMenuStore();
  const deleteMutation = deleteDishMutation(deleteDish);
  const navigate = useNavigate();

  const handleDishDelete = (dishId: Dish["id"]) => {
    deleteMutation.mutate({ dishId });
  };

  const handleUpdateDish = (dishId: Dish["id"]) => {
    navigate({ to: "/admin/$dishId/update", params: { dishId } });
  };

  return (
    <div className="border rounded-xl relative shadow-sm bg-white hover:shadow-md transition-all duration-200">
      <img
        src={dish.imageUrl}
        alt={dish.name}
        className="w-full h-40 object-cover rounded-t-lg"
      />
      {dish.isVeg ? (
        <VegIcon classname="absolute top-[10px] right-[10px]" />
      ) : (
        <NonVegIcon classname="absolute top-[10px] right-[10px]" />
      )}
      <div className="!p-3">
        <div className="flex items-start gap-2 w-full justify-between">
          <h3 className="font-medium text-lg overflow-ellipsis line-clamp-2">
            {dish.name.replace(dish.name[0], dish.name[0].toUpperCase())}
          </h3>
          <p className="flex gap-2 items-end">
            <span
              className={
                dish.discountPercentage
                  ? "line-through text-gray-400 text-sm"
                  : ""
              }
            >
              ₹{dish.price.toFixed(2)}
            </span>
            {dish.discountPercentage !== 0 && dish.discountPercentage && (
              <span>
                ₹
                {(
                  dish.price -
                  (dish.price * dish.discountPercentage) / 100
                ).toFixed(2)}
              </span>
            )}
          </p>
        </div>

        <p className="text-gray-700 overflow-ellipsis line-clamp-2">
          {dish.description}
        </p>

        <div className="!mt-4 flex justify-between items-center">
          <div className="flex justify-center gap-2">
            <span className="text-woo-white bg-navy-blue rounded-full text-xs !py-1 !px-3">
              {dish.category}
            </span>

            <span
              className={`text-xs !px-2 !py-1 rounded-full ${
                dish.isAvailable
                  ? "bg-light-green text-the-green-active"
                  : "bg-red-200 text-non-veg-red"
              }`}
            >
              {dish.isAvailable ? "Available" : "Unavailable"}
            </span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="!p-1 hover:bg-gray-what-hover transition-all duration-300 rounded-lg">
                <HiOutlineDotsVertical />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-52 font-Aeonik-Regular">
              <DropdownMenuItem onClick={() => handleUpdateDish(dish.id)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDishDelete(dish.id)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
