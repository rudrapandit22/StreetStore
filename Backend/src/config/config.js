import dotenv from "dotenv"
import jwt from "jsonwebtoken";
dotenv.config();


if(!process.env.MONGO_URI){
    throw new Error("MONGO_URI is not defined in enviroment variables")
}

if(!process.env.JWT_SECRET){
    throw new Error("jwt_secret is not defined in enviroment variables")
}



export const config = {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    GOOGLE_CLIENT_ID:process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET:process.env.GOOGLE_CLIENT_SECRET,
    NODE_ENV:process.env.NODE_ENV || "development",
    IMAGEKIT_PRIVATE_KEY:process.env.IMAGEKIT_PRIVATE_KEY
} 