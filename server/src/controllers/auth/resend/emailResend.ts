import { Request, Response } from "express";
import { z } from "zod";
import { catchDrizzzzzleError, catchError } from "../../../util/catchError.js";
import { staff, users } from "../../../db/schema.js";
import { eq } from "drizzle-orm";
import { db } from "../../../config/db.js";
import { createJwtToken } from "../../../util/authTokens.js";
import { hasDrizzzzzleError } from "../../../util/checkError.js";
import { transport } from "../../../config/nodemailer.js";
import { emailTemplate, sendMail } from "../signup/magicLinkSignup.js";
import logger from "../../../config/logger.js";

const schema = z.object({
  email: z.string().email(),
});

export const clientEmailResend = async (req: Request, res: Response) => {
  const result = schema.safeParse(req.body);

  if (result.error) {
    const formattedErrors = result.error.errors
      .map((error) => error.message)
      .join(". ");
    res.status(400).json({ error: formattedErrors });
    return;
  }

  const [emailCheckError, existingUser] = await catchDrizzzzzleError(
    db.select().from(users).where(eq(users.email, result.data.email))
  );

  const requestAborted = hasDrizzzzzleError(
    emailCheckError,
    existingUser,
    res,
    null,
    null
  );

  if (!requestAborted) {
    return;
  }
  if (requestAborted[0].isVerified) {
    res.status(400).json({ error: "User is already verified" });
  }

  const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
  if (new Date(requestAborted[0].updatedAt) > oneMinuteAgo) {
    res.status(400).json({
      error: "Please wait for a minute before sending another request",
    });
    return;
  }

  const verificationToken = createJwtToken(
    requestAborted[0].id,
    "client",
    "access"
  );

  const [userUpdateError, updatedUser] = await catchDrizzzzzleError(
    db
      .update(users)
      .set({ emailVerificationToken: verificationToken })
      .where(eq(users.id, requestAborted[0].id))
      .returning()
  );

  const updateRequestAborted = hasDrizzzzzleError(
    userUpdateError,
    updatedUser,
    res,
    null,
    null
  );
  if (!updateRequestAborted) {
    return;
  }

  sendMail(
    result.data.email,
    emailTemplate(verificationToken, result.data.email, "client")
  );

  res.status(201).json({ message: "Email resent" });
};

export const businessEmailResend = async (req: Request, res: Response) => {
  const result = schema.safeParse(req.body);

  if (result.error) {
    const formattedErrors = result.error.errors
      .map((error) => error.message)
      .join(". ");
    res.status(400).json({ error: formattedErrors });
    return;
  }

  const [emailCheckError, existingUser] = await catchDrizzzzzleError(
    db.select().from(staff).where(eq(staff.email, result.data.email))
  );

  const requestAborted = hasDrizzzzzleError(
    emailCheckError,
    existingUser,
    res,
    null,
    null
  );

  if (!requestAborted) {
    return;
  }
  if (requestAborted[0].isVerified) {
    res.status(400).json({ error: "User is already verified" });
  }

  const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
  if (new Date(requestAborted[0].updatedAt) > oneMinuteAgo) {
    res.status(400).json({
      error: "Please wait for a minute before sending another request",
    });
    return;
  }

  const verificationToken = createJwtToken(
     requestAborted[0].id,
     "business",
     "access",
  );

  const [userUpdateError, updatedUser] = await catchDrizzzzzleError(
    db
      .update(staff)
      .set({ emailVerificationToken: verificationToken })
      .where(eq(staff.id, requestAborted[0].id))
      .returning()
  );

  const updateRequestAborted = hasDrizzzzzleError(
    userUpdateError,
    updatedUser,
    res,
    null,
    null
  );
  if (!updateRequestAborted) {
    return;
  }

  const [emailSendError, mailId] = await catchError(
    sendMail(
      result.data.email,
      emailTemplate(verificationToken, result.data.email, "business")
    )
  );

  if (emailSendError || !mailId) {
    res
      .status(500)
      .json(
        emailSendError
          ? emailSendError.message
          : "Server error. Couldn't send an email. Please try again"
      );
    return;
  }
  logger.info(`mail sent with id: ${mailId}`);

  res.status(201).json({ message: "Email resent" });
};
