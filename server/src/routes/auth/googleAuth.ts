import express from "express";
import passport from "passport";
import { businessGoogleAuthMiddleware, clientGoogleAuthMiddleware } from "../../middleware/auth/passportGoogle.js";
import { businessGoogleSignin, clientGoogleSignin } from "../../controllers/auth/signup/googleAuthController.js";

const router = express.Router();

router
  .post(
    "/client/auth/google",
    passport.authenticate("client-strategy", {
      scope: ["profile", "email"],
    })
  )
  .post(
    "/business/auth/google",
    passport.authenticate("business-strategy", {
      scope: ["profile", "email"],
    })
  )
  .get(
    "/client/auth/callback/google",
    clientGoogleAuthMiddleware,
    clientGoogleSignin,
  )
  .get(
    "/business/auth/callback/google",
    businessGoogleAuthMiddleware,
    businessGoogleSignin,
  );

export default router;
