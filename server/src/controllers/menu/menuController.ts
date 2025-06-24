import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import { z } from "zod";
import { catchDrizzzzzleError } from "../../util/catchError.js";
import {
  dish,
  dishCategory,
  restaurant,
  restaurantStaff,
  staffWithPermissions,
} from "../../db/schema.js";
import { db } from "../../config/db.js";
import { hasDrizzzzzleError } from "../../util/checkError.js";
import { renewTokens } from "../../middleware/auth/renewTokens.js";
import path from "path";
import { getImageUrl, uploadMulterImageToS3 } from "../../lib/s3/upload.js";
import logger from "../../config/logger.js";
import { createClientDish } from "../../util/createClient.js";
import { deleteS3Image } from "../../lib/s3/delete.js";

const dishIdSchema = z.object({
  dishId: z.string().uuid(),
});

const addDishSchema = z.object({
  name: z
    .string()
    .max(30, { message: "Dish name must be less than 30 characters" }),
  description: z
    .string()
    .max(100, { message: "Description must be less than 100 characters" }),
  category: z.enum(dishCategory.enumValues),
  tags: z.preprocess((val) => {
    if (typeof val === "string") {
      try {
        return JSON.parse(val);
      } catch (error) {
        return [];
      }
    }
    return val;
  }, z.array(z.string()).optional()),
  isVeg: z.preprocess((val) => val === "true" || val === true, z.boolean()),
  isAvailable: z.preprocess(
    (val) => (val === undefined ? undefined : val === "true" || val === true),
    z.boolean().optional()
  ),
  price: z.preprocess(
    (val) => Number(val),
    z
      .number()
      .min(1)
      .max(1_000_000_000, { message: "Whatcha sellin bro /-O.O-\\" })
  ),
  discountPercentage: z.preprocess(
    (val) => (val !== undefined ? Number(val) : undefined),
    z
      .number()
      .min(0, { message: "Discount percentage should atleast be 0" })
      .max(100, { message: "Discount margins cannot exceed 100%" })
      .optional()
  ),
  preparationTime: z.preprocess(
    (val) => (val ? parseInt(val as string) : undefined),
    z.number().int().min(0).optional()
  ),
});
const updateDishSchema = z.object({
  name: z
    .string()
    .max(30, { message: "Dish name must be less than 30 characters" })
    .optional(),
  description: z
    .string()
    .max(100, { message: "Description must be less than 100 characters" })
    .optional(),
  category: z.enum(dishCategory.enumValues).optional(),
  tags: z
    .preprocess((val) => {
      if (typeof val === "string") {
        try {
          return JSON.parse(val);
        } catch {
          return [];
        }
      }
      return val;
    }, z.array(z.string()).optional())
    .optional(),
  isVeg: z
    .preprocess((val) => val === "true" || val === true, z.boolean())
    .optional(),
  isAvailable: z
    .preprocess(
      (val) => (val === undefined ? undefined : val === "true" || val === true),
      z.boolean().optional()
    )
    .optional(),
  price: z
    .preprocess(
      (val) => (val !== undefined ? Number(val) : undefined),
      z.number().min(1)
    )
    .optional(),
  discountPercentage: z
    .preprocess(
      (val) => (val !== undefined ? Number(val) : undefined),
      z
        .number()
        .min(0, { message: "Discount percentage should at least be 0" })
        .max(100, { message: "Discount margins cannot exceed 100%" })
        .optional()
    )
    .optional(),
  preparationTime: z
    .preprocess(
      (val) => (val !== undefined ? parseInt(val as string) : undefined),
      z.number().int().min(1).optional()
    )
    .optional(),
});

export const getAllMenuItems = async (req: Request, res: Response) => {
  const decoded = res.locals.decoded;
  const slug = req.params.slug;

  const [dbFetchError, fetchResults] = await catchDrizzzzzleError(
    db
      .select({ dish })
      .from(restaurant)
      .innerJoin(dish, eq(dish.restaurantId, restaurant.id))
      .where(eq(restaurant.slug, slug))
  );

  if (dbFetchError) {
    res.status(500).send(dbFetchError.message);
  }

  if (!fetchResults || fetchResults.length === 0) {
    res.status(200).json({ dishes: [] });
    return;
  }
  const menu = fetchResults.map((menuItem) => createClientDish(menuItem.dish));

  res.status(200).json({ dishes: menu });
  return;
};

