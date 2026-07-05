import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import usermodel from "../models/user.model.js";
import { config } from "./config.js";

passport.use(
    new GoogleStrategy(
        {
            clientID: config.GOOGLE_CLIENT_ID,
            clientSecret: config.GOOGLE_CLIENT_SECRET,
            callbackURL: "https://streetstore.onrender.com/api/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user already exists
                let user = await usermodel.findOne({ email: profile.emails[0].value });

                if (!user) {
                    // Create new user from Google profile
                    user = await usermodel.create({
                        fullname: profile.displayName,
                        email: profile.emails[0].value,
                        contact: "0000000000", // placeholder — Google doesn't provide phone
                        password: "google-oauth-" + profile.id, // placeholder password
                        role: "buyer",
                    });
                }

                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

export default passport;
