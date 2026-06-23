import mongoose from "mongoose";
import bcrypt from "bcryptjs"
const userschema = new mongoose.Schema({
    email:{type:String,required:true,unique:true},
    contact:{type:String,required:true},
    password:{type:String,required:true},
    fullname:{type:String,required:true},
    role:{
        type:String,
        enum:["buyer","seller"],
        default:"buyer"
    }
})

userschema.pre("save",async function (){
    if(!this.isModified("password")) return;

    const hash = await bcrypt.hash(this.password,10);
    this.password = hash;
})

userschema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
}



const usermodel = mongoose.model('user',userschema);

export default usermodel;