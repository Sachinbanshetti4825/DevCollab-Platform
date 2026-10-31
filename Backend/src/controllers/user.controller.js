import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { randomBytes, createHash } from "node:crypto";
import Refresh from "../models/refreshToken.model.js";
import mongoose from "mongoose";
export async function registerController(req, res) {
  let { username, email, password } = req.body;

  let isAlreadyExists = await User.findOne({
    email: email,
  });

  if (isAlreadyExists) {
    return res.status(409).json({
      success: false,
      message: "user already exists",
    });
  }

  const hash = await bcrypt.hash(password, 10);

  let user = await User.create({
    username,
    email,
    password: hash,
  });

  return res.status(201).json({
    success: true,
    message: "user created successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

export async function loginController(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid Credentials",
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid Credentials",
    });
  }

  // 1. Generate Access Token (15 minutes)
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "10s",
  });

  // 2. Generate a random Refresh Token
  const refreshToken = randomBytes(64).toString("hex");

  // 3. Hash the Refresh Token using SHA-256
  const tokenHash = createHash("sha256").update(refreshToken).digest("hex");

  // 4. Set Refresh Token expiry (30 days)
  const refreshTokenMaxAge = 30 * 24 * 60 * 60 * 1000;

  const expiresAt = new Date(Date.now() + refreshTokenMaxAge);

  // 5. Store the hashed Refresh Token in MongoDB
  await Refresh.create({
    user: user._id,
    tokenHash,
    expiresAt,
  });

  // 6. Set Access Token cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge:10*1000,
    path: "/",
  });

  // 7. Set Refresh Token cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: refreshTokenMaxAge,
    path: "/",
  });

  // 8. Send successful response
  return res.status(200).json({
    success: true,
    message: "User logged in successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

export function getMeController(req, res) {
  const user = req.user;

  return res.status(200).json({
    success: true,
    message: "user fetched successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

export async function logoutController(req, res) {
  try {
    const refreshToken = req.cookies?.refreshToken;

    // 1. Check whether refresh token exists.
    if (!refreshToken) {
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });

      res.clearCookie("refreshToken", {
        httpOnly: true,                                                                               
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });

      return res.status(200).json({
        success: true,
        message: "User logged out successfully",
      });
    }

    // 2. Hash the refresh token.
    const tokenHash = createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    // 3. Find the token record in the database.
    const existingToken = await Refresh.findOne({
      tokenHash,
    });

    // 4. Revoke the refresh token if it exists and is active.
    if (existingToken && !existingToken.revokedAt) {
      await Refresh.updateOne(
        {
          _id: existingToken._id,
          revokedAt: null,
        },
        {
          $set: {
            revokedAt: new Date(),
          },
        }
      );
    }

    // 5. Clear authentication cookies.
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    // 6. Send logout response.
    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during logout",
    });
  }
}




export async function refreshTokenController(req, res) {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "Refresh token missing",
    });
  }

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not configured");

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }

  const tokenHash = createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const refreshTokenMaxAge = 30 * 24 * 60 * 60 * 1000;
  const accessTokenMaxAge = 15 * 60 * 1000;

  const dbSession = await mongoose.startSession();

  let newRefreshToken;
  let newAccessToken;

  try {
    await dbSession.withTransaction(async () => {
      // 1. Find the refresh-token record.
      const existingToken = await Refresh.findOne({
        tokenHash,
      }).session(dbSession);

      if (!existingToken) {
        const error = new Error("Invalid refresh token");
        error.statusCode = 401;
        throw error;
      }

      // 2. Check whether the token has expired.
      const now = new Date();

      if (existingToken.expiresAt <= now) {
        const error = new Error("Refresh token expired");
        error.statusCode = 401;
        throw error;
      }

      // 3. Check whether the token was already revoked.
      if (existingToken.revokedAt) {
        const error = new Error("Refresh token revoked");
        error.statusCode = 401;
        throw error;
      }

      // 4. Atomically revoke the old refresh token.
      const revokedToken = await Refresh.findOneAndUpdate(
        {
          _id: existingToken._id,
          revokedAt: null,
          expiresAt: { $gt: now },
        },
        {
          $set: { revokedAt: now },
        },
        {
          new: true,
          session: dbSession,
        }
      );

      if (!revokedToken) {
        const error = new Error(
          "Refresh token already used or expired"
        );
        error.statusCode = 401;
        throw error;
      }

      // 5. Generate a new refresh token.
      newRefreshToken = randomBytes(64).toString("hex");

      // 6. Hash the new refresh token for database storage.
      const newRefreshTokenHash = createHash("sha256")
        .update(newRefreshToken)
        .digest("hex");

      // 7. Calculate the new refresh token's expiry date.
      const expiresAt = new Date(
        Date.now() + refreshTokenMaxAge
      );

      // 8. Save the new token record.
      await Refresh.create(
        [
          {
            user: existingToken.user,
            tokenHash: newRefreshTokenHash,
            expiresAt,
          },
        ],
        {
          session: dbSession,
        }
      );

      // 9. Generate a new access token.
      newAccessToken = jwt.sign(
        {
          id: existingToken.user,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "10s",
        }
      );
    });

    // 10. Send cookies only after the transaction succeeds.
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: refreshTokenMaxAge,
      path: "/",
    });

    res.cookie("token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 10*1000,
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Tokens refreshed successfully",
    });
  } catch (error) {
    console.error("Refresh token error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.statusCode === 401
          ? error.message
          : "Internal Server Error",
    });
  } finally {
    await dbSession.endSession();
  }
}

