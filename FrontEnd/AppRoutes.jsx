import { BrowserRouter,Route,Routes } from "react-router-dom";
import Register from "./src/features/Auth/components/Register.jsx";
import Login from "./src/features/Auth/components/Login.jsx";
import Dashboard from "./src/features/Auth/components/Dashboard.jsx";
const AppRoutes = ()=>{

    return(
        <BrowserRouter>
            <Routes>
                <Route path="/register" element={<Register/>} />
                <Route path="/login" element={<Login/>} />
                <Route path="/" element={<Dashboard/>} />
            </Routes>
        </BrowserRouter>
    ) 

}

export default AppRoutes;
