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

const AllRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route element={<WebsiteLayout />}>
          <Route path="/" element={<WebsiteHome />} />
          <Route path="/test" element={<Test />} />
        </Route>
        <Route element={<ProtectedRoutes />}>
          <Route path="/home" element={<Home />} />
        </Route>
        <Route path="/login/*" element={<Login />} />
        <Route path="/signup/*" element={<Signup />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AllRoutes;