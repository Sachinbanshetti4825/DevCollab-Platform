import React from "react";
import useAuth from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user, authLoading } = useAuth();

  if(authLoading){
    return <p>Loading...</p>
  }

  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
