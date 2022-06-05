import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, Route } from "react-router-dom";

const PrivateRoute = () => {
  const user = useSelector((state) => state.user);
  return user.isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
