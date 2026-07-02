import { param,body,validationResult } from "express-validator";

const validaterequest = (req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    next();
}


export const validateaddtocart = [
    param("productId").notEmpty().withMessage("Product ID is required"),
    param("variantId").notEmpty().withMessage("Variant ID is required"),
    body("quantity").optional().isInt({min:1}).withMessage("Quantity must be at least 1"),
    
    validaterequest
]