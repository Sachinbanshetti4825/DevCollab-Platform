import { BrowserRouter,Route,Routes } from "react-router-dom";
import Register from "./src/features/Auth/components/Register.jsx";
import Login from "./src/features/Auth/components/Login.jsx";
import Dashboard from "./src/features/Dashboard/Dashboard.jsx";
import ProtectedRoute from "./src/features/Auth/components/ProtectedRoute.jsx";
import OrganizationPage from "./src/features/Organization/components/OrganizationPage.jsx";
import { Navigate } from "react-router-dom";
const AppRoutes = ()=>{

    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/register" />} />
                <Route path="/register" element={<Register/>} />
                <Route path="/login" element={<Login/>} />
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard/>
                    </ProtectedRoute>
                } />
                <Route path="/organization" element={
                    <ProtectedRoute>
                        <OrganizationPage/>
                    </ProtectedRoute>
                } />
            </Routes>
        </BrowserRouter>
    ) 

}

export default AppRoutes;
