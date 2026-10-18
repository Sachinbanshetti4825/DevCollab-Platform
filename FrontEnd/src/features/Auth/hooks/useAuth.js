import { useContext } from "react";
import { userContext } from "../context/auth.context.jsx";

const useAuth = () => {
  const context = useContext(userContext);

  if (context === null) {
    throw new Error("useAuth must be used within UserProvider");
  }

  return context;
};

export default useAuth;