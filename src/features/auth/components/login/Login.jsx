import { useState } from 'react';
import * as yup from 'yup';
import { Button } from '../../../../components/Button/Button';
import { Input } from '../../../../components/Input/Input';
import './Login.scss';
import { Icon } from '@iconify/react';
import { signIn, signOut } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import toaster from '../../../../services/toasterService';
import { useAuth } from '../../../../context/AuthContext';
import StorageService from '../../../../services/storageService';
import { setAccessToken } from '../../../../services/httpService';
import { getAuthTokenDetails } from '../../../../utils/functions';
import useRouteInformation from '../../../../hooks/useRouteInformation';

const loginSchema = yup.object().shape({
  username: yup.string().required('User Name is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

const Login = () => {
  const { setToken } = useAuth();
  const { queryParams } = useRouteInformation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateField = async (field, value) => {
    try {
      await loginSchema.validateAt(field, { [field]: value });
      setErrors((prev) => ({ ...prev, [field]: '' }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, [field]: error.message }));
    }
  };

  const handleChange = async (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    await validateField(field, value);
  };

  const submitLoginData = async () => {
    try {
      const sigInResponse = await signIn(formData);
      if (sigInResponse) {
        const { accessToken } = sigInResponse.data;
        const tokenDetails = getAuthTokenDetails(accessToken);
        if (tokenDetails?.authorities?.includes('ROLE_ADMIN')) {
          setAccessToken(accessToken);
          setToken(accessToken);
          navigate(queryParams.ref || '/');
          setIsLoading(false);
        } else {
          setIsLoading(false);
          toaster.warning('You do not have permission to access this application.');
        }
      }
    } catch (error) {
      if (error.response) {
        const { message } = error.response.data?.error || {};
        toaster.error(message || 'Login failed');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      await loginSchema.validate(formData, { abortEarly: false });
      submitLoginData();
    } catch (error) {
      if (error.inner) {
        const validationErrors = {};
        error.inner.forEach((err) => {
          if (err.path) {
            validationErrors[err.path] = err.message;
          }
        });
        setErrors(validationErrors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const emailIcon = <Icon icon="mdi:email-outline" className="w-5 h-5 text-gray-500" />;

  return (
    <form className="login-form">
      <h1 className="text-2xl flex justify-center font-bold text-gray-800 mb-2">Sign In</h1>
      <p className="text-sm  flex justify-center text-gray-600 mb-4">
        Please enter your details to sign in
      </p>
      <div className="login-form-fields">
        <Input
          id="username"
          label="User Name"
          type="text"
          value={formData.username}
          onChange={(e) => handleChange('username', e.target.value)}
          error={errors.username}
          rightIcon={emailIcon}
          className="mb-4"
        />

        <Input
          id="password"
          label="Password"
          type="password"
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
          error={errors.password}
          showPasswordToggle={true}
          className="mb-4"
        />
      </div>

      <div className="login-form-options">
        <a href="/forgot-password" className="forgot-password-link cursor-pointer">
          Forgot Password?
        </a>
      </div>

      <Button
        type="submit"
        variant="primary"
        className="login-submit-button w-full"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? 'Signing In...' : 'Sign In'}
      </Button>
    </form>
  );
};

export default Login;
