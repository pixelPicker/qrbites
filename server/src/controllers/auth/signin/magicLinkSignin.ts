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
    });

  res.status(201).json({ message: "Verification email has been sent" });
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
  });

  res.status(201).json({ message: "Verification email has been sent" });
};
