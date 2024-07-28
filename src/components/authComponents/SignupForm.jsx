import { postData } from '@src/config/apiConfig';
import { loginSuccess } from '@src/redux/auth';
import validateForm from '@src/utils/validators';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

const SignupForm = () => {
  const [signupForm, setSignupForm] = useState({ email: '', password: '', confirmPassword: '', verification: '', firstName: '', lastName: '' });
  const [step, setStep] = useState(1);
  const [signupResponse, setSignupResponse] = useState(null);
  const [error, setError] = useState({});

  const dispatch = useDispatch();

  const signupFormInfo = [
    { name: 'email', type: 'email', required: true, message: 'Enter a valid email address' },
    { name: 'password', type: 'password', required: true },
    { name: 'confirmPassword', type: 'confirmPassword', required: true },
    { name: 'verification', type: 'number', required: true },
    { name: 'firstName', type: 'text', required: true, message: 'Enter your first name.' },
    { name: 'lastName', type: 'text', required: true, message: 'Enter your last name.' },
  ];

  const emailVerificationFormInfo = [{ name: 'email', type: 'email', required: true, message: 'Enter a valid email address' }];

  const emailCodeVerificationFormInfo = [
    { name: 'email', type: 'email', required: true, message: 'Enter a valid email address' },
    { name: 'verification', type: 'number', required: true, message: 'Please enter the valid verification code.' }
  ];

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupForm(prev => {
      const newFormState = {
        ...prev,
        [name]: value
      };

      if (error?.invalidFields?.includes(name)) {
        formValidation(signupFormInfo, newFormState);
      }

      return newFormState;
    });
  };

  const verifyCode = (e) => {
    e.preventDefault();
    const valid = formValidation(emailCodeVerificationFormInfo, signupForm);
    if (valid) {
      postData('USER_EMAIL_VERIFY', { baseURL: 'users', data: { email: signupForm.email, otp: Number(signupForm.verification) } })
        .then(response => {
          if (response.status === 'success') {
            setStep(3);
            setSignupResponse(response.message);
          } else {
            setSignupResponse(response.message);
          }
        });
    };
  };

  const sendVerification = (e) => {
    e.preventDefault();
    const valid = formValidation(emailVerificationFormInfo, signupForm);
    if (valid) {
      postData('USER_EMAIL_REG', { baseURL: 'users', data: { email: signupForm.email } })
        .then(response => {
          if (response.status === 'success') {
            setStep(2);
            setSignupResponse(null);
          } else {
            setSignupResponse(response.message);
          }
        });
    };

  };

  const signUp = (e) => {
    e.preventDefault();
    const valid = formValidation(signupFormInfo, signupForm);
    if (valid) {
      const { email, password, confirmPassword: passwordConfirm, firstName, lastName } = signupForm;
      postData('USER_SIGNUP', {
        baseURL: 'users',
        data: { email, password, passwordConfirm, firstName, lastName }
      })
        .then(response => {
          if (response.status === 'success') {
            dispatch(loginSuccess({ token: response.token, user: response.data.user }));
            navigate('/home');
          } else {
            setSignupResponse(response.message);
          }
        });

    }
  };

  return (
    <div className='auth_form signup_form'>
      {step === 1 && <form autoComplete="off">
        <div>
          <label className='w-100 mt-2' htmlFor='send-code-email'>Email Address</label>
          <input
            className={`w-100 ${error?.invalidFields?.includes('email') ? 'wrongInput' : error?.validFields?.includes('email') ? 'rightInput' : ''}`}
            autoComplete="new-email"
            id='send-code-email'
            type="email"
            name="email"
            value={signupForm.email}
            onChange={e => {
              const { name, value } = e.target;
              setSignupForm(prev => {
                const newFormState = {
                  ...prev,
                  [name]: value
                };

                if (error?.invalidFields?.includes(name)) {
                  formValidation(emailVerificationFormInfo, newFormState);
                }

                return newFormState;
              });
            }}
          />
          <span>{error?.errors?.email}</span>
        </div>
        <button className='mt-4' onClick={sendVerification}>Verify Email</button>
      </form>}
      {step === 2 && <form autoComplete="off">
        <div>
          <label className='w-100 mt-2' htmlFor='verify-code-email'>Email Address</label>
          <input
            className='w-100'
            autoComplete="new-email"
            id='verify-code-email'
            type="email"
            name="email"
            value={signupForm.email}
            disabled={true}
          />
        </div>
        <div>
          <label className='w-100 mt-2' htmlFor='signup-verification'>Verification Code</label>
          <input
            className={`w-100 ${error?.invalidFields?.includes('verification') ? 'wrongInput' : error?.validFields?.includes('verification') ? 'rightInput' : ''}`}
            autoComplete="new-number"
            id='signup-verification'
            type="number"
            name="verification"
            onKeyDown={(e) => {
              if (['e', 'E', '-', '+', '.'].includes(e.key)) {
                e.preventDefault();
              }
            }}
            value={signupForm.verification}
            onChange={e => {
              const { name, value } = e.target;
              setSignupForm(prev => {
                const newFormState = {
                  ...prev,
                  [name]: value
                };

                if (error?.invalidFields?.includes(name)) {
                  formValidation(emailCodeVerificationFormInfo, newFormState);
                }

                return newFormState;
              });
            }}
          />
          <span>{error?.errors?.verification}</span>
        </div>
        <button className='mt-4' onClick={verifyCode}>Verify</button>
      </form>}
      {step === 3 && < form onSubmit={signUp} autoComplete="off" >
        <div>
          <label className='w-100 mt-2' htmlFor='signup-email'>Email Address</label>
          <input
            className='w-100'
            autoComplete="new-email"
            id='signup-email'
            type="email"
            name="email"
            value={signupForm.email}
            disabled={true}
          />
        </div>
        <div>
          <label className='w-100 mt-2' htmlFor='signup-firstName'>First Name</label>
          <input
            className={`w-100 ${error?.invalidFields?.includes('firstName') ? 'wrongInput' : error?.validFields?.includes('firstName') ? 'rightInput' : ''}`}
            id='signup-firstName'
            type="text"
            name="firstName"
            value={signupForm.firstName}
            onChange={handleChange}
            autoComplete="new-text"
          />
          <span>{error?.errors?.firstName}</span>
        </div>
        <div>
          <label className='w-100 mt-2' htmlFor='signup-lastName'>Last Name</label>
          <input
            className={`w-100 ${error?.invalidFields?.includes('lastName') ? 'wrongInput' : error?.validFields?.includes('lastName') ? 'rightInput' : ''}`}
            autoComplete="new-text"
            id='signup-lastName'
            type="text"
            name="lastName"
            value={signupForm.lastName}
            onChange={handleChange}
          />
          <span>{error?.errors?.lastName}</span>
        </div>
        <div>
          <label className='w-100 mt-2' htmlFor='signup-password'>Password</label>
          <input
            className={`w-100 ${error?.invalidFields?.includes('password') ? 'wrongInput' : error?.validFields?.includes('password') ? 'rightInput' : ''}`}
            autoComplete="new-password"
            id='signup-password'
            type="password"
            name="password"
            value={signupForm.password}
            onChange={handleChange}
          />
          <div className='password_requirements'>
            <span className={`${error?.invalidFields?.includes('password') ? 'text-danger' : error?.validFields?.includes('password') && 'text-success'} ${error?.validFields?.includes('password') && 'text-success'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 135 100" shapeRendering="geometricPrecision" textRendering="geometricPrecision">
                <path d="M120.004 3.341 45.596 81.632l-29.5-24.655c-6.003-5.043-7.852-4.46-12.402 0-4.83 5.489-5.02 7.42 0 12.199s33.703 27.987 33.703 27.987c2.526 1.847 5.102 2.842 8.199 2.842 3.092 0 5.865-.79 8.229-2.842l77.78-82.114c4.523-4.47 4.544-7.265 0-11.708-4.55-4.443-7.078-4.454-11.6 0" fill="currentColor " fillRule="evenodd" />
              </svg>
              Must be atleast 6 characters
            </span>
          </div>
        </div>
        <div>
          <label className='w-100 mt-2' htmlFor='signup=confirm-password'>Confirm Password</label>
          <input
            className={`w-100 ${error?.invalidFields?.includes('confirmPassword') ? 'wrongInput' : error?.validFields?.includes('confirmPassword') ? 'rightInput' : ''}`}
            autoComplete="new-password"
            id='signup=confirm-password'
            type="password"
            name="confirmPassword"
            value={signupForm.confirmPassword}
            onChange={handleChange}
          />
          <span>{error?.errors?.confirmPassword}</span>
        </div>
        <button className='mt-4' type="submit">Login</button>
      </form >}
    </div >
  );
};

export default SignupForm;