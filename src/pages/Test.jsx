import { logoutSuccess } from '@src/redux/auth';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Test = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div>
    <span>Test page</span>
      <br />
      <br />
      <button onClick={() => dispatch(logoutSuccess())}>Logout</button>
      <br />
      <br />
      <button onClick={() => navigate('/login')}>Login Page</button>
      <br />
      <br />
    </div>
  );
};

export default Test;