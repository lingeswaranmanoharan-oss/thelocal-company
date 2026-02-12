import Login from '../../features/auth/components/login/Login';
import './Auth.scss';

export const LoginPage = () => {
  return (
    <div className="login-page-container">
      <div className="login-page-left">
        <img src="./HRM logo.png" />
      </div>
      <div className="login-page-right">
        <Login />
      </div>
    </div>
  );
};
