import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { PageLoadingSpinner } from '@src/components/common/LoadingSpinner';
import Profile from '@src/pages/Profile';
import TestLayout from '@src/components/layouts/TestLayout';
const Notifications = React.lazy(() => import('@src/pages/Notifications'));
const ProtectedRoutes = React.lazy(() => import('./protectedRoutes'));
const Login = React.lazy(() => import('@src/pages/Login'));
const NotFound = React.lazy(() => import('@src/pages/NotFound'));
const Home = React.lazy(() => import('@src/pages/Home'));
const Signup = React.lazy(() => import('@src/pages/Signup'));
const Test = React.lazy(() => import('@src/pages/Test'));
const WebsiteHome = React.lazy(() => import('@src/pages/WebsiteHome'));
const WebsiteLayout = React.lazy(() => import('@src/components/layouts/WebsiteLayout'));
const UserDetails = React.lazy(() => import('@src/pages/UserDetails'));
const SignupAddDetails = React.lazy(() => import('@src/pages/SignupAddDetails'));
const OauthCallback = React.lazy(() => import('@src/components/authComponents/OauthCallback'));
const SignupLayout = React.lazy(() => import('@src/components/layouts/SignupLayout'));
const SignupInterests = React.lazy(() => import('@src/pages/SignupInterests'));
const Inbox = React.lazy(() => import('@src/pages/Inbox'));
const DeskMenuBarLayout = React.lazy(() => import('@src/components/layouts/DeskMenuBarLayout'));

const AllRoutes = () => {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <Routes>
        <Route element={<WebsiteLayout />}>
          <Route path="/" element={<WebsiteHome />} />
        </Route>
        <Route element={<ProtectedRoutes />}>
          <Route element={<SignupLayout />}>
            <Route path='/userdetails' element={<UserDetails />} />
            <Route path='/additionalinfo' element={<SignupAddDetails />} />
            <Route path='/interest' element={<SignupInterests />} />
          </Route>
          <Route element={<DeskMenuBarLayout />}>
            <Route path="/test" element={<Test />} />
            <Route element={<TestLayout />}>
              <Route path="/home" element={<Home />} />
            </Route>
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />
          </Route>
        </Route>
        <Route path="/oauth2/google/callback" element={<OauthCallback />} />
        <Route path="/oauth2/github/callback" element={<OauthCallback />} />
        <Route path="/login/*" element={<Login />} />
        <Route path="/signup/*" element={<Signup />} />
        <Route path="*" element={<NotFound />} />
      </Routes >
    </Suspense>
  );
};

export default AllRoutes;