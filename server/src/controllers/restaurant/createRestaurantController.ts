import { Request, Response } from "express";
import { z } from "zod";
import { renewTokens } from "../../util/renewTokens.js";
import { catchDrizzzzzleError } from "../../util/catchError.js";
import { db } from "../../config/db.js";
import { restaurant, restaurantStaff, staff } from "../../db/schema.js";
import { eq } from "drizzle-orm";
import { hasDrizzzzzleError } from "../../util/checkError.js";
import { v4 as uuidv4 } from "uuid";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import path from "path";
import { createClientRestaurant } from "../../util/createClient.js";
import { getImageUrl, uploadImageToS3 } from "../../lib/s3/upload.js";
import { deleteRestaurantLogo } from "../../lib/s3/delete.js";
import logger from "../../config/logger.js";

const schema = z.object({
  name: z
    .string()
    .max(100, { message: "Restaurant name must be below 100 characters" }),
  email: z.string().email({ message: "Invalid email" }),
  phoneNumber: z
    .string()
    .min(13, { message: "Invalid phoneNumber length" })
    .max(14, { message: "Invalid phoneNumber length" })
    .startsWith("+", { message: "Invalid phoneNumber" }),
  openingTime: z.optional(z.string().time({ message: "Invalid time format" })),
  closingTime: z.optional(z.string().time({ message: "Invalid time format" })),
});

export const createRestaurant = async (req: Request, res: Response) => {
  const decoded = res.locals.decoded;
  const renewAccessToken = res.locals.renewAccessToken as boolean;
  const renewRefreshToken = res.locals.renewRefreshToken as boolean;
  const aud = decoded.aud;

  if (aud !== "business") {
    res.status(401).send("Invalid request.");
    return;
  }

  const result = schema.safeParse(req.body);
  if (!result.success) {
    const formattedError = result.error.errors
      .map((zodIssue) => zodIssue.message)
      .join(". ");
    res.status(401).send(formattedError);
    return;
  }
  const upload = req.file;

  const [fetchUserError, fetchedUser] = await catchDrizzzzzleError(
    db.select().from(staff).where(eq(decoded.id, staff.id))
  );
  const updateRequestAborted = hasDrizzzzzleError(
    fetchUserError,
    fetchedUser,
    res,
    null,
    null
  );
  if (!updateRequestAborted) {
    return;
  }

  const admin = updateRequestAborted[0];
  if (admin.role !== "admin") {
    res.status(401).send("You don't have appropriate permissions for that.");
    return;
  }

  const filename = upload
    ? uuidv4() + path.extname(upload.originalname)
    : undefined;

  if (upload && filename) {
    const fileUploadError = await uploadImageToS3(
      upload,
      filename,
      "qrbites-restaurant-logo"
    );
    if (fileUploadError) {
      logger.error({}, fileUploadError.message);
      res.status(500).send("Failed to upload dish. Please try again later");
      return;
    }
  }

  const restaurantId = uuidv4();
  const restaurantSlug = result.data.name.replace(" ", "-") + restaurantId;

  const [restaurantCreationError, newRestaurant] = await catchDrizzzzzleError(
    db
      .insert(restaurant)
      .values({
        email: result.data.email,
        id: restaurantId,
        name: result.data.name,
        slug: restaurantSlug,
        phoneNumber: result.data.phoneNumber,
        closingTime: result.data.closingTime,
        openingTime: result.data.openingTime,
        logoUrl: filename
          ? getImageUrl(filename, "qrbites-restaurant-logo")
          : undefined,
      })
      .returning()
  );

  const checkRestaurant = hasDrizzzzzleError(
    restaurantCreationError,
    newRestaurant,
    res,
    null,
    null
  );

  if (!checkRestaurant) {
    if (filename) {
      await deleteRestaurantLogo(filename);
    }
    return;
  }

  const [staffInsertionError, newStaff] = await catchDrizzzzzleError(
    db
      .insert(restaurantStaff)
      .values({
        staffRole: "admin",
        restaurantId: checkRestaurant[0].id,
        staffId: decoded.id,
      })
      .returning()
  );

  const newStaffRequestError = hasDrizzzzzleError(
    staffInsertionError,
    newStaff,
    res,
    null,
    null
  );

  if (!newStaffRequestError) {
    if (filename) {
      await deleteRestaurantLogo(filename);
    }
    return;
  }

  const clientRestaurant = createClientRestaurant(checkRestaurant[0]);

  renewTokens(
    renewAccessToken,
    renewRefreshToken,
    res,
    updateRequestAborted[0].id,
    aud
  );

  res.status(201).json({ restaurant: clientRestaurant });
  return;
};
