import productmodel from "../models/product.model.js";
import { getAuthParams } from "../services/storage.service.js";
import { config } from "../config/config.js";

// Returns a signed auth token + public key for the frontend ImageKit SDK
export function imagekitAuth(req, res) {
    try {
        const authParams = getAuthParams();
        res.status(200).json({
            success: true,
            ...authParams,
            publicKey: config.IMAGEKIT_PUBLIC_KEY,
            urlEndpoint: config.IMAGEKIT_URL_ENDPOINT,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// createproduct now receives imageUrls as a JSON array (uploaded directly to ImageKit from the browser)
export async function createproduct(req, res) {
    try {
        const { title, description, priceAmount, priceCurrency, imageUrls } = req.body;
        const seller = req.user;

        // Validate priceAmount
        const parsedPrice = Number(priceAmount);
        if (!priceAmount || isNaN(parsedPrice)) {
            return res.status(400).json({
                success: false,
                message: "Invalid or missing priceAmount. Please send a valid number."
            });
        }

        // Parse imageUrls — could be a JSON string or already an array
        let urls = imageUrls;
        if (typeof urls === "string") {
            try { urls = JSON.parse(urls); } catch { urls = []; }
        }
        if (!Array.isArray(urls) || urls.length === 0) {
            return res.status(400).json({ success: false, message: "At least one image is required." });
        }

        const images = urls.map((url) => ({ url }));

        const product = await productmodel.create({
            title,
            description,
            price: {
                amount: parsedPrice,
                currency: priceCurrency || "INR"
            },
            images,
            seller: seller._id
        });

        res.status(201).json({
            message: "Product created successfully",
            success: true,
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export async function getsellerproduct(req, res) {
    try {
        const seller = req.user;
        const products = await productmodel.find({ seller: seller._id });

        res.status(200).json({
            message: "Product fetched successfully",
            success: true,
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}