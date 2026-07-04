import express from "express";
import { authenticateUser } from "../middlewares/auth.middle.js";
import { validateaddtocart } from "../validator/cart.validator.js";
import { addtocart, getcart, removefromcart, updatequantity, incrementquantity, decrementquantity } from "../controllers/cart.controller.js";

const router = express.Router();

router.post("/add/:productId/:variantId", authenticateUser, validateaddtocart, addtocart)

router.get('/', authenticateUser, getcart)

router.delete("/remove/:productId/:variantId", authenticateUser, removefromcart)

router.put("/update/:productId/:variantId", authenticateUser, updatequantity)

router.patch("/quantity/increment/:productId/:variantId", authenticateUser, incrementquantity)

router.patch("/quantity/decrement/:productId/:variantId", authenticateUser, decrementquantity)

export default router;