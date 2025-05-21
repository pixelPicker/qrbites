import { Request, Response } from "express";
import { createJwtToken } from "../../../util/authTokens.js";
import { setAuthCookies } from "../../../util/setResponseCookies.js";
import { db } from "../../../config/db.js";
import { permissions, staffPermissions } from "../../../db/schema.js";
import { catchDrizzzzzleError } from "../../../util/catchError.js";

interface staffPermissionObj {
  permission: string;
  staffId: string;
  isGranted: boolean;
}

export const clientGoogleSignin = async (req: Request, res: Response) => {
  const user = req.user as User;
  if (!user) {
    res.status(401).json({ error: "Authentication failed. Please try again" });
    return;
  }
  const accessToken = createJwtToken(user.id, "client", "access");
  const refreshToken = createJwtToken(user.id, "client", "refresh");
  setAuthCookies(accessToken, refreshToken, res);

  const clientRedirectUrl = new URL("http://localhost:5173");

  res.redirect(clientRedirectUrl.toString());
  return;
};

export const businessGoogleSignin = async (req: Request, res: Response) => {
  const staff = req.user as Staff;
  if (!staff) {
    res.status(401).json({ error: "Authentication failed. Please try again" });
    return;
  }

  if (staff.role !== "admin") {
    res.status(401).json({ error: "Only admins can use the signup portal" });
    return;
  }

  const [permissionFetchError, allPermissions] = await catchDrizzzzzleError(
    db.select({ name: permissions.name }).from(permissions)
  );

  if (permissionFetchError) {
    res.status(500).send(permissionFetchError.message);
    return;
  }

  if (allPermissions === undefined) {
    res.status(500).send("Process failed. Please try again later");
    return;
  }

  const adminPermissions: staffPermissionObj[] = [];

  for (let i = 0; i < allPermissions.length; i++) {
    adminPermissions.push({
      permission: allPermissions[i].name,
      staffId: staff.id,
      isGranted: true,
    });
  }

  const [addPermissionsError] = await catchDrizzzzzleError(
    db.insert(staffPermissions).values(adminPermissions)
  );

  if (addPermissionsError) {
    res.status(500).send(addPermissionsError.message);
    return;
  }

  const accessToken = createJwtToken(staff.id, "business", "access");
  const refreshToken = createJwtToken(staff.id, "business", "refresh");

  setAuthCookies(accessToken, refreshToken, res);

  const businessRedirectUrl = new URL(
    "http://localhost:5173/restaurant/create"
  );

  res.status(202).redirect(businessRedirectUrl.toString());
  return;
};
