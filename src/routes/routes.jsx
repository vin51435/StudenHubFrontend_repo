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
import SignupAddDetails from '@src/pages/SignupAddDetails';
import OauthCallback from '@src/components/authComponents/OauthCallback';
import SignupLayout from '@src/components/layouts/SignupLayout';
import SignupInterests from '@src/pages/SignupInterests';

const AllRoutes = () => {
  return (
    <Routes>
      <Route element={<WebsiteLayout />}>
        <Route path="/" element={<WebsiteHome />} />
      </Route>
      <Route element={<ProtectedRoutes />}>
        <Route element={<SignupLayout />}>
          <Route path="/test" element={<Test />} />
          <Route path='/userdetails' element={<UserDetails />} />
          <Route path='/additionalinfo' element={<SignupAddDetails />} />
          <Route path='/interest' element={<SignupInterests />} />
        </Route>
        <Route path="/home" element={<Home />} />
      </Route>
      <Route path="/oauth2/google/callback" element={<OauthCallback />} />
      <Route path="/oauth2/github/callback" element={<OauthCallback />} />
      <Route path="/login/*" element={<Login />} />
      <Route path="/signup/*" element={<Signup />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AllRoutes;