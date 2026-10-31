
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserProvider from "./features/Auth/context/auth.context.jsx";
import AppRoutes from "../AppRoutes.jsx";
import OrganizationProvider from "./features/Organization/context/organization.context.jsx";

const App = () => {

  return (
    <UserProvider>
      <OrganizationProvider>
        <AppRoutes/>
      </OrganizationProvider>
    </UserProvider>
  );

};

export default App;