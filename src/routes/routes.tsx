import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy Pages
import { Spin } from 'antd';
import NotFoundPage from '@src/pages/NotFound';
import { Login } from '@src/routes/lazyPages';
import ProtectedRoutes from '@src/routes/components/ProtectRoutes';

const AllRoutes: React.FC = () => (
  <Suspense fallback={<Spin fullscreen />}>
    <Routes>
      {/* Public Website */}
      {/* <Route element={<WebsiteLayout />}> */}
      {/* <Route path="/" element={<WebsiteHome />} /> */}
      <Route path="/" element={<div>WebsiteHome</div>} />
      {/* </Route> */}

      {/* OAuth Routes */}
      {/* <Route path="/oauth2/google/callback" element={<OauthCallback />} />
      <Route path="/oauth2/github/callback" element={<OauthCallback />} /> */}

      {/* Auth Routes */}
      <Route path="/login/*" element={<Login />} />
      {/* <Route path="/signup/*" element={<Signup />} /> */}

      {/* Protected Routes */}
      <Route element={<ProtectedRoutes />}>
        {/* Signup Flow */}
        {/* <Route element={<SignupLayout />}>
          <Route path="/userdetails" element={<UserDetails />} />
          <Route path="/additionalinfo" element={<SignupAddDetails />} />
          <Route path="/interest" element={<SignupInterests />} />
        </Route> */}

        {/* Main App Layout */}
        {/* <Route element={<DeskMenuBarLayout />}>
          <Route path="/test" element={<Test />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />

          <Route element={<TestLayout />}>
            <Route path="/home" element={<Home />} />
          </Route>
        </Route> */}
      </Route>

      {/* Catch-All */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Suspense>
);

export default AllRoutes;
