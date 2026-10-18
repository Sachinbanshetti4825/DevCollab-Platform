
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserProvider from "./features/Auth/context/auth.context.jsx";
import AppRoutes from "../AppRoutes.jsx";

const App = () => {

  return (
    <UserProvider>
      <AppRoutes/>
    </UserProvider>
  );

};

export default App;