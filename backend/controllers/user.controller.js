import {asyncHandler} from "../utils/asyncHandler.js"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt"

export const registerUser = asyncHandler(async(req , res)=>{
    const {name , email , password , role , createdBy , status} = req.body;

    if(!name || !email || !password || !role || !createdBy || !status){
        throw new apiError(400 , "all fields are required")
    }


    const existUser =await User.findOne({email})
    if(existUser){
        throw new apiError(400 , "user already exists please log in")
    }

    const hashPassword = await bcrypt.hash(password , 10)

    const user = await User.create({
        name,
        email,
        password:hashPassword,
        role:role.toLowerCase(),
        status,
        createdBy
    })

    const createdUser= await User.findById(user._id).select("-password")
    if(!createdUser){
        throw new apiError(400 , "error while registering the user")
    }
    
    return res.status(200).json(
        new apiResponse(200 , createdUser , " user registered successfully")
    )

})



