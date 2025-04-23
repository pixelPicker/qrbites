import jwt from "jsonwebtoken";
import express, { Request, Response } from "express";
import passport from "passport";
import {
  createAccessToken,
  createRefreshToken,
} from "../../util/authTokens.js";

const router = express.Router();

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// router.get("/auth/google/callback", (req, res, next) => {
//   passport.authenticate(
//     "google",
//     { session: false },
//     (
//       err: Error | null,
//       user: HydratedDocument<User> | false,
//       info: string | object
//     ) => {
//       if (err) return next(err);
//       if (!user)
//         return res.status(401).json({ message: "Authentication failed" });

//       const verifyToken = jwt.sign(
//         { id: user._id, pid: user.providerId, provider: user.provider },
//         process.env.JWT_SECRET!,
//         { expiresIn: "15m" }
//       );

//       return res.redirect(`havvon://auth/google/callback?token=${verifyToken}`);
//     }
//   )(req, res, next);
// });



export default router;
