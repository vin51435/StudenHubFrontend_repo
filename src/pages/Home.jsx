import { logoutSuccess } from '@src/redux/reducer';
import { getCookie } from '@src/utils/cookieGetterSetter';
import React from 'react';
import { Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Home = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, token, user } = useSelector((state) => state.auth);
  // const { user, userEdProfile } = useSelector((state) => state.userEdProfile);

  console.log({ user },
  );
  return (
    <Container>
      <div className='fs-2'>
        <Link to={'/test'}>Test</Link>
        <br />
        <Link to={'/inbox'}>Inbox</Link>
        <br />
        <br />
        <br />
        <br />
        <button onClick={() => dispatch(logoutSuccess())}>Logout</button>
      </div>
    </Container>
  );
};

export default Home;