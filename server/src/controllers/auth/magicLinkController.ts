import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { createAccessToken } from "../../util/authTokens.js";
import { Resend } from "../../../node_modules/resend/dist/index.js";
import { emailTemplate } from "../../util/confirmationEmailTemplate.js";
import { randomBytes } from "crypto";
import jwt, { JwtPayload } from "jsonwebtoken";

const resend = new Resend(process.env.RESEND_API_KEY);

export const magicLinkSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {email} = req.body;
  if (!email) res.status(400);
  try {
    // Check if user exists

    // const verificationToken = createAccessToken(
    //   user.id,
    // );


    // const { data, error } = await resend.emails.send({
    //   from: "send.havvon",
    //   to: user.email,
    //   subject: "Confirm your resend account",
    //   html: emailTemplate(verificationToken, user.email),
    // });

    // if (error) throw new Error("Login Failed");

    // setTimeout(async () => {
    //   if (!user.providerId) {
    //     await User.findByIdAndDelete(user._id);
    //   }
    // }, 15 * 60 * 1000);

    res.status(202).json({
      message: "Email sent",
    });
  } catch (error) {
    const err = error as Error;
    if (error) res.status(500).json({ error: err.message });
  }
};

export const magicLinkSignupCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email = req.query.email;
  const token: string | undefined = req.query.token?.toString() || undefined; 

  // try {
  //   if (!token || !email) {
  //     res.status(400).end();
  //     return;
  //   }

  //   jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
  //     if (err) {
  //       res.status(403).json({ error: err.message });
  //       return;
  //     }
  //     if (decoded) {
  //       const { id } = decoded as { sub: string; id: string; eml: string };
  //       User.findByIdAndUpdate(id, { providerId: id }, { new: true })
  //         .then((updatedUser) => {
  //           res.status(201).json({ user: updatedUser });
  //           return;
  //         })
  //         .catch((error) => {
  //           res.status(403).json({ error: error });
  //         });
  //     }
  //   });
  // } catch (error) {
  //   const err = error as Error;
  //   res.status(500).json({ error: err.message });
  // }
};
