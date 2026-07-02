import productmodel from "../models/product.model.js";

export const stockofvarient = async(productId, variantId) => {
    const product = await productmodel.findOne({
        _id:productId,
        "variants._id":variantId,
        
    })


    const stock = product.variants.find(variant => variant._id.toString() === variantId).stock
    return stock
}