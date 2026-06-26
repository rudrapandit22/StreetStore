import axios from "axios"

const productapiinstance = axios.create({
    baseURL:"/api/products",
    withCredentials: true,
})

export async  function createproduct(formData){
    const response = await productapiinstance.post("/",formData)
    return response.data 
}

export async function getsellerproduct(){
    const response = await productapiinstance.get("/seller")

    return response.data 
}