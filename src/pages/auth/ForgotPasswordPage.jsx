import ForgotPassword from '../../features/auth/components/forgot-password/ForgotPassword';
import './Auth.scss';

export const ForgotPasswordPage = () => {
  return (
    <div className="login-page-container">
      <div className="login-page-left">
        <img src="./HRM logo.png" />
      </div>
      <div className="login-page-right">
        <ForgotPassword />
      </div>
    </div>
  );
};
