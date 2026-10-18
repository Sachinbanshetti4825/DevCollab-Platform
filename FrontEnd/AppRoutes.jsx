import { BrowserRouter,Route,Routes } from "react-router-dom";
import Register from "./src/features/Auth/components/Register.jsx";
import Login from "./src/features/Auth/components/Login.jsx";
const AppRoutes = ()=>{

    return(
        <BrowserRouter>
            <Routes>
                <Route path="/register" element={<Register/>} />
                <Route path="/login" element={<Login/>} />
            </Routes>
        </BrowserRouter>
    ) 

}

export default AppRoutes;
