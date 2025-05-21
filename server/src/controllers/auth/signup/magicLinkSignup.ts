import { and, sql } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { Request, Response, RequestHandler } from "express";
import { v4 as uuidv4 } from "uuid";
import { createJwtToken } from "../../../util/authTokens.js";
import { db } from "../../../config/db.js";
import {
  permissions,
  staff,
  staffPermissions,
  users,
} from "../../../db/schema.js";
import { catchDrizzzzzleError } from "../../../util/catchError.js";
import logger from "../../../config/logger.js";
import {
  createClientStaff,
  createClientUser,
} from "../../../util/createClient.js";
import { transport } from "../../../config/nodemailer.js";
import { setAuthCookies } from "../../../util/setResponseCookies.js";
import { addEmailToQueue } from "../../../queue/email/email.queue.js";

interface staffPermissionObj {
  permission: string;
  staffId: string;
  isGranted: boolean;
}

const schema = z.object({
  username: z
    .string()
    .min(3, "Username cannot have less than 3 characters")
    .max(30, "Username cannot have more than 30 characters"),
  email: z.string().email("The email format is invalid"),
});

export const clientMagicLinkSignup: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const formattedError = result.error.errors
      .map((zodIssue) => zodIssue.message)
      .join(". ");
    res.status(401).json({
      error: formattedError,
    });
    return;
  }

  const isExistingEmail = await db
    .select()
    .from(users)
    .where(and(eq(users.email, result.data.email)));

  if (isExistingEmail.length > 1) {
    logger.fatal("Duplicate emails exists ");
    res.status(401).json({
      error: "Email already exists. Please try again later",
    });
    return;
  }

  if (isExistingEmail[0]) {
    if (isExistingEmail[0].isVerified === true) {
      res.status(401).json({
        error: "Email already exists. Please try again later",
      });
      return;
    }

    if (
      new Date(isExistingEmail[0].updatedAt) >=
      new Date(Date.now() - 15 * 60 * 1000)
    ) {
      res.status(401).json({
        error: "Email is in process for verification.",
      });
      return;
    }
  }

  const userId = uuidv4();

  const verificationToken = createJwtToken(userId, "client", "access");

  const [postgresError, user] = await catchDrizzzzzleError(
    db
      .insert(users)
      .values({
        id: userId,
        username: result.data.username,
        email: result.data.email,
        provider: "magic_link",
        emailVerificationToken: verificationToken,
      })
      .onConflictDoUpdate({
        target: [users.email],
        set: {
          updatedAt: sql`CURRENT_TIMESTAMP`,
          emailVerificationToken: verificationToken,
        },
        setWhere: sql`${users.isVerified} = false`,
      })
      .returning()
  );

  if (postgresError) {
    res.status(500).json({ error: postgresError.message });
    return;
  }
  if (!user) {
    res.status(500).json({ error: "Internal server error" });
    return;
  }

  addEmailToQueue({
    email: user[0].email,
    party: "client",
    verificationToken: verificationToken,
  });

  res.status(202).json({
    message: "Email sent for verification",
  });
  return;
};

export const clientMagicLinkSignupCallback: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = res.locals.userId as string;

  const [findUserError, data] = await catchDrizzzzzleError(
    db.select().from(users).where(eq(users.id, userId))
  );
  if (findUserError) {
    res.status(500).json({ error: "Please try again later" });
    return;
  }
  if (data === undefined) {
    res.status(401).json({ error: "Data not found" });
  }

  const [updatedUserError, user] = await catchDrizzzzzleError(
    db
      .update(users)
      .set({
        emailVerificationToken: null,
        isVerified: true,
      })
      .where(eq(users.id, userId))
      .returning()
  );
  if (updatedUserError || user === undefined) {
    res.status(500).json({ error: "Please try again later" });
    return;
  }

  const accessToken = createJwtToken(user[0].id, "client", "access");
  const refreshToken = createJwtToken(user[0].id, "client", "refresh");

  setAuthCookies(accessToken, refreshToken, res);

  const clientUser = createClientUser(user[0]);

  res.status(202).json({ user: clientUser });
};

export const businessMagicLinkSignup = async (req: Request, res: Response) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const formattedError = result.error.errors
      .map((zodIssue) => zodIssue.message)
      .join(". ");
    res.status(401).json({
      error: formattedError,
    });
    return;
  }

  const isExistingEmail = await db
    .select()
    .from(staff)
    .where(and(eq(staff.email, result.data.email)));

  if (isExistingEmail.length > 1) {
    logger.fatal("Duplicate emails exists ");
    res.status(401).json({
      error: "Email already exists. Please try again later",
    });
    return;
  }

  if (isExistingEmail[0]) {
    if (
      isExistingEmail[0].isVerified === true ||
      isExistingEmail[0].role !== "admin"
    ) {
      res.status(401).json({
        error: "Email already exists. Please Signin",
      });
      return;
    }

    if (
      new Date(isExistingEmail[0].updatedAt) >=
      new Date(Date.now() - 15 * 60 * 1000)
    ) {
      res.status(401).json({
        error: "Account is in process for verification.",
      });
      return;
    }
  }

  const staffId = uuidv4();

  const verificationToken = createJwtToken(staffId, "business", "access");

  const [postgresError, user] = await catchDrizzzzzleError(
    db
      .insert(staff)
      .values({
        id: staffId,
        username: result.data.username,
        email: result.data.email,
        provider: "magic_link",
        role: "admin",
        emailVerificationToken: verificationToken,
      })
      .onConflictDoUpdate({
        target: [staff.email],
        set: {
          updatedAt: sql`CURRENT_TIMESTAMP`,
          emailVerificationToken: verificationToken,
        },
        setWhere: sql`${staff.isVerified} = false`,
      })
      .returning()
  );

  if (postgresError) {
    res.status(500).json({ error: postgresError.message });
    return;
  }
  if (!user) {
    res.status(500).json({ error: "Internal server error" });
    return;
  }

  addEmailToQueue({
    email: user[0].email,
    party: "business",
    verificationToken: verificationToken,
  });

  res.status(202).json({
    message: "Email sent for verification",
  });
  return;
};

export const businessMagicLinkSignupCallback: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const staffId = res.locals.userId as string;

  const [findUserError, data] = await catchDrizzzzzleError(
    db.select().from(staff).where(eq(staff.id, staffId))
  );
  if (findUserError) {
    res.status(500).json({ error: "Please try again later" });
    return;
  }
  if (data === undefined) {
    res.status(401).json({ error: "Data not found" });
  }

  const [updatedUserError, user] = await catchDrizzzzzleError(
    db
      .update(staff)
      .set({
        emailVerificationToken: null,
        isVerified: true,
      })
      .where(eq(staff.id, staffId))
      .returning()
  );

  if (updatedUserError || user === undefined) {
    res.status(500).json({ error: "Please try again later" });
    return;
  }

  if (user[0].role !== "admin") {
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
      staffId: staffId,
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

  const accessToken = createJwtToken(user[0].id, "business", "access");
  const refreshToken = createJwtToken(user[0].id, "business", "refresh");

  setAuthCookies(accessToken, refreshToken, res);

  const clientStaff = createClientStaff(
    user[0]
  );

  res.status(202).json({ user: clientStaff });
  return;
};
