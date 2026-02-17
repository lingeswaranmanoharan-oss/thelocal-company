import { Button } from '../../../../components/Button/Button';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';
import { Input } from '../../../../components/Input/Input';
import apiServices from '../../../../services/apiServices';
import { changePassword } from '../../services/authService';
import { getAuthTokenDetails } from '../../../../utils/functions';
import toaster from '../../../../services/toasterService';
import useRouteInformation from '../../../../hooks/useRouteInformation';
import { setAccessToken } from '../../../../services/httpService';
import { useAuth } from '../../../../context/AuthContext';

const getSchema = () => {
  return yup.object({
    password: yup
      .string()
      .min(8, 'Password must be at least 8 characters')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .matches(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
      .required('Password is required'),
    repatedPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'Passwords do not match')
      .required('Confirm password is required'),
  });
};

const calculateStrength = (password) => {
  if (!password) return 0;
  let strength = 0;
  if (password.length >= 8) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;
  return strength;
};

const ChangePassword = () => {
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [loading, setLoading] = useState(false);
  const { navigateToLogin } = useRouteInformation();
  const { setToken } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm({
    resolver: yupResolver(getSchema()),
    mode: 'submit',
    defaultValues: {
      password: null,
    },
  });

  const onSubmit = async (body) => {
    try {
      setLoading(true);
      const response = await changePassword({
        newPassword: body.password,
        userId: getAuthTokenDetails()?.sub,
      });
      if (response.success === true) {
        toaster.success(response.message);
        setLoading(false);
        setToken('');
        navigateToLogin();
      } else {
        toaster.warning(response.message);
        setLoading(false);
      }
    } catch (e) {
      toaster.error(e?.data?.error?.message);
      setLoading(false);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-2xl flex justify-center font-bold text-gray-800 mb-2">Change Password</h1>
      <p className="text-sm  flex justify-center text-gray-600 mb-4">
        Please changer your password
      </p>
      <div className="login-form-fields">
        <Input
          id="newPassword"
          label="New Password"
          type="password"
          className="mb-4"
          {...register('password')}
          onChange={(e) => {
            setPasswordStrength(calculateStrength(e.target.value));
            setValue('password', e.target.value);
            trigger('password');
          }}
          error={errors?.password?.message?.includes('required') ? errors?.password?.message : ''}
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
            {passwordStrength === 0 ? 'Weak' : passwordStrength <= 2 ? 'Medium' : 'Strong'}
          </span>
        </div>

        <ul className="password-requirements mb-2">
          <li className={watch('password')?.length >= 8 ? 'met' : 'unmet'}>
            At least 8 characters
          </li>
          <li className={/[A-Z]/.test(watch('password') || '') ? 'met' : 'unmet'}>
            1 uppercase letter
          </li>
          <li className={/[0-9]/.test(watch('password') || '') ? 'met' : 'unmet'}>1 number</li>
          <li className={/[^A-Za-z0-9]/.test(watch('password') || '') ? 'met' : 'unmet'}>
            1 special character
          </li>
        </ul>
        <Input
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          {...register('repatedPassword')}
          error={errors?.repatedPassword?.message}
          showPasswordToggle={true}
        />

        {watch('repatedPassword') && watch('repatedPassword') === watch('password') && (
          <p className="match-indicator">Passwords matched</p>
        )}
      </div>
      <Button
        type="submit"
        variant="primary"
        className="login-submit-button w-full"
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Save'}
      </Button>
    </form>
  );
};

export default ChangePassword;
