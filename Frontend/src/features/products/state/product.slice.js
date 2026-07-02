import { createSlice } from "@reduxjs/toolkit";

const productslice = createSlice({
    name: "product",
    initialState: {
        sellerproducts: [],
        products: []
    },
    reducers: {
        setsellerproducts: (state, action) => {
            state.sellerproducts = action.payload;
        },
        setproducts: (state, action) => {
            state.products = action.payload;
        },
        updateproductinstate: (state, action) => {
            const updatedProduct = action.payload;
            state.sellerproducts = state.sellerproducts.map(p => p._id === updatedProduct._id ? updatedProduct : p);
            state.products = state.products.map(p => p._id === updatedProduct._id ? updatedProduct : p);
        }
    }
})

export const { setsellerproducts, setproducts, updateproductinstate } = productslice.actions

export default productslice.reducer