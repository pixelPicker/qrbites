// import express, { Request, Response } from "express";
// import { authenticateRefreshToken } from "../../middleware/authenticateRefreshToken.js";
// import { authenticateAccessToken } from "../../middleware/authenticateAccessToken.js";
// import { createJwtToken } from "../../util/authTokens.js";
// import { createClientUser } from "../../util/createClient.js";

// const router = express.Router();

// router.get(
//   "/auth/verify",
//   authenticateAccessToken,
//   authenticateRefreshToken,
//   async (req: Request, res: Response) => {
//     const userId = res.locals.userId;

//     const user: HydratedDocument<User> | null = await User.findById(userId);

//     if (!user) {
//       res.status(401).json({ message: "Invalid token. Cannot get user" });
//       return;
//     }

//     if (res.locals.renewAccessToken === true) {
//       const accessToken = createJwtToken({id: });
//       res.cookie("access-token", accessToken, {
//         httpOnly: true,
//         sameSite: "strict",
//         maxAge: 15 * 60 * 1000,
//         secure: process.env.NODE_ENV === "production",
//       });
//     }

//     if (res.locals.renewRefreshToken === true) {
//       const accessToken = createRefreshToken(user.id);
//       res.cookie("access-token", accessToken, {
//         httpOnly: true,
//         sameSite: "strict",
//         maxAge: 90 * 24 * 60 * 60 * 1000,
//         secure: process.env.NODE_ENV === "production",
//       });
//     }

//     const clientUser = createClientUser(user);
//     res.status(200).json({ user: clientUser });
//     return;
//   }
// );

// export default router;
