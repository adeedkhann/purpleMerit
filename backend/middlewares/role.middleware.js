import { User } from "../models/user.model";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler"


export const authorizeRole = (allowedRole)=>{
    return asyncHandler(async(req , res , next)=>{
        const user = req.user;
        if(!user){
            throw new ApiError(403,"user not authorised")
        }
        if(user.role !== allowedRole.toLowerCase()){
            throw new ApiError(403 , `Access denied this operation is for ${allowedRole} only`)
        }

        next();

    })
}