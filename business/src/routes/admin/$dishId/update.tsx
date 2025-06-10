import { addDishMutation } from "@/api/menu/addDishMutation";
import { getDishQuery } from "@/api/menu/getMenuQuery";
import { updateDishMutation } from "@/api/menu/updateDishMutation";
import { InputLabel } from "@/components/custom/InputLabel";
import SpacingDiv from "@/components/custom/SpacingDiv";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { menuCategories } from "@/constants/menuCategories";
import { Dish, useMenuStore } from "@/store/menuStore";
import { Select } from "@radix-ui/react-select";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { MdOutlinePreview } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { SpinningCircles } from "react-loading-icons";

export const Route = createFileRoute("/admin/$dishId/update")({
  component: RouteComponent,
});

function RouteComponent() {
  const { dishId } = Route.useParams();
  const { menu } = useMenuStore((s) => s);
  const dish = menu.find((dish) => dish.id === dishId);

  if (!dish) {
    return (
      <div className="grid place-items-center gap-3 h-full">
        <img src="/images/error2.jpg" className="w-1/3 aspect-auto"></img>
        <p>Couldn't find dish</p>
        <Link
          to="/admin/menu"
          className="bg-dark-what hover:bg-dark-what-hover rounded-lg !px-3 !py-1 transition-all"
        >
          Go Back
        </Link>
      </div>
    );
  }
  return <DishUpdateForm dish={dish}></DishUpdateForm>;
}

const inputClass =
  "w-full !px-4 !py-2 rounded-lg bg-woo-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-dark-what shadow-inner transition-all duration-200";

const checkboxClass =
  "!mx-2 !my-2 rounded-lg bg-woo-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-dark-what shadow-inner transition-all duration-200";

