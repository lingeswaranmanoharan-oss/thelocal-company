import { useState } from 'react';
import * as yup from 'yup';
import { Button } from '../../../../components/Button/Button';
import { Input } from '../../../../components/Input/Input';
import './ResetPassword.scss';
import { Icon } from '@iconify/react';
import { resetPasswordApi } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import toaster from '../../../../services/toasterService';

const resetSchema = yup.object().shape({
  newPassword: yup
    .string()
    .required('New Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: yup
    .string()
    .required('Confirm Password is required')
    .oneOf([yup.ref('newPassword')], 'Passwords must match'),

});
const calculateStrength = (password) => {
  if (!password) return 0;
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  return strength;
};

const ResetPassword = ({ token }) => {
  console.log('TOKEN:', token);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const validateField = async (field, value) => {
    try {
      const updatedData = { ...formData, [field]: value };
      await resetSchema.validateAt(field, updatedData);
      setErrors((prev) => ({ ...prev, [field]: '' }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, [field]: error.message }));
    }
  };


  const handleChange = async (field, value) => {
    // setFormData((prev) => ({ ...prev, [field]: value }));
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    if (field === 'newPassword') {
      setPasswordStrength(calculateStrength(value));
    }
    try {
      await resetSchema.validateAt(field, updated);
      setErrors((prev) => ({ ...prev, [field]: '' }));
    } catch (err) {
      setErrors((prev) => ({ ...prev, [field]: err.message }));
    }
    // await validateField(field, value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);
    try {
      await resetSchema.validate(formData, { abortEarly: false });
      const payload = {
        token: token,
        newPassword: formData.newPassword,
      };
      console.log('RESET PAYLOAD', payload);
      const res = await resetPasswordApi(payload);
      toaster.success(res?.message || 'Password reset successful!');
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1500);
    } catch (error) {
      if (error.inner) {
        const validationErrors = {};
        error.inner.forEach((err) => {
          if (err.path) {
            validationErrors[err.path] = err.message;
          }
        });
        setErrors(validationErrors);
      } else {
        const message =
          error?.response?.data?.error?.message ||
          error?.response?.data?.message ||
          error.message ||
          'Something went wrong';
        toaster.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <form className="login-form">
      <h1 className="text-2xl flex justify-center font-bold text-gray-800 mb-2">Reset Password</h1>
      <p className="text-sm  flex justify-center text-gray-600 mb-4">
        Please enter your new password
      </p>
      <div className="login-form-fields">
        <Input
          id="newPassword"
          label="New Password"
          type="password"
          className="mb-4"
          value={formData.newPassword}
          onChange={(e) => handleChange('newPassword', e.target.value)}
          error={errors.newPassword}
          showPasswordToggle={true}
        />
        <div className="password-strength">
          {[1, 2, 3, 4].map((level) => (
            <span
              key={level}
              className={`strength-meter ${passwordStrength >= level ? 'active' : ''}`}
              data-level={level}
            ></span>
          ))}
          <span className="strength-text">
            {passwordStrength === 0
              ? 'Weak'
              : passwordStrength <= 2
                ? 'Medium'
                : 'Strong'}
          </span>
        </div>

        <ul className="password-requirements mb-2">
          <li className={formData.newPassword.length >= 8 ? 'met' : 'unmet'}>
            At least 8 characters
          </li>
          <li className={/[A-Z]/.test(formData.newPassword) ? 'met' : 'unmet'}>
            1 uppercase letter
          </li>
          <li className={/[0-9]/.test(formData.newPassword) ? 'met' : 'unmet'}>
            1 number
          </li>
          <li className={/[^A-Za-z0-9]/.test(formData.newPassword) ? 'met' : 'unmet'}>
            1 special character
          </li>
        </ul>

        <Input
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => handleChange('confirmPassword', e.target.value)}
          error={errors.confirmPassword}
          showPasswordToggle={true}
        />

        {formData.confirmPassword &&
          formData.confirmPassword === formData.newPassword && (
            <p className="match-indicator">Passwords matched</p>
          )}

      </div>
      {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}

      <Button
        type="submit"
        variant="primary"
        className="login-submit-button w-full"
        onClick={handleSubmit}
      // disabled={!isFormValid}
      >
        {isLoading ? 'Saving...' : 'Submit'}
      </Button>
    </form>
  );
};

export default ResetPassword;
