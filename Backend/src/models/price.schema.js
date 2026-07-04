import mongoose from "mongoose";
const priceSchema = new mongoose.Schema({
    amount:{
        type:Number,
        required:true
    },
    currency:{
        type:String,
        required:true
    },
    mrp:{
        type:Number
    }
},{
    _id:false,
    _v:false

})

export default priceSchema;