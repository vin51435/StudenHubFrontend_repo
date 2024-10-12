import { logoutSuccess } from '@src/redux/reducer';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const Home = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, token, user } = useSelector((state) => state.auth);
  // const { user, userEdProfile } = useSelector((state) => state.userEdProfile);

  console.log({ user },
  );
  return (
    <div>
      ded
      <br />
      <br />
      <button onClick={() => dispatch(logoutSuccess())}>Logout</button>
    </div>
  );
};

export default Home;