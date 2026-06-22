import axios from "axios";

const authapiinstance = axios.create({
    baseURL:"https://localhost:3000/api/auth",
    withCredentials:true,
})

export async function register({eamil,contact,password,fullname,isSeller}){
    const response = await authapiinstance.post("/register",{
        email,contact,password,fullname,isSeller
    })
    return response.data
}