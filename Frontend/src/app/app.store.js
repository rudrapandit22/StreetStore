import {configureStore} from "@reduxjs/toolkit" 
import authReducer from "../features/auth/state/auth.slice.js"
import productreducer from "../features/products/state/product.slice.js"
export const store = configureStore({
    reducer:{
        auth:authReducer,
        product:productreducer
    }
})