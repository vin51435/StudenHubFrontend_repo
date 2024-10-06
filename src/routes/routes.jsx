import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedRoutes from './protectedRoutes';
import Login from '@src/pages/Login';
import NotFound from '@src/pages/NotFound';
import Home from '@src/pages/Home';
import Signup from '@src/pages/Signup';
import Test from '@src/pages/Test';
import WebsiteHome from '@src/pages/WebsiteHome';
import WebsiteLayout from '@src/components/layouts/WebsiteLayout';
import UserDetails from '@src/pages/UserDetails';
import LoginAddDetails from '@src/pages/LoginAddDetails';
import OauthCallback from '@src/components/authComponents/OauthCallback';

const AllRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route element={<WebsiteLayout />}>
          <Route path="/" element={<WebsiteHome />} />
          <Route path="/test" element={<Test />} />
        </Route>
        <Route element={<ProtectedRoutes />}>
          <Route path='/userdetails' element={<UserDetails />} />
          <Route path='/additionalinfo' element={<LoginAddDetails />} />
          <Route path="/home" element={<Home />} />
        </Route>
        <Route path="/oauth2/google/callback" element={<OauthCallback />} />
        <Route path="/oauth2/github/callback" element={<OauthCallback />} />
        <Route path="/login/*" element={<Login />} />
        <Route path="/signup/*" element={<Signup />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AllRoutes;