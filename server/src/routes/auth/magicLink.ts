import express from "express";
import {
  clientMagicLinkSignup,
  clientMagicLinkSignupCallback,
  businessMagicLinkSignup,
  businessMagicLinkSignupCallback,
} from "../../controllers/auth/signup/magicLinkSignup.js";
import { verifyMagicToken } from "../../middleware/auth/verifyMagicToken.js";
import { businessEmailResend, clientEmailResend } from "../../controllers/auth/resend/emailResend.js";
import { businessMagicLinkSignin, clientMagicLinkSignin } from "../../controllers/auth/signin/magicLinkSignin.js";

const router = express.Router();

router
  .post("/client/signin/magic-link", clientMagicLinkSignin)
  .get("/client/signin/magic-link/callback", verifyMagicToken, clientMagicLinkSignupCallback)

  .post("/client/signup/magic-link", clientMagicLinkSignup)
  .get("/client/signup/magic-link/callback", verifyMagicToken, clientMagicLinkSignupCallback)
  
  .get("client/auth/resend-email", clientEmailResend)
  
  .post("/business/signin/magic-link", businessMagicLinkSignin)
  .get("/business/signin/magic-link/callback", verifyMagicToken, businessMagicLinkSignupCallback)

  .post("/business/signup/magic-link", businessMagicLinkSignup)
  .get("/business/signup/magic-link/callback", verifyMagicToken, businessMagicLinkSignupCallback)
  
  .get("business/auth/resend-email", businessEmailResend)

export default router;
