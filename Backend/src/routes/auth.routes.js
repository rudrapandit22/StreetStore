import { Router } from "express";
import { validateRegisterUser } from "../validator/auth.validator.js";
import { register, login } from "../controllers/auth.controller.js";


const router = Router();
 
router.post("/register",validateRegisterUser,register)

router.post("/login",validateRegisterUser, login)


export default router;