function DishUpdateForm({ dish }: { dish: Dish }) {
  const navigate = useNavigate();
  const [imageChanged, setImageChanged] = useState(false);

  const [dishTags, setDishTags] = useState<string[]>(dish.tags ?? []);
  const [dishImage, setDishImage] = useState<File | null>(null);
  const [imagePreviewURL, setImagePreviewURL] = useState<string | null>(
    dish.imageUrl
  );

  const tagsInputRef = useRef<HTMLInputElement | null>(null);

  const [dishTagError, setDishTagError] = useState<string | null>(null);
  const [dishImageError, setDishImageError] = useState<string | null>(null);

  const { updateDish } = useMenuStore();
  const mutation = updateDishMutation(updateDish, navigate);

  useEffect(() => {
    if (!dishImageError) {
      return;
    }
    const nameErrorTimeout = setTimeout(() => {
      setDishImageError("");
    }, 2500);
    return () => {
      clearTimeout(nameErrorTimeout);
    };
  }, [dishImageError]);

  useEffect(() => {
    if (!dishTagError) {
      return;
    }
    const nameErrorTimeout = setTimeout(() => {
      setDishTagError("");
    }, 2500);
    return () => {
      clearTimeout(nameErrorTimeout);
    };
  }, [dishTagError]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const formData = new FormData(form);

    if (dishTags.length > 0) {
      formData.set("tags", JSON.stringify(dishTags));
    }
    if (!imageChanged) {
      formData.delete("dishImage");
    }
    if (!formData.get("discountPercentage")) {
      formData.delete("discountPercentage");
    }
    if (!formData.get("preparationTime")) {
      formData.delete("preparationTime");
    }
    if (!formData.get("tags")) {
      formData.delete("tags");
    }
    if (!formData.get("isAvailable")) {
      formData.set("isAvailable", JSON.stringify(null));
    } else {
      formData.set("isAvailable", JSON.stringify(true));
    }
    if (formData.get("isVeg")) {
      formData.set("isVeg", JSON.stringify(true));
    } else {
      formData.set("isVeg", JSON.stringify(false));
    }

    console.log(formData);
    mutation.mutate({ formData, dishId: dish.id});
  };

  const handleImageSubmit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size >= 1024 * 1024) {
        setDishImageError("Image size should be less than 1 MB");
        if (!dishImage) {
          setDishImage(null);
        }
        if (!imagePreviewURL) {
          setImagePreviewURL(null);
        }
        e.target.value = "";
        return;
      }
      setImageChanged(true);
      setDishImage(file);
      setImagePreviewURL(URL.createObjectURL(file));
    }
  };

  const handleAddTag = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (!tagsInputRef.current) {
      return;
    }
    if (!tagsInputRef.current.value) {
      setDishTagError("Tag value cannot be empty");
    }
    const tags = tagsInputRef.current.value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0 && !dishTags.includes(tag));
    const newDishTags = [...dishTags, ...tags];
    if (newDishTags.length > 5) {
      setDishTagError("More than 5 tags are not allowed for a dish");
      tagsInputRef.current.focus();
      return;
    }
    setDishTags(newDishTags);

    tagsInputRef.current.value = "";
    tagsInputRef.current.focus();
  };

  const handleRemoveTag = (tagIndex: number) => {
    const newTags = dishTags.filter((_, index) => index !== tagIndex);
    setDishTags(newTags);
  };

  return (
    <div className="grid place-items-center font-Aeonik-Regular overflow-y-scroll h-full">
      <div className="max-w-[450px] !py-16">
        <h3 className="font-medium text-center text-3xl">Update Menu Item</h3>
        <SpacingDiv measure="h-8" />
        <form
          method="POST"
          encType="multipart/form-data"
          onSubmit={handleFormSubmit}
        >
          <InputLabel for="name" hasAsterisk={true} text="Name" />
          <SpacingDiv measure="h-1" />
          <input
            className={inputClass}
            name="name"
            id="name"
            required
            defaultValue={dish.name}
            maxLength={30}
            type="text"
            placeholder="Enter dish name (eg. Pizza)"
          />

          <SpacingDiv measure="h-4" />

          <InputLabel for="description" hasAsterisk={true} text="Description" />
          <SpacingDiv measure="h-1" />
          <input
            className={inputClass}
            name="description"
            id="description"
            required
            defaultValue={dish.description}
            type="text"
            maxLength={100}
            placeholder="Describe your dish (up to 100 words)"
          />

          <SpacingDiv measure="h-4" />

          <div className="grid grid-cols-2 gap-2 w-full">
            <div>
              <InputLabel for="price" hasAsterisk={true} text="Price" />
              <SpacingDiv measure="h-1" />
              <input
                className={inputClass}
                name="price"
                id="price"
                type="number"
                min={0}
                defaultValue={dish.price}
                required
                placeholder="Enter price (eg: $4.00)"
              />
            </div>
            <div>
              <InputLabel
                for="discountPercentage"
                hasAsterisk={false}
                text="Discount Percentage"
              />
              <SpacingDiv measure="h-1" />
              <input
                className={inputClass}
                name="discountPercentage"
                type="number"
                id="discountPercentage"
                min={0}
                defaultValue={dish.discountPercentage ?? ""}
                max={100}
                placeholder="Discount (0% - 100%)"
              />
            </div>
          </div>

          <SpacingDiv measure="h-4" />

          <div className="grid grid-cols-2 gap-x-2 w-full">
            <div>
              <InputLabel
                for="category"
                hasAsterisk={true}
                text="Select a category"
              />
              <div className="h-1 col-span-2"></div>
              <Select name="category" defaultValue={dish.category} required>
                <SelectTrigger className="w-full !px-4 !py-2 rounded-lg bg-woo-white text-gray-800 shadow-inner transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-dark-what">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-woo-white text-gray-800 rounded-lg shadow-md border border-gray-200">
                  {menuCategories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id}
                      className="cursor-pointer font-Aeonik-Regular px-4 py-2 hover:bg-gray-100 transition-all duration-150 focus:bg-gray-100 focus:text-dark-what"
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <InputLabel
                for="preparationTime"
                hasAsterisk={false}
                text="Preparation time (minutes)"
              />
              <div className="h-1 col-span-2"></div>
              <Select
                name="preparationTime"
                defaultValue={dish.preparationTime?.toString()}
              >
                <SelectTrigger className="w-full !px-4 !py-2 rounded-lg bg-woo-white text-gray-800 placeholder-gray-400 shadow-inner transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-dark-what text-base font-Aeonik-Regular">
                  <SelectValue placeholder="Time (in minutes)" />
                </SelectTrigger>
                <SelectContent className="bg-woo-white text-gray-800 rounded-lg shadow-md border border-gray-200 font-Aeonik-Regular">
                  {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60].map(
                    (min) => (
                      <SelectItem
                        key={min}
                        value={min.toString()}
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100 transition-all duration-150 focus:bg-gray-100 focus:text-dark-what font-Aeonik-Regular"
                      >
                        {min} min
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <SpacingDiv measure="h-4" />

          <div>
            <InputLabel
              for="tags"
              hasAsterisk={false}
              text="Add tags separated by commas"
            />
            <div className="h-1 col-span-2"></div>
            <div className="flex items-center w-full gap-2">
              <input
                name="tags"
                className={inputClass + "flex-1"}
                id="tags"
                ref={tagsInputRef}
                minLength={1}
                placeholder="Enter tags here (eg. spicy, vegan, gluten-free)"
              />
              <button
                type="button"
                onClick={(e) => handleAddTag(e)}
                className="h-full flex-1/4 rounded-lg !px-4 bg-dark-what hover:bg-dark-what-hover text-woo-white transition-all duration-300 !py-2"
              >
                Add Tag
              </button>
            </div>
            {dishTagError && <ErrorMessage message={dishTagError} />}
            <div className="flex gap-x-2 w-full flex-wrap">
              {dishTags.map((tag, index) => (
                <div
                  key={index}
                  className="!px-2 !py-2 !mt-2 bg-gray-what-active rounded-lg flex gap-3 min-w-fit items-center justify-between"
                >
                  {tag}
                  <RxCross2
                    className="cursor-pointer"
                    onClick={() => handleRemoveTag(index)}
                  />
                </div>
              ))}
            </div>
          </div>

          <SpacingDiv measure="h-4" />

          <InputLabel for="dishImage" hasAsterisk={true} text="Dish Image" />
          <div className="h-1 col-span-2"></div>
          <div className="flex items-center gap-2 w-full">
            <input
              type="file"
              accept="image/*"
              name="dishImage"
              onChange={handleImageSubmit}
              id="dishImage"
              className="w-full rounded-lg bg-woo-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-dark-what shadow-inner transition-all duration-200 file:!mr-4 file:rounded-lg file:!py-2 file:!px-3 file:h-full file:bg-dark-what file:text-woo-white hover:file:bg-dark-what-hover"
            />
            {imagePreviewURL && (
              <div className="group relative inline-block">
                <MdOutlinePreview className="scale-150 cursor-pointer" />
                <div className="absolute z-10 -top-full left-1/2 -translate-y-full !mt-2 -translate-x-1/2 hidden group-hover:block">
                  <div className="rounded-lg shadow-lg">
                    <img
                      src={imagePreviewURL}
                      alt="Preview"
                      className="max-w-[200px] aspect-auto object-cover rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          {dishImageError && <ErrorMessage message={dishImageError} />}

          <SpacingDiv measure="h-4" />
          <div>
            <div className="flex items-center">
              <input
                className={checkboxClass}
                type="checkbox"
                defaultChecked={dish.isVeg}
                name="isVeg"
              />
              <p className="w-full">Is this dish vegetarian?</p>
            </div>
          </div>

          <div>
            <div className="flex items-center">
              <input
                className={checkboxClass}
                type="checkbox"
                name="isAvailable"
                defaultChecked={dish.isAvailable ?? true}
              />
              <p className="w-full">Available for ordering</p>
            </div>
          </div>

          <SpacingDiv measure="h-4" />

          <button
            type="submit"
            className="w-full !py-3 rounded-lg bg-dark-what hover:bg-dark-what-hover text-woo-white text-lg transition-all duration-300 active:bg-dark-what-active"
          >
            Update Dish
          </button>
        </form>
      </div>
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <p className="text-sm text-non-veg-red font-Aeonik-Regular">{message}</p>
  );
}
