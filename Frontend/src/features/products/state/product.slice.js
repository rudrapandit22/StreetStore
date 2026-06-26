import { createSlice } from "@reduxjs/toolkit";

const productslice = createSlice({
    name: "product",
    initialState: {
        sellerproducts: []
    },
    reducers: {
        setsellerproducts: (state, action) => {
            state.sellerproducts = action.payload;
        }
    }
})

export const { setsellerproducts } = productslice.actions

export default productslice.reducer