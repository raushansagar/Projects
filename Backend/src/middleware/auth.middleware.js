
import { User } from "../models/user.model.js";
import  jwt  from 'jsonwebtoken';
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";


const verifyJWT = asyncHandler( async(req, res, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "")?.trim();

        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }

        const decodeInfoToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodeInfoToken?._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid User Access");
        }

        req.user = user;
        next()
    }
    catch(error){
        throw new ApiError(401, "Invalid User Access!");
    }
})







export { verifyJWT };