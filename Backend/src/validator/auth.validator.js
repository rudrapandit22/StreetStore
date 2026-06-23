import { body,validationResult } from "express-validator";

function validaterequest(req,res,next){

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({error:errors.array()})  
    
    }
    next();
}

export const validateRegisterUser = [

    body("fullname")
        .notEmpty().withMessage("Full name is required")
        .isLength({ min: 3 }).withMessage("Full name must be at least 3 characters long"),

    body("email")
        .isEmail().withMessage("Invalid email format"),

    body("contact")
        .notEmpty().withMessage("Contact is required")
        .matches(/^\d{10}$/).withMessage("Contact must be 10 digits"),

    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
       
    body("isSeller") 
    .isBoolean().withMessage("isSeller must be a boolean value"),

    validaterequest

];

export const validateloginuser = [
    body("email")
        .isEmail().withMessage("Invalid email format"),
    body("password")
        .isEmail().withMessage("Invalid Password format"),
    validaterequest
]