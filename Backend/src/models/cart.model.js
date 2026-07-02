import mongoose from "mongoose";
import priceSchema from "./price.schema.js";

const cartschema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    items:[
        {
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'product',
                required:true
            },
            variant:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'product.variant'
            },
            quantity:{
                type:Number,
                default:1
            },
            price:{
                type:priceSchema,
                required:true
            }
        }
    ]
})

const cartmodel = mongoose.model("cart",cartschema);

export default cartmodel;