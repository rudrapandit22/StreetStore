import productmodel from "../models/product.model.js";
import { getAuthParams, uploadfile } from "../services/storage.service.js";
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
        const { title, description, priceAmount, priceCurrency, priceMrp, imageUrls, variants } = req.body;
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

        let parsedVariants = [];
        if (variants) {
            try {
                parsedVariants = typeof variants === "string" ? JSON.parse(variants) : variants;
            } catch {
                parsedVariants = [];
            }
        }

        const product = await productmodel.create({
            title,
            description,
            price: {
                amount: parsedPrice,
                currency: priceCurrency || "INR",
                mrp: priceMrp ? Number(priceMrp) : undefined
            },
            images,
            variants: parsedVariants,
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

export async function getallproducts(req,res){
    const products =await productmodel.find()

    return res.status(200).json({
        message:"products fetched successfully",
        success:true,
        products
    })
}

export async function getproductbyid(req, res) {
    try {
        const { productId } = req.params;
        const product = await productmodel.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({
            message: "Product fetched successfully",
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

export async function addVariant(req, res) {
    try {
        const { productId } = req.params;
        const { stock, price, currency, attributes, mrp } = req.body;

        const product = await productmodel.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        let parsedAttributes = {};
        if (attributes) {
            try {
                parsedAttributes = typeof attributes === 'string' ? JSON.parse(attributes) : attributes;
            } catch (err) {
                parsedAttributes = {};
            }
        }

        let variantPrice = undefined;
        if (price) {
            variantPrice = {
                amount: Number(price),
                currency: currency || product.price.currency || "INR",
                mrp: mrp ? Number(mrp) : undefined
            };
        } else {
            variantPrice = {
                amount: product.price.amount,
                currency: product.price.currency || "INR",
                mrp: mrp ? Number(mrp) : product.price.mrp
            };
        }

        const imageUrls = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const uploadResult = await uploadfile({
                    buffer: file.buffer,
                    fileName: `snitch_var_${Date.now()}_${file.originalname || 'image.jpg'}`,
                    folder: '/snitch/variants'
                });
                imageUrls.push(uploadResult.url);
            }
        }

        const images = imageUrls.map(url => ({ url }));

        const newVariant = {
            stock: stock !== undefined ? Number(stock) : 0,
            price: variantPrice,
            attributes: parsedAttributes,
            images
        };

        product.variants.push(newVariant);
        await product.save();

        res.status(200).json({
            success: true,
            message: "Variant added successfully",
            product
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function updateVariantStock(req, res) {
    try {
        const { productId } = req.params;
        const { variantId, stock } = req.body;

        const product = await productmodel.findOneAndUpdate(
            { _id: productId, "variants._id": variantId },
            { $set: { "variants.$.stock": Number(stock) } },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ success: false, message: "Product or Variant not found" });
        }

        res.status(200).json({
            success: true,
            message: "Stock updated successfully",
            product
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function deleteproduct(req, res) {
    try {
        const { productId } = req.params;
        const seller = req.user;

        const product = await productmodel.findOne({ _id: productId, seller: seller._id });
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found or unauthorized"
            });
        }

        await productmodel.deleteOne({ _id: productId });

        res.status(200).json({
            message: "Product unlisted successfully",
            success: true
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}