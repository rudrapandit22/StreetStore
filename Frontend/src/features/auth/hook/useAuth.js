import { setUser,setloading,seterror } from "../state/auth.slice.js";
import { register } from "../service/auth.api.js";



export const useauth=()=>{

    const dispatch =useDispatch()


    async function handleregister({eamil,contact,password,fullname,isSeller=false}){
        const data = await register({eamil,contact,password,fullname,isSeller}) 


        dispatch(setUser(data.user))


    }

    return {handleregister}
}