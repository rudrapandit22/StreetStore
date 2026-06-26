import {createproduct,getsellerproduct} from "../services/product.api"
import {useDispatch} from "react-redux"
import { setsellerproducts } from "../state/product.slice"


export const useproduct = ()=>{

    const dispatch = useDispatch()

    async function handlecreateproduct(formdata){
        const data = await createproduct(formdata)
        return data.product
    }

    async function handlegetsellerproduct(){
        const data = await getsellerproduct()
        dispatch(setsellerproducts(data.products))
        return data.products
    }

    return {handlecreateproduct,handlegetsellerproduct};
}