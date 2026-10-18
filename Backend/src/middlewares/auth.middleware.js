import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const authMiddleware = async (req,res,next)=>{

    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            success:false,
            message:"Invalid Credentials"
        })
    }

    let decoded;

    try{
        decoded =jwt.verify(token,process.env.JWT_SECRET);
    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:"Invalid Token"
        })
    }

    const user=await User.findById(decoded.id);

    if(!user){
        return res.status(404).json({
            success:false,
            message:"user not found"
        })
    }
    
    req.user=user;

    next();

}

export default authMiddleware;