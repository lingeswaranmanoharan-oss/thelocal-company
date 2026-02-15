import ResetPassword from '../../features/auth/components/reset-password/ResetPassword';
import './Auth.scss';
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import toaster from '../../services/toasterService';
import logo from '../../assets/images/logo.png';
export const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");

    useEffect(() => {
        if (!token) {
            toaster.error("Invalid or expired reset link");
            navigate("/login", { replace: true });
        }
    }, [token, navigate]);
    if (!token) return null;
    return (
        <div className="login-page-container">
            <div className="login-page-left">
                <img src={logo} alt="logo" className="login-page-left-image" />
            </div>
            <div className="login-page-right">
                <ResetPassword token={token} />
            </div>
        </div>
    );
};
