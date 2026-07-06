import { Router } from "express";
import { validateRegisterUser, validateloginuser } from "../validator/auth.validator.js";
import { register, login, googlecallback, getMe, logout } from "../controllers/auth.controller.js";
import passport from "passport";
import { config } from "../config/config.js";
import { authenticateUser } from "../middlewares/auth.middle.js";

const router = Router();
 
router.post("/register",validateRegisterUser,register)

router.post("/login", validateloginuser, login)

router.post("/logout", logout)

router.get("/google",
    passport.authenticate("google",{scope:["profile","email"]}))

router.get("/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "https://streetstorefrontend.vercel.app/login" }),
    googlecallback
)

router.get("/me", authenticateUser, getMe)



export default router;

