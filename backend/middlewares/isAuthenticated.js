import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler"
import { ApiError } from "../utils/apiError"
import { User } from "../models/user.model"


export const isAuthenticated = asyncHandler(async(req , res ,next)=>{

    try {
        const token = req.cookies?.accesToken || req.header("Authorisation")?.replace("Bearer","")

        if(!token){
            throw new ApiError(401 , "Unauthorized request")
        }
        const decodeToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodeToken)
        console.log(user)

        if(!user){
            throw new ApiError(401,"invalid access token")
        }

        req.user = user
        next();

    } catch (error) {
        throw new ApiError(401,error?.message || "invalid access token")
    }

})





