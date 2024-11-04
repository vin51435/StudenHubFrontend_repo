import { logoutSuccess } from '@src/redux/reducer';
import React from 'react';
import { useDispatch } from 'react-redux';

const Profile = () => {
  const dispatch = useDispatch();

  return (
    <div>Profile
    <br/>
      <button onClick={() => dispatch(logoutSuccess())}>Logout</button>
    </div>
  );
};

export default Profile;