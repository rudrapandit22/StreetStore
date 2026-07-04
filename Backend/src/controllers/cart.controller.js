import mongoose from "mongoose";
import cartmodel from "../models/cart.model.js";
import productmodel from "../models/product.model.js";
import { stockofvarient } from "../dao/product.dao.js";

export const addtocart = async(req,res)=>{
    try {
        const {productId, variantId} = req.params;
        const quantity = parseInt(req.body.quantity) || 1;

        if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(variantId)) {
            return res.status(400).json({
                message: "Invalid product or variant ID format",
                success: false
            });
        }

        const product = await productmodel.findOne({
            _id: productId,
            "variants._id": variantId
        });

        if(!product){
            return res.status(404).json({
                message:"Product variant not found",
                success:false
            });
        }

        const stock = await stockofvarient(productId, variantId);

        const cart = await cartmodel.findOne({
            user: req.user._id
        }) || await cartmodel.create({ user: req.user._id, items: [] });

        const itemIndex = cart.items.findIndex(item => 
            item.product.toString() === productId && 
            item.variant.toString() === variantId
        );

        const matchedVariant = product.variants.id(variantId);
        const cartItemPrice = (matchedVariant && matchedVariant.price && matchedVariant.price.amount !== undefined && matchedVariant.price.amount !== null)
            ? matchedVariant.price
            : product.price;

        if (itemIndex > -1) {
            const currentQuantity = cart.items[itemIndex].quantity;
            if (currentQuantity + quantity > stock) {
                return res.status(400).json({
                    message: `Not enough stock. Only ${stock} items available in total.`,
                    success: false
                });
            }
            cart.items[itemIndex].quantity += quantity;
            cart.items[itemIndex].price = cartItemPrice;
        } else {
            if (quantity > stock) {
                return res.status(400).json({
                    message: `Only ${stock} items left in stock`,
                    success: false
                });
            }
            cart.items.push({
                product: productId,
                variant: variantId,
                quantity,
                price: cartItemPrice
            });
        }

        await cart.save();

        return res.status(200).json({
            message: "Item added to cart successfully",
            success: true,
            cart
        });
    } catch (error) {
        console.error("addtocart error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message
        });
    }
};

export const getcart = async (req,res)=>{
    try {
        const user = req.user;
        let cart = await cartmodel.findOne({ user: user._id }).populate("items.product");

        if(!cart){
            cart = await cartmodel.create({ user: user._id, items: [] });
        }

        return res.status(200).json({
            message: "Cart fetched successfully",
            success: true,
            cart
        });
    } catch (error) {
        console.error("getcart error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message
        });
    }
};

export const removefromcart = async (req, res) => {
    try {
        const { productId, variantId } = req.params;

        const cart = await cartmodel.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
                success: false
            });
        }

        cart.items = cart.items.filter(item => 
            !(item.product.toString() === productId && item.variant.toString() === variantId)
        );

        await cart.save();

        const updatedCart = await cartmodel.findOne({ user: req.user._id }).populate("items.product");

        return res.status(200).json({
            message: "Item removed from cart successfully",
            success: true,
            cart: updatedCart
        });
    } catch (error) {
        console.error("removefromcart error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message
        });
    }
};

export const updatequantity = async (req, res) => {
    try {
        const { productId, variantId } = req.params;
        const quantity = parseInt(req.body.quantity);

        if (isNaN(quantity) || quantity < 1) {
            return res.status(400).json({
                message: "Quantity must be at least 1",
                success: false
            });
        }

        const stock = await stockofvarient(productId, variantId);
        if (quantity > stock) {
            return res.status(400).json({
                message: `Only ${stock} items available in stock`,
                success: false
            });
        }

        const cart = await cartmodel.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
                success: false
            });
        }

        const itemIndex = cart.items.findIndex(item => 
            item.product.toString() === productId && 
            item.variant.toString() === variantId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                message: "Item not found in cart",
                success: false
            });
        }

        cart.items[itemIndex].quantity = quantity;
        await cart.save();

        const updatedCart = await cartmodel.findOne({ user: req.user._id }).populate("items.product");

        return res.status(200).json({
            message: "Quantity updated successfully",
            success: true,
            cart: updatedCart
        });
    } catch (error) {
        console.error("updatequantity error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message
        });
    }
};

export const incrementquantity = async (req, res) => {
    try {
        const { productId, variantId } = req.params;

        const stock = await stockofvarient(productId, variantId);
        const cart = await cartmodel.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
                success: false
            });
        }

        const itemIndex = cart.items.findIndex(item => 
            item.product.toString() === productId && 
            item.variant.toString() === variantId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                message: "Item not found in cart",
                success: false
            });
        }

        if (cart.items[itemIndex].quantity + 1 > stock) {
            return res.status(400).json({
                message: `Only ${stock} items available in stock`,
                success: false
            });
        }

        cart.items[itemIndex].quantity += 1;
        await cart.save();

        const updatedCart = await cartmodel.findOne({ user: req.user._id }).populate("items.product");

        return res.status(200).json({
            message: "Quantity incremented successfully",
            success: true,
            cart: updatedCart
        });
    } catch (error) {
        console.error("incrementquantity error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message
        });
    }
};

export const decrementquantity = async (req, res) => {
    try {
        const { productId, variantId } = req.params;

        const cart = await cartmodel.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
                success: false
            });
        }

        const itemIndex = cart.items.findIndex(item => 
            item.product.toString() === productId && 
            item.variant.toString() === variantId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                message: "Item not found in cart",
                success: false
            });
        }

        if (cart.items[itemIndex].quantity - 1 < 1) {
            return res.status(400).json({
                message: "Quantity must be at least 1",
                success: false
            });
        }

        cart.items[itemIndex].quantity -= 1;
        await cart.save();

        const updatedCart = await cartmodel.findOne({ user: req.user._id }).populate("items.product");

        return res.status(200).json({
            message: "Quantity decremented successfully",
            success: true,
            cart: updatedCart
        });
    } catch (error) {
        console.error("decrementquantity error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message
        });
    }
};

export const checkout = async (req, res) => {
    try {
        let cart = await cartmodel.findOne({ user: req.user._id });
        if (cart) {
            cart.items = [];
            await cart.save();
        }
        return res.status(200).json({
            message: "Order placed successfully",
            success: true,
            cart
        });
    } catch (error) {
        console.error("checkout error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message
        });
    }
};
