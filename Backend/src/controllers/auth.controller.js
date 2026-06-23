import usermodel from "../models/user.model.js";
import jwt from "jsonwebtoken";

async function sendtokenresponse(user,res,message){
    const token = jwt.sign(
        { id:user._id },
        process.env.JWT_SECRET,
        { expiresIn:"7d" }
    );
        
    res.cookie("token",token,{
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({
        message,
        success:true,
        user:{
            id: user._id,
            email:user.email,
            contact:user.contact,
            fullname:user.fullname,
            role:user.role
        }
    })
}

export const register = async (req,res)=>{
    const {email,contact,password,fullname,isSeller} = req.body;

    try{
        const existinguser = await usermodel.findOne({
            $or:[
                {email},
                {contact}
            ]
        })
        if(existinguser){
            return res.status(400).json({message:"User with this email or contact already exists"})
        }

        const user = await usermodel.create({
            email,contact,password,fullname,role:isSeller?"seller" : "buyer"

        })

        await sendtokenresponse(user,res,"user registered sucessfully") 



    }

    catch(error){
        console.log(error)
        return res.status(400).json({message:"Server error"});
    }
}

export const login = async(req,res)=>{
    const {email,password} =req.body;

    const user = await usermodel.findOne({email});

    if(!user){
        return res.status(400).json({message:"Invalid email or password"});

    }
    const ismatch = await user.comparePassword(password);


    if(!ismatch){
        return res.status(400).json({message:"Invalid email or password"});

    }

    await sendtokenresponse(user,res,"user logged in successfully")

    
}