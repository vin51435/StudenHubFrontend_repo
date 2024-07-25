import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedRoutes from './protectedRoutes';
import Auth from '@src/pages/Login';
import NotFound from '@src/pages/NotFound';
import Home from '@src/pages/Home';

const AllRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="/login/*" element={<Auth />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AllRoutes;