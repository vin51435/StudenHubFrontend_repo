import validateForm from '@src/utils/validators';
import React, { useState } from 'react';

const Login = () => {
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [error, setError] = useState({});

  const formInfo = [
    { name: 'email', type: 'email', required: true, message: 'Enter a valid email address' },
    { name: 'password', type: 'password', required: true },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(prev => {
      const newFormState = {
        ...prev,
        [name]: value
      };

      if (error?.invalidFields?.includes(name)) {
        formValidation(formInfo, newFormState);
      }

      return newFormState;
    });
  };

  const formValidation = (formInfo, loginForm) => {
    const validatedForm = validateForm(formInfo, loginForm);
    if (validatedForm.isValid) {
      setError({});
      console.log('Form Data Valid:', loginForm);
      return true;
    } else {
      setError(validatedForm);
      console.log(validatedForm);
      return false;
    }
  };

  const handleSubmit = (event) => {
    formValidation(formInfo, loginForm);
    event.preventDefault();

  };

  return (
    <div className='auth_form'>
      <form onSubmit={handleSubmit} autoComplete="off" noValidate>
        <div        >
          <label className={`w-100 mt-2 `} htmlFor='login-email'>Email</label>
          <input
            className={`w-100 ${error?.invalidFields?.includes('email') ? 'wrongInput' : error?.validFields?.includes('email') ? 'rightInput' : ''}`}
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
            className={`w-100 ${error?.invalidFields?.includes('password') ? 'wrongInput' : ''}`}
            autoComplete="new-password"
            id='login-password'
            type="password"
            name="password"
            value={loginForm.password}
            onChange={handleChange}
          />
        </div>
        <button className='mt-4' type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;