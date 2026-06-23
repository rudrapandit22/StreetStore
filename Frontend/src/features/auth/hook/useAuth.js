import { useDispatch, useSelector } from "react-redux";
import { setUser, setloading, seterror } from "../state/auth.slice.js";
import { register , login} from "../service/auth.api.js";

export const useauth = () => {
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector((state) => state.auth);

    async function handleregister({ email, contact, password, fullname, isSeller = false }) {
        dispatch(setloading(true));
        dispatch(seterror(null));
        try {
            const data = await register({ email, contact, password, fullname, isSeller });
            dispatch(setUser(data.user));
            dispatch(setloading(false));
            return { success: true, user: data.user };
        } catch (err) {
            const errMsg = err.response?.data?.message || err.response?.data?.error || err.message || "Registration failed";
            let parsedError = errMsg;
            if (err.response?.data?.error && Array.isArray(err.response.data.error)) {
                parsedError = err.response.data.error.map(e => e.msg).join(", ");
            }
            dispatch(seterror(parsedError));
            dispatch(setloading(false));
            return { success: false, error: parsedError };
        }
    }

    async function handlelogin({ email, password }) {
        dispatch(setloading(true));
        dispatch(seterror(null));
        try {
            const data = await login({ email, password });
            dispatch(setUser(data.user));
            dispatch(setloading(false));
            return { success: true, user: data.user };
        } catch (err) {
            const errMsg = err.response?.data?.message || err.response?.data?.error || err.message || "Login failed";
            let parsedError = errMsg;
            if (err.response?.data?.error && Array.isArray(err.response.data.error)) {
                parsedError = err.response.data.error.map(e => e.msg).join(", ");
            }
            dispatch(seterror(parsedError));
            dispatch(setloading(false));
            return { success: false, error: parsedError };
        }
    }

    return { handleregister, handlelogin, user, loading, error };
};

