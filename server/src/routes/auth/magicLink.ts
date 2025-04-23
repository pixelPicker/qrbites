import express from 'express';
import { magicLinkSignup, magicLinkSignupCallback } from '../../controllers/auth/magicLinkController.js';

const router = express.Router();

router.post("/auth/magic-link", magicLinkSignup)
router.post("/auth/magic-link/callback", magicLinkSignupCallback)

export default router;
 