export const getSingleMenuItem = async (req: Request, res: Response) => {
  const decoded = res.locals.decoded;

  const dishId = req.params.dishId;

  const [fetchDishError, fetchedDish] = await catchDrizzzzzleError(
    db.select({ dish }).from(dish).where(eq(dish.id, dishId))
  );
  if (fetchDishError) {
    res.status(500).send(fetchDishError.message);
  }

  if (!fetchedDish || fetchedDish.length === 0) {
    res.status(400).json({ error: "No such dish available." });
    return;
  }

  const clientDish = createClientDish(fetchedDish[0].dish);

  res.status(200).json({ dish: clientDish });
  return;
};

export const deleteMenuItem = async (req: Request, res: Response) => {
  const decoded = res.locals.decoded;

  const result = dishIdSchema.safeParse(req.body);

  if (!result.success) {
    const formattedError = result.error.format()._errors.join(". ");
    res.status(400).send(formattedError);
    return;
  }

  const [fetchUserError, fetchedUser] = await catchDrizzzzzleError(
    db
      .select()
      .from(staffWithPermissions)
      .where(eq(staffWithPermissions.id, decoded.id))
  );

  const fetchUserRequestAbondoned = hasDrizzzzzleError(
    fetchUserError,
    fetchedUser,
    res,
    null,
    null
  );
  if (!fetchUserRequestAbondoned) {
    return;
  }

  const fetchedStaffPermissions = fetchUserRequestAbondoned[0]
    .permissions as Permissions;

  if (!fetchedStaffPermissions.delete_menu_item) {
    res
      .status(403)
      .send("Action Denied. User doesn't have permisssion for this");
    return;
  }

  const [fetchDishError, fetchedDish] = await catchDrizzzzzleError(
    db.select().from(dish).where(eq(dish.id, result.data.dishId))
  );

  const fetchDishRequestAbondoned = hasDrizzzzzleError(
    fetchDishError,
    fetchedDish,
    res,
    null,
    null
  );

  if (!fetchDishRequestAbondoned) {
    return;
  }
  const error = await deleteS3Image(
    fetchDishRequestAbondoned[0].imageUrl,
    "qrbites-dish-image"
  );

  if (error) {
    res.status(500).send("Server Error. Couldn't delete dish");
  }

  const [deleteDishError, deletedDish] = await catchDrizzzzzleError(
    db.delete(dish).where(eq(dish.id, result.data.dishId)).returning()
  );

  const deleteDishRequestAbondoned = hasDrizzzzzleError(
    deleteDishError,
    deletedDish,
    res,
    null,
    null
  );

  if (!deleteDishRequestAbondoned) {
    return;
  }

  res.status(200).json({ dishId: deleteDishRequestAbondoned[0].id });
};

export const addItemToMenu = async (req: Request, res: Response) => {
  const decoded = res.locals.decoded;

  const result = addDishSchema.safeParse(req.body);
  if (!result.success) {
    const formattedError = result.error.errors.join(". ");
    res.status(400).send(formattedError);
    return;
  }

  if (!req.file) {
    res.status(400).send("Image is required for dish");
    return;
  }

  const [fetchRestaurantError, fetchedRestaurant] = await catchDrizzzzzleError(
    db
      .select()
      .from(staffWithPermissions)
      .innerJoin(
        restaurantStaff,
        eq(restaurantStaff.staffId, staffWithPermissions.id)
      )
      .innerJoin(restaurant, eq(restaurant.id, restaurantStaff.restaurantId))
      .where(eq(staffWithPermissions.id, decoded.id))
  );

  const requestAbondoned = hasDrizzzzzleError(
    fetchRestaurantError,
    fetchedRestaurant,
    res,
    null,
    null
  );

  if (!requestAbondoned) {
    return;
  }

  const fetchedStaffPermissions = requestAbondoned[0].staff_with_permissions
    .permissions as Permissions;

  if (!fetchedStaffPermissions.add_menu_item) {
    res
      .status(403)
      .send("Action Denied. User doesn't have permisssion for this");
    return;
  }
 
  const fileName = uuidv4() + path.extname(req.file.originalname);

  const fileUploadError = await uploadMulterImageToS3(
    req.file,
    fileName,
    "qrbites-dish-image"
  );
  if (fileUploadError) {
    logger.error({}, fileUploadError.message);
    res.status(500).send("Failed to upload dish. Please try again later");
    return;
  }

  const dishId = uuidv4();
  const [insertDishError, insertedDish] = await catchDrizzzzzleError(
    db
      .insert(dish)
      .values({
        id: dishId,
        category: result.data.category,
        description: result.data.description,
        imageUrl: getImageUrl(fileName, "qrbites-dish-image"),
        name: result.data.name,
        isVeg: result.data.isVeg,
        price: result.data.price,
        discountPercentage: result.data.discountPercentage,
        isAvailable: result.data.isAvailable ? result.data.isAvailable : true,
        preparationTime: result.data.preparationTime,
        restaurantId: requestAbondoned[0].restaurant.id,
        tags: result.data.tags,
      })
      .returning()
  );

  const insertRequestAbondoned = hasDrizzzzzleError(
    insertDishError,
    insertedDish,
    res,
    null,
    null
  );

  if (!insertRequestAbondoned) {
    return;
  }

  const newDish = createClientDish(insertRequestAbondoned[0]);

  res.status(201).json({ dish: newDish });
};

