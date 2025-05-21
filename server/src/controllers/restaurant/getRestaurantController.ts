import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { catchDrizzzzzleError } from "../../util/catchError.js";
import { db } from "../../config/db.js";
import { restaurant, restaurantStaff } from "../../db/schema.js";
import { eq } from "drizzle-orm";
import { hasDrizzzzzleError } from "../../util/checkError.js";
import { createClientRestaurant } from "../../util/createClient.js";

export const getRestaurant = async (req: Request, res: Response) => {
  const decoded = res.locals.decoded as JwtPayload;
  const renewAccessToken = res.locals.renewAccessToken as boolean;
  const renewRefreshToken = res.locals.renewRefreshToken as boolean;

  if (decoded.aud !== "business" || !decoded.id) {
    res.status(400).send("Invalid token");
    return;
  }

  const [fetchRestaurantError, userRestaurant] = await catchDrizzzzzleError(
    db
      .select()
      .from(restaurantStaff)
      .innerJoin(
        restaurant,
        eq(restaurant.id, restaurantStaff.restaurantId)
      )
      .where(eq(restaurantStaff.staffId, decoded.id))
  );

  const restaurantRequest = hasDrizzzzzleError(
    fetchRestaurantError,
    userRestaurant,
    res,
    null,
    null
  );

  if(!restaurantRequest) {
    return;
  }

  const clientRestaurant = createClientRestaurant(
    restaurantRequest[0].restaurant)

  res.status(200).json({restaurant: clientRestaurant});
};
