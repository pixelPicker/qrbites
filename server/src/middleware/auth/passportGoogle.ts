import { and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import "dotenv/config";
import { catchDrizzzzzleError } from "../../util/catchError.js";
import { db } from "../../config/db.js";
import { staff, users } from "../../db/schema.js";

export type GoogleAuthInfo = {
  redirectToLogin: "login" | "signup" | null;
};

passport.use(
  "client-strategy",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:3000/client/auth/callback/google",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      if (profile.emails === undefined) {
        const err = Error("Required field email not found in profile");
        done(err, false);
        return;
      }
      const [findUserError, existingUser] = await catchDrizzzzzleError(
        db.select().from(users).where(eq(users.email, profile.emails[0].value))
      );

      if (findUserError) {
        done(findUserError, false);
      }
      if (existingUser === undefined || existingUser.length === 0) {
        const userId = uuidv4();
        const [insertUserError, insertedUser] = await catchDrizzzzzleError(
          db
            .insert(users)
            .values({
              id: userId,
              email: profile.emails[0].value,
              provider: "google",
              username: profile.displayName,
              profilePic: profile.photos?.[0].value,
              providerId: profile.id,
              isVerified: true,
            })
            .returning()
        );
        if (insertUserError || insertedUser === undefined) {
          const err = Error(
            insertUserError
              ? insertUserError.message
              : "Internal server error. Something weent wrong."
          );
          done(err, false);
          return;
        }
        done(null, insertedUser[0]);
      } else {
        const [updateUserError, updatedUser] = await catchDrizzzzzleError(
          db
            .update(users)
            .set({
              isVerified: true,
            })
            .where(eq(users.id, existingUser[0].id))
            .returning()
        );
        if (updateUserError || updatedUser === undefined) {
          const err = Error(
            updateUserError
              ? updateUserError.message
              : "Internal server error. Something weent wrong."
          );
          done(err, false);
          return;
        }
        done(null, updatedUser[0]);
      }
    }
  )
);

passport.use(
  "business-strategy",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_BUSINESS_ID!,
      clientSecret: process.env.GOOGLE_BUSINESS_SECRET!,
      callbackURL: "http://localhost:3000/business/auth/callback/google",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      if (profile.emails === undefined) {
        const err = Error("Required field email not found in profile");
        done(err, false);
        return;
      }

      const [findUserError, existingUser] = await catchDrizzzzzleError(
        db
          .select()
          .from(staff)
          .where(
            and(
              eq(staff.email, profile.emails[0].value),
              eq(staff.role, "admin")
            )
          )
      );

      if (findUserError) {
        done(findUserError, false);
      }
      if (existingUser === undefined || existingUser.length === 0) {
        const userId = uuidv4();
        const [insertUserError, insertedUser] = await catchDrizzzzzleError(
          db
            .insert(staff)
            .values({
              id: userId,
              role: "admin",
              email: profile.emails[0].value,
              provider: "google",
              username: profile.displayName,
              profilePic: profile.photos?.[0].value,
              providerId: profile.id,
              isVerified: true,
            })
            .returning()
        );
        if (insertUserError || insertedUser === undefined) {
          const err = Error(
            insertUserError
              ? insertUserError.message
              : "Internal server error. Something weent wrong."
          );
          done(err, false);
          return;
        }

        done(null, insertedUser[0]);
      } else {
        const [updateUserError, updatedUser] = await catchDrizzzzzleError(
          db
            .update(staff)
            .set({
              isVerified: true,
            })
            .where(eq(staff.id, existingUser[0].id))
            .returning()
        );
        if (updateUserError || updatedUser === undefined) {
          const err = Error(
            updateUserError
              ? updateUserError.message
              : "Internal server error. Something weent wrong."
          );
          done(err, false);
          return;
        }
        done(null, updatedUser[0]);
      }
    }
  )
);

export const clientGoogleAuthMiddleware = passport.authenticate("client-strategy", {
  session: false,
});

export const businessGoogleAuthMiddleware = passport.authenticate("business-strategy", {
  session: false,
});
