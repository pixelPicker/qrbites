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
import { renewTokens } from "../../util/renewTokens.js";
import path from "path";
import { getImageUrl, uploadImageToS3 } from "../../lib/s3/upload.js";
import logger from "../../config/logger.js";
import { createClientDish } from "../../util/createClient.js";

const dishIdSchema = z.object({
  dishId: z.string().uuid(),
});

const addDishSchema = z.object({
  dish: z.object({
    name: z
      .string()
      .max(30, { message: "Dish name must be less than 30 characters" }),
    description: z
      .string()
      .max(100, { message: "Description must be less than 100 characters" }),
    price: z.number().min(1),
    category: z.enum(dishCategory.enumValues),
    tags: z.optional(z.string().array()),
    isAvailable: z.optional(z.boolean()),
    discountPercentage: z.optional(
      z
        .number()
        .min(0, { message: "DIscount percentage should atleast be 0" })
        .max(100, { message: "Discount margins cannot exceed 100%" })
    ),
    preparationTime: z.optional(z.number().int().min(0)),
  }),
});

const updateDishSchema = z.object({
  dish: z.object({
    id: z.string().uuid(),
    name: z.optional(
      z
        .string()
        .max(30, { message: "Dish name must be less than 30 characters" })
    ),
    description: z.optional(
      z
        .string()
        .max(100, { message: "Description must be less than 100 characters" })
    ),
    price: z.optional(z.number().min(1)),
    category: z.optional(z.enum(dishCategory.enumValues)),
    tags: z.optional(z.string().array()),
    isAvailable: z.optional(z.boolean()),
    discountPercentage: z.optional(
      z
        .number()
        .min(0, { message: "DIscount percentage should atleast be 0" })
        .max(100, { message: "Discount margins cannot exceed 100%" })
    ),
    preparationTime: z.optional(z.number().int().min(0)),
  }),
});

export const getAllMenuItems = async (req: Request, res: Response) => {
  const decoded = res.locals.decoded;
  const renewAccessToken = res.locals.renewAccessToken;
  const renewRefreshToken = res.locals.renewRefreshToken;
  const aud = decoded.aud;

  const slug = req.params.slug;

  const [dbFetchError, fetchResults] = await catchDrizzzzzleError(
    db
      .select({ dish })
      .from(restaurant)
      .innerJoin(dish, eq(dish.restaurantId, restaurant.id))
      .where(eq(restaurant.slug, slug))
  );

  const requestAbondoned = hasDrizzzzzleError(
    dbFetchError,
    fetchResults,
    res,
    null,
    null
  );

  if (!requestAbondoned) {
    return;
  }

  renewTokens(renewAccessToken, renewRefreshToken, res, decoded.id, aud);

  const menu = requestAbondoned.map((menuItem) => menuItem.dish);

  res.status(200).json({ menu });
  return;
};

export const getSingleMenuItem = async (req: Request, res: Response) => {
  const decoded = res.locals.decoded;
  const renewAccessToken = res.locals.renewAccessToken;
  const renewRefreshToken = res.locals.renewRefreshToken;
  const aud = decoded.aud;

  const dishId = req.params.dishId;

  const [fetchDishError, fetchedDish] = await catchDrizzzzzleError(
    db.select({ dish }).from(dish).where(eq(dish.id, dishId))
  );

  const requestAbondoned = hasDrizzzzzleError(
    fetchDishError,
    fetchedDish,
    res,
    null,
    null
  );

  if (!requestAbondoned) {
    return;
  }

  renewTokens(renewAccessToken, renewRefreshToken, res, decoded.id, aud);
  res.status(200).json({ dish: requestAbondoned[0] });
  return;
};

export const deleteMenuItem = async (req: Request, res: Response) => {
  const decoded = res.locals.decoded;
  const renewAccessToken = res.locals.renewAccessToken;
  const renewRefreshToken = res.locals.renewRefreshToken;
  const aud = decoded.aud;

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
    db.delete(dish).where(eq(dish.id, result.data.dishId)).returning()
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

  res.status(204);
};

export const addItemToMenu = async (req: Request, res: Response) => {
  const decoded = res.locals.decoded;
  const renewAccessToken = res.locals.renewAccessToken;
  const renewRefreshToken = res.locals.renewRefreshToken;

  const result = addDishSchema.safeParse(req.body);
  if (!result.success) {
    const formattedError = result.error.format()._errors.join(". ");
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

  const fileUploadError = await uploadImageToS3(
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
        category: result.data.dish.category,
        description: result.data.dish.description,
        imageUrl: getImageUrl(fileName, "qrbites-dish-image"),
        name: result.data.dish.name,
        price: result.data.dish.price,
        discountPercentage: result.data.dish.discountPercentage,
        isAvailable: result.data.dish.isAvailable
          ? result.data.dish.isAvailable
          : true,
        preparationTime: result.data.dish.preparationTime,
        restaurantId: requestAbondoned[0].restaurant.id,
        tags: result.data.dish.tags,
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

  renewTokens(renewAccessToken, renewRefreshToken, res, decoded.id, "business");

  const newDish = createClientDish(insertRequestAbondoned[0]);

  res.status(201).json({ dish: newDish });
};

export const updateMenuItem = async (req: Request, res: Response) => {
  const decoded = res.locals.decoded;
  const renewAccessToken = res.locals.renewAccessToken;
  const renewRefreshToken = res.locals.renewRefreshToken;

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

  const existingDish = result.data.dish;
  const [updateDishError, updatedDish] = await catchDrizzzzzleError(
    db
      .update(dish)
      .set({
        ...(existingDish.name && { name: existingDish.name }),
        ...(existingDish.description && {
          description: existingDish.description,
        }),
        ...(existingDish.price && { price: existingDish.price }),
        ...(existingDish.category && { category: existingDish.category }),
        ...(existingDish.tags && { tags: existingDish.tags }),
        ...(existingDish.isAvailable && {
          isAvailable: existingDish.isAvailable,
        }),
        ...(existingDish.discountPercentage && {
          discountPercentage: existingDish.discountPercentage,
        }),
        ...(existingDish.preparationTime && {
          preparationTime: existingDish.preparationTime,
        }),
      })
      .where(eq(dish.id, existingDish.id))
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
  if (!req.file) {
    res.status(201).json({ dish: updateRequestAbondoned[0] });
    return;
  }

  const baseUrl = "https://qrbites-dish-image.s3.ap-south-1.amazonaws.com/";
  const imageKey = updateRequestAbondoned[0].imageUrl.startsWith(baseUrl)
    ? updateRequestAbondoned[0].imageUrl.slice(baseUrl.length)
    : null;
  if (!imageKey) {
    res.status(400).send("Image not found");
    return;
  }
  const fileUploadResult = await uploadImageToS3(
    req.file,
    imageKey,
    "qrbites-dish-image"
  );

  if (fileUploadResult) {
    logger.error({}, fileUploadResult.message);
    res.status(500).send("Failed to update dish. Please try again later");
    return;
  }

  const clientDish = createClientDish(updateRequestAbondoned[0]);

  res.status(200).json({ dish: clientDish });
  return;
};
