import { logoutSuccess } from '@src/redux/reducer';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';

const SignupLayout = () => {
  const dispatch = useDispatch();

  return (
    <>
      <section className='signup_nav w-100 d-flex justify-content-end'>
        <span className='' role='button' onClick={() => dispatch(logoutSuccess())}>Logout</span>
      </section>
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default SignupLayout;