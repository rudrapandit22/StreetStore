import {createSlice} from "@reduxjs/toolkit";

const authslice = createSlice({
    name:"auth",
    initialState:{
        user: null,
        loading:false,
        error:null,
    },
    reducers:{
        setUser:(state,action)=>{
            state.user = action.payload;
        },
        setloading:(state,action)=>{
            state.loading = action.payload
        },
        seterror:(state,action)=>{
            state.error = action.payload
        }
    }

})

export const {seterror,setloading,setUser} = authslice.actions
export default authslice.reducer