export const updateMenuItem = async (req: Request, res: Response) => {
  const decoded = res.locals.decoded;

  const result = updateDishSchema.safeParse(req.body);
  if (!result.success) {
    const formattedError = result.error.format()._errors.join(". ");
    res.status(400).send(formattedError);
    return;
  }

  const [fetchRestaurantError, fetchedRestaurant] = await catchDrizzzzzleError(
    db
      .select()
      .from(staffWithPermissions)
      .innerJoin(
        restaurantStaff,
        eq(restaurantStaff.staffId, staffWithPermissions.id)
      )
      .innerJoin(restaurant, eq(restaurant.id, restaurantStaff.restaurantId))
      .where(eq(staffWithPermissions.id, decoded.id))
  );

  const requestAbondoned = hasDrizzzzzleError(
    fetchRestaurantError,
    fetchedRestaurant,
    res,
    null,
    null
  );

  if (!requestAbondoned) {
    return;
  }

  const fetchedStaffPermissions = requestAbondoned[0].staff_with_permissions
    .permissions as Permissions;

  if (!fetchedStaffPermissions.edit_menu) {
    res
      .status(403)
      .send("Action Denied. User doesn't have permisssion for this");
    return;
  }

  const existingDish = result.data;
  const dishId = req.params.dishId;

  const [fetchDishError, fetchedDish] = await catchDrizzzzzleError(
    db.select().from(dish).where(eq(dish.id, dishId))
  );

  const fetchDishRequestAbondoned = hasDrizzzzzleError(
    fetchDishError,
    fetchedDish,
    res,
    null,
    null
  );

  if (!fetchDishRequestAbondoned) {
    return;
  }

  if (req.file) {
    const fileUploadError = await uploadMulterImageToS3(
      req.file,
      fetchDishRequestAbondoned[0].imageUrl,
      "qrbites-dish-image"
    );
    if (fileUploadError) {
      logger.error({}, fileUploadError.message);
      res.status(500).send("Failed to upload dish. Please try again later");
      return;
    }
  }

  const [updateDishError, updatedDish] = await catchDrizzzzzleError(
    db
      .update(dish)
      .set({
        ...(existingDish.name !== undefined &&
          existingDish.name !== null && { name: existingDish.name }),
        ...(existingDish.description !== undefined &&
          existingDish.description !== null && {
            description: existingDish.description,
          }),
        ...(existingDish.isVeg !== undefined &&
          existingDish.isVeg !== null && { isVeg: existingDish.isVeg }),
        ...(existingDish.price !== undefined &&
          existingDish.price !== null && { price: existingDish.price }),
        ...(existingDish.category !== undefined &&
          existingDish.category !== null && {
            category: existingDish.category,
          }),
        ...(existingDish.tags !== undefined &&
          existingDish.tags !== null && { tags: existingDish.tags }),
        ...(existingDish.isAvailable !== undefined &&
          existingDish.isAvailable !== null && {
            isAvailable: existingDish.isAvailable,
          }),
        ...(existingDish.discountPercentage !== undefined &&
          existingDish.discountPercentage !== null && {
            discountPercentage: existingDish.discountPercentage,
          }),
        ...(existingDish.preparationTime !== undefined &&
          existingDish.preparationTime !== null && {
            preparationTime: existingDish.preparationTime,
          }),
      })
      .where(eq(dish.id, dishId))
      .returning()
  );

  const updateRequestAbondoned = hasDrizzzzzleError(
    updateDishError,
    updatedDish,
    res,
    null,
    null
  );

  if (!updateRequestAbondoned) {
    return;
  }

  const clientDish = createClientDish(updateRequestAbondoned[0]);

  res.status(200).json({ dish: clientDish });
  return;
};
