import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export async function registerController (req,res){

    let {username,email,password}=req.body;

    let isAlreadyExists=await User.findOne({
        email:email
    })

    if(isAlreadyExists){
        return res.status(409).json({
            success:false,
            message:"user already exists"
        })
    }

    const hash=await bcrypt.hash(password,10);

    let user=await User.create({
        username,email,password:hash
    })

    return res.status(201).json({
        success:true,
        message:"user created successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })

}

export async function loginController(req,res){

    let {email,password}=req.body;

    let user=await User.findOne({
        email
    })

    if(!user){
        return res.status(401).json({
            success:false,
            message:"Invalid Credentials"
        })
    }

    let isMatch=await bcrypt.compare(password,user.password);

    if(!isMatch){
        return res.status(401).json({
            success:false,
            message:"Invalid Credentials"
        })
    }

    let token=jwt.sign(
        {
            id:user._id
        },
        process.env.JWT_SECRET
    )

    res.cookie("token",token,{
        httpOnly:true,
        secure:process.env.NODE_ENV==="Production",
        sameSite:"lax"
    })

    return res.status(200).json({
        success:true,
        message:"user logged in successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })

}

export function getMeController(req,res){

    const user=req.user;

    return res.status(200).json({
        success:true,
        message:"user fetched successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })


}

export function logoutController(req,res){

    try{
        res.clearCookie("token",{
                httpOnly: true,
                secure: process.env.NODE_ENV === "Production",
                sameSite: "lax"
        });

        return res.status(200).json({
            success:true,
            message:"user logged out successfully"
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"server error during logout"
        })
    }

}