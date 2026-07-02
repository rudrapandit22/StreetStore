import express from "express";
import { authenticateUser } from "../middlewares/auth.middle.js";
import { validateaddtocart } from "../validator/cart.validator.js";
import { addtocart, getcart, removefromcart, updatequantity } from "../controllers/cart.controller.js";

const router = express.Router();

router.post("/add/:productId/:variantId", authenticateUser, validateaddtocart, addtocart)

router.get('/', authenticateUser, getcart)

router.delete("/remove/:productId/:variantId", authenticateUser, removefromcart)

router.put("/update/:productId/:variantId", authenticateUser, updatequantity)

export default router;