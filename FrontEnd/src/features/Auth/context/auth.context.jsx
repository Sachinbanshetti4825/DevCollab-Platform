import { createContext, useEffect, useState } from "react";
import {
  getMe,
  login as loginServices,
  register as registerServices,
  logout as logoutServices
} from "../services/auth.services.js";
export const userContext = createContext(null);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  async function checkAuth() {
    try {
      const data = await getMe();

      setUser(data);
    } catch (error) {
      setUser(null);
      console.log(error);
    } finally {
      setAuthLoading(false);
    }
  }

  const loginUser = async (credentials) => {
    try {
      setLoginLoading(true);

      const data = await loginServices(credentials);

      setUser(data);

      return data;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setLoginLoading(false);
    }
  };

  const registerUser = async (credentials) => {
    try {
      setRegisterLoading(true);

      const data = await registerServices(credentials);
      
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setRegisterLoading(false);
    }
  };
  const logoutUser = async () => {
    try {
      setLogoutLoading(true);

      await logoutServices();

      setUser(null);
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setLogoutLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  console.log(user);

  return (
    <userContext.Provider
      value={{
        user,
        setUser,
        authLoading,
        login: loginUser,
        register: registerUser,
        logout: logoutUser,
        logoutLoading,
        registerLoading,
        loginLoading,
      }}
    >
      {children}
    </userContext.Provider>
  );
};

export default UserProvider;
