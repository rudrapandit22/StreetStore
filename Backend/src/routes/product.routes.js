import express from "express";
import { authenticateSeller } from "../middlewares/auth.middle.js";
import { createproduct, getallproducts, getsellerproduct, imagekitAuth, getproductbyid, addVariant, updateVariantStock, deleteproduct } from "../controllers/product.controller.js";
import { upload } from "../middlewares/upload.middle.js";

const router = express.Router();

// Returns ImageKit signed auth params so the frontend can upload directly
router.get("/imagekit-auth", authenticateSeller, imagekitAuth);

// Create product — receives JSON body with imageUrls[] already uploaded to ImageKit
router.post("/", authenticateSeller, createproduct);

router.get("/seller", authenticateSeller, getsellerproduct);

router.get("/", getallproducts)

router.get("/:productId", getproductbyid)

router.delete("/:productId", authenticateSeller, deleteproduct)

router.post("/:productId/variants", authenticateSeller, upload.array("image", 7), addVariant);
router.put("/:productId/variants/stock", authenticateSeller, updateVariantStock);

export default router;