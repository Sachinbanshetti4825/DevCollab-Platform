import express from "express";
import { loginValidator, registerValidator } from "../validators/user.validator.js";
import validateRequest from "../middlewares/validateRequest.middleware.js";
import { getMeController, loginController, logoutController, refreshTokenController, registerController } from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

let userRouter = express.Router();

userRouter.post(
  "/register",
  registerValidator,
  validateRequest,
  registerController,
);

userRouter.post("/login",loginValidator,validateRequest,loginController);

userRouter.get("/me",authMiddleware,getMeController);

userRouter.delete("/logout",logoutController);

userRouter.post("/refreshToken",refreshTokenController);

export default userRouter;