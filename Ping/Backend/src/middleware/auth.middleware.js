import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from 'jsonwebtoken';

const verifyJWT = asyncHandler(async (req, res, next) => {
  
  try {
    // Get token from cookie or Authorization header
    const token =
      req.cookies?.accessToken ||
      req.headers?.authorization?.replace("Bearer ", "")?.trim();

    if (!token) {
      throw new ApiError(401, "Unauthorized request: No token provided");
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Fetch user by id from decoded token
    const user = await User.findById(decoded.id).select("-password -refreshToken");

    if (!user) {
      throw new ApiError(401, "Unauthorized request: User not found");
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new ApiError(401, "Access token expired"));
    } else if (error.name === "JsonWebTokenError") {
      return next(new ApiError(401, "Invalid access token"));
    } else {
      return next(new ApiError(401, error.message || "Unauthorized request"));
    }
  }
});

export { verifyJWT };
