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
  .post("/client/auth/signin/magic-link", clientMagicLinkSignin)
  .post("/client/auth/signin/magic-link/callback", verifyMagicToken, clientMagicLinkSignupCallback)

  .post("/client/auth/signup/magic-link", clientMagicLinkSignup)
  .post("/client/auth/signup/magic-link/callback", verifyMagicToken, clientMagicLinkSignupCallback)
  
  .post("client/auth/resend-email", clientEmailResend)
  
  .post("/business/auth/signin/magic-link", businessMagicLinkSignin)
  .post("/business/auth/signin/magic-link/callback", verifyMagicToken, businessMagicLinkSignupCallback)

  .post("/business/auth/signup/magic-link", businessMagicLinkSignup)
  .post("/business/auth/signup/magic-link/callback", verifyMagicToken, businessMagicLinkSignupCallback)
  
  .post("business/auth/resend-email", businessEmailResend)

export default router;
