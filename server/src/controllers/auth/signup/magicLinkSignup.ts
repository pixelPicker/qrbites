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
import { catchDrizzzzzleError, catchError } from "../../../util/catchError.js";
import logger from "../../../config/logger.js";
import { createClientStaff, createClientUser } from "../../../util/createClient.js";
import { transport } from "../../../config/nodemailer.js";

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

export const emailTemplate = (verificationToken: string, email: string, party: "client" | "business") => {
  return `
      <div style="width: 100%;background-color: mediumseagreen;color: black;padding: 50px 25px;display: flex; justify-content: center;">
        <div style="display: grid;place-items: center;gap: 10px;width: 100%;">
          <h1>Confirm your account with QRBites</h1>
          <p>Thank you for signing up for QRBites. To confirm your account, please follow the button below.</p>
          <a style="text-decoration: none;padding: 10px 6px;background-color: white;color: black; width: 100px;text-align: center;border-radius: 10px;" href="http://localhost:5173/auth/confirm-page?email=${email}&token=${verificationToken}" target="_blank" rel="noopener noreferrer">Confirm</a>
        </div>
      </div>
    `;
};

export const sendMail = async (email: string, content: string) => {
  const mail = await transport.sendMail({
    from: process.env.DEV_MAIL_ADDRESS,
    to: email,
    subject: "QRBites account verification",
    html: content,
  });
  return mail.messageId;
};

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

  const verificationToken = createJwtToken({
    id: userId,
    audience: "client",
    type: "access",
  });

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

  const [emailSendError, mailId] = await catchError(
    sendMail(
      result.data.email,
      emailTemplate(verificationToken, result.data.email, "client")
    )
  );

  if(emailSendError || !mailId) {
    res.status(500).json((emailSendError) ? emailSendError.message : "Server error. Couldn't send an email. Please try again");
    return;
  }
  logger.info(`mail sent with id: ${mailId}`);

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

  const accessToken = createJwtToken({
    id: user[0].id,
    audience: "client",
    type: "access",
  });
  const refreshToken = createJwtToken({
    id: user[0].id,
    audience: "client",
    type: "refresh",
  });

  res.cookie("access-token", accessToken, {
    expires: new Date(Date.now() + 15 * 60 * 1000),
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  res.cookie("refresh-token", refreshToken, {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  const clientUser = createClientUser({
    id: user[0].id,
    username: user[0].username,
    email: user[0].email,
    profilePic: user[0].profilePic,
  });

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

  const verificationToken = createJwtToken({
    id: staffId,
    audience: "business",
    type: "access",
  });

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

  const [emailSendError, mailId] = await catchError(
    sendMail(
      result.data.email,
      emailTemplate(verificationToken, result.data.email, "business")
    )
  );

  if(emailSendError || !mailId) {
    res.status(500).json((emailSendError) ? emailSendError.message : "Server error. Couldn't send an email. Please try again");
    return;
  }
  logger.info(`mail sent with id: ${mailId}`);

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
    res.status(500).json({ error: permissionFetchError.message });
    return;
  }

  if (allPermissions === undefined) {
    res.status(500).json({ error: "Process failed. Please try again later" });
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

  const [addPermissionsError, userPermissions] = await catchDrizzzzzleError(
    db.insert(staffPermissions).values(adminPermissions)
  );

  if (addPermissionsError) {
    res.status(500).json({ error: addPermissionsError.message });
    return;
  }

  const accessToken = createJwtToken({
    id: user[0].id,
    audience: "business",
    type: "access",
  });
  const refreshToken = createJwtToken({
    id: user[0].id,
    audience: "business",
    type: "refresh",
  });
  res.cookie("access-token", accessToken, {
    expires: new Date(Date.now() + 15 * 60 * 1000),
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  res.cookie("refresh-token", refreshToken, {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  const clientStaff = createClientStaff({
    id: user[0].id,
    username: user[0].username,
    email: user[0].email,
    profilePic: user[0].profilePic,
    alias: user[0].alias,
    role: user[0].role,
  });

  res.status(202).json({ user: clientStaff });
  return;
};
