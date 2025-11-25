import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "./authSlice";
import { useNavigate } from "react-router-dom";

export default function Logout() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(logout());

        localStorage.removeItem("token");

        navigate("/login");
    }
    , [dispatch, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <p className="text-lg text-gray-700" >Logging Out....</p>
        </div>
    )
}