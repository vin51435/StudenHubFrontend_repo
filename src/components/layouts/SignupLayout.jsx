import { logoutSuccess } from '@src/redux/reducer';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';

const SignupLayout = () => {
  const dispatch = useDispatch();

  return (
    <>
      <section className='signup_nav w-100 d-flex justify-content-end mb-md-3 mb-2'>
        <span className='btn btn-red m-2 ' role='button' onClick={() => dispatch(logoutSuccess())}>Logout</span>
      </section>
      <main className='w-100 h-100 '>
        <Outlet />
      </main>
    </>
  );
};

export default SignupLayout;