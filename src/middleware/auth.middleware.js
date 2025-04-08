import  User  from "../models/user.model.js";

import Jwt  from "jsonwebtoken";
const veriftyJWT = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization").replace("Bearer ", "")
        if (!token) {
            throw new ApiError(401, "Unauthorized acces")
        }
      console.log("Auth middleware called")
    
        const decodedToken = await Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            //NEXT TODO
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user;
        req.userId = user._id;
        next();
    } catch (error) {
        throw new ApiError(401,"Invalid acccess token ")
    }
}

const isAdmin = async (req, res, next) => {
  const token = req.cookies?.accessToken || req.header("Authorization").replace("Bearer ", "")
  if (!token) {
    throw new ApiError(401, "Unauthorized access")
  }
  const decodedToken = await Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
  const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
  if (!user) {
    throw new ApiError(401, "Invalid Access Token")
  }
  if (user.role !== "admin") {
    throw new ApiError(403, "Forbidden")
  }
  req.user = user;
  req.userId = user._id;
  req.role = user.role;
  next();
}

export {
  isAdmin,
  veriftyJWT
}