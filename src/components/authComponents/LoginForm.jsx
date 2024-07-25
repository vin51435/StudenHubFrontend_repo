import React, { useState } from 'react';

const Login = () => {
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Email:', loginForm.email);
    console.log('Password:', loginForm.password);
  };

  return (
    <div className='login_form'>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div        >
          <label className='w-100 mt-2' htmlFor='login-email'>First name</label>
          <input
            className='w-100'
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
          className='w-100'
            // autoComplete="off"
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