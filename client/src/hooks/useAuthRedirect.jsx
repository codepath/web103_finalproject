import { useContext, useEffect } from "react";
import AuthContext from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function useAuthRedirect(redirectPath = "/splash") {
    const {user, loading} = useContext(AuthContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (!loading && !user) {
            navigate(redirectPath)
        }
    }, [user, loading, redirectPath, navigate])
}