import { Request, Response } from "express";
import { z } from "zod";
import { catchDrizzzzzleError, catchError } from "../../../util/catchError.js";
import { staff, users } from "../../../db/schema.js";
import { eq } from "drizzle-orm";
import { db } from "../../../config/db.js";
import { hasDrizzzzzleError } from "../../../util/checkError.js";
import { createJwtToken } from "../../../util/authTokens.js";
import logger from "../../../config/logger.js";
import { addEmailToQueue } from "../../../queue/email/email.queue.js";
import { setAuthCookies } from "../../../util/setResponseCookies.js";
import { createClientStaff, createClientUser } from "../../../util/createClient.js";

const schema = z.object({
  email: z.string().email(),
});

export const clientMagicLinkSignin = async (req: Request, res: Response) => {
  const result = schema.safeParse(req.body);

  if (result.error) {
    const formattedError = result.error.errors
      .map((zodError) => zodError.message)
      .join(". ");
    res.status(400).json({ error: formattedError });
    return;
  }

  const [userExistsError, userExistsResult] = await catchDrizzzzzleError(
    db.select().from(users).where(eq(users.email, result.data.email))
  );

  const existingUser = hasDrizzzzzleError(
    userExistsError,
    userExistsResult,
    res,
    "User doesn't exists. Please proceed with signup first",
    null,
  );

  if (!existingUser) {
    return;
  }

  if (!existingUser[0].isVerified) {
    res
      .status(401)
      .json({ error: "User doesn't exists. Please proceed with signup first" });
    return;
  }
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
  if (new Date(existingUser[0].updatedAt) > fifteenMinutesAgo) {
    res.status(400).json({
      error: "Email verification is in process. Cannot send another request",
    });
  }

  const verificationToken = createJwtToken(
  existingUser[0].id,
  "client",
  "access",
  );

  const [userUpdateError, user] = await catchDrizzzzzleError(
    db
      .update(users)
      .set({ emailVerificationToken: verificationToken })
      .where(eq(users.id, existingUser[0].id))
      .returning()
  );

  const updatedUserResult = hasDrizzzzzleError(
    userUpdateError,
    user,
    res,
    null,
    null
  );
  if (!updatedUserResult) {
    return;
  }

  addEmailToQueue({
      email: updatedUserResult[0].email,
      party: "client",
      verificationToken: verificationToken,
      type: "signin"
    });

  res.status(201).json({ message: "Verification email has been sent" });
};


export const clientMagicLinkSigninCallback = async (
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

export const businessMagicLinkSignin = async (req: Request, res: Response) => {
  const result = schema.safeParse(req.body);

  if (result.error) {
    const formattedError = result.error.errors
      .map((zodError) => zodError.message)
      .join(". ");
    res.status(400).json({ error: formattedError });
    return;
  }

  const [userExistsError, userExistsResult] = await catchDrizzzzzleError(
    db.select().from(staff).where(eq(staff.email, result.data.email))
  );

  const existingUser = hasDrizzzzzleError(
    userExistsError,
    userExistsResult,
    res,
    "User doesn't exists. Please proceed with signup first",
    null,
  );

  if (!existingUser) {
    return;
  }

  if (!existingUser[0].isVerified) {
    res
      .status(401)
      .json({ error: "User doesn't exists. Please proceed with signup first" });
    return;
  }
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
  if (new Date(existingUser[0].updatedAt) > fifteenMinutesAgo) {
    res.status(400).json({
      error: "Email verification is in process. Cannot send another request",
    });
  }

  const verificationToken = createJwtToken(
  existingUser[0].id,
  "business",
  "access",
  );

  const [userUpdateError, user] = await catchDrizzzzzleError(
    db
      .update(staff)
      .set({ emailVerificationToken: verificationToken })
      .where(eq(staff.id, existingUser[0].id))
      .returning()
  );

  const updatedUserResult = hasDrizzzzzleError(
    userUpdateError,
    user,
    res,
    null,
    null
  );
  if (!updatedUserResult) {
    return;
  }

  addEmailToQueue({
    email: updatedUserResult[0].email,
    party: "business",
    verificationToken: verificationToken,
    type: "signin"
  });

  res.status(201).json({ message: "Verification email has been sent" });
};

export const businessMagicLinkSigninCallback = async (
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

  const accessToken = createJwtToken(user[0].id, "business", "access");
  const refreshToken = createJwtToken(user[0].id, "business", "refresh");

  setAuthCookies(accessToken, refreshToken, res);

  const clientStaff = createClientStaff(user[0]);

  res.status(202).json({ user: clientStaff });
  return;
};
