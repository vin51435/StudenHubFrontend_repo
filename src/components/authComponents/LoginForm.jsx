import { postData } from '@src/config/apiConfig';
import { loginSuccess } from '@src/redux/reducer';
import validateForm from '@src/utils/validators';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '@src/components/common/LoadingSpinner.jsx';

const Login = () => {
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [validationError, setValidationError] = useState({});
  const [apiResponse, setApiResponse] = useState({ state: null, message: null });
  const [step, setStep] = useState(1);
  const [load, setLoad] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formInfo = [
    { name: 'email', type: 'email', required: true, message: 'Enter a valid email address' },
    { name: 'password', type: 'password', required: true },
  ];

  const resetFormInfo = [
    { name: 'email', type: 'email', required: true, message: 'Enter a valid email address' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(prev => {
      const updatedForm = { ...prev, [name]: value };
      if (validationError?.invalidFields?.includes(name)) {
        formValidation(formInfo, updatedForm);
      }
      return updatedForm;
    });
  };

  const formValidation = (formInfo, formData) => {
    const validation = validateForm(formInfo, formData);
    setValidationError(validation.isValid ? {} : validation);
    return validation.isValid;
  };

  const loginSubmit = (e) => {
    e.preventDefault();
    const valid = formValidation(formInfo, loginForm);
    if (valid) {
      setLoad(true);
      postData('USER_LOGIN', {
        baseURL: 'users',
        data: { email: loginForm.email, password: loginForm.password }
      })
        .then(response => {
          const { data, token } = response;
          const { user } = data;
          dispatch(loginSuccess({ user, token }));
          navigate('/home');
        })
        .catch(err => setApiResponse({ state: 0, message: err.message }))
        .finally(() => setLoad(false));
    }
  };

  const forgotPasswordSubmit = (e) => {
    e.preventDefault();
    const valid = formValidation(resetFormInfo, loginForm);
    if (valid) {
      postData('USER_FORGOT_PASSWORD', { baseURL: 'users', data: { email: loginForm.email } })
        .then(response => {
          if (response.status === 'success') {
            setApiResponse({ state: 1, message: response.message });
          } else if (response.error.code === 404) {
            navigate('/signup');
          } else {
            setApiResponse({ state: 0, message: response.message });
          }
        })
        .catch(error => {
          console.error('Error:', error);
          setApiResponse({ state: 0, message: error?.message ?? 'An error occurred. Please try again later.' });
        });
    }
  };

  return (
    <div className='auth_form'>
      {step === 1 && (
        <form onSubmit={loginSubmit} autoComplete="off" noValidate>
          <div className=''>
            <label className={`w-100 mt-2 `} htmlFor='login-email'>Email</label>
            <input
              className={`w-100 ${validationError?.invalidFields?.includes('email') ? 'wrongInput' : validationError?.validFields?.includes('email') ? 'rightInput' : ''}`}
              autoComplete="new-email"
              id='login-email'
              type="email"
              name="email"
              value={loginForm.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className='w-100 mt-2' htmlFor='login-password'>Password</label>
            <input
              className={`w-100 ${validationError?.invalidFields?.includes('password') ? 'wrongInput' : ''}`}
              autoComplete="new-password"
              id='login-password'
              type="password"
              name="password"
              value={loginForm.password}
              onChange={handleChange}
            />
          </div>
          <span className={`text-danger`}>{apiResponse?.message}</span>
          <div className='w-100 text-primary fw-medium d-flex justify-content-end'>
            <span role='button' onClick={() => {
              setValidationError({});
              setApiResponse({ state: null, message: null });
              setStep(2);
            }}>forgot password?</span>
          </div>
          <button className='mt-4 btn' type="submit" disabled={load}>
            {load ? (
              <LoadingSpinner height={'1.4rem'} />
            ) : (
              'Login'
            )}</button>
        </form>
      )}
      {step === 2 && <form onSubmit={forgotPasswordSubmit} autoComplete="off" noValidate>
        <div>
          <label className={`w-100 mt-2 `} htmlFor='reset-email'>Email</label>
          <input
            className={`w-100 ${validationError?.invalidFields?.includes('email') ? 'wrongInput' : validationError?.validFields?.includes('email') ? 'rightInput' : ''}`}
            autoComplete="new-email"
            id='reset-email'
            type="email"
            name="email"
            value={loginForm.email}
            onChange={(e) => {
              const { name, value } = e.target;
              setLoginForm(prev => {
                const newFormState = {
                  ...prev,
                  [name]: value
                };
                if (validationError?.invalidFields?.includes(name)) {
                  formValidation(resetFormInfo, newFormState);
                }
                return newFormState;
              });
            }}
          />
        </div>
        <span className={`${apiResponse?.state === 0 ? 'text-danger' : 'text-success'}`}>{apiResponse?.message}</span>
        <div className='w-100 text-primary fw-medium d-flex justify-content-end'>
          <span role='button'
            onClick={() => {
              setApiResponse({ state: null, message: null });
              setValidationError({});
              setStep(1);
            }}>Login</span>
        </div>
        <button className='mt-4 btn' type="submit" disabled={load}>
          {load ? (
            <LoadingSpinner height={'1.4rem'} />
          ) : (
            'Send reset link'
          )}</button>
      </form>}
    </div>
  );
};

export default Login;