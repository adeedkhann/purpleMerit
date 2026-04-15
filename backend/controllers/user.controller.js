import {asyncHandler} from "../utils/asyncHandler.js"
import {apiError} from "../utils/apiError.js"
import {ApiResponse, apiResponse} from "../utils/apiResponse.js"
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

export const loginUser = asyncHandler(async(req,res)=>{
   const {email , password} = req.body

   if(!email || !password){
    throw new apiError(401 , "all fields are required")
   }




   const user = await User.findOne({email})
   if(!user){
    throw new apiError(404 , "user not found")
   } 

   const isPasswordValid = await bcrypt.compare(password,user.password)
   if(!isPasswordValid){
    throw new apiError(401,"invalid credentials")
   }


   const accessToken = user.generateAccessToken();
   const refreshToken = user.generateRefreshToken();

   const loggedInUser = await User.findById(user._id).select("-password")

   const options ={
    httpOnly :true,
    secure:true
   }


   return res.status(200)
   .cookie("accessToken",accessToken , options)
   .cookie("refreshToken",refreshToken,options)
   .json(
    new ApiResponse(200,
        {user:loggedInUser ,accessToken , refreshToken},
        "User logged in Succesfully"
    )
   )


})


export const getAllUser = asyncHandler(async(req,res)=>{
    if(!req.user){
        throw new apiError(404 , "user not authenticated")
    }
    const allUsers = await User.find({
        _id:{$ne : req.user._id}
    }).select("-password")
    

    if(!allUsers){
        throw new apiError(500 , "Error while fetching users")
    }

    return res.status(200).json(
        new apiResponse(200 , allUsers , "All user fetched successfully")
    )

})


export const changeStatus = asyncHandler(async (req, res) => {

    const { targetUserId, newStatus, newRole } = req.body;

    const adminId = req.user._id; 

    if (!targetUserId) {
        throw new apiError(400, "Target User ID is required");
    }
    const updatedUser = await User.findByIdAndUpdate(
        targetUserId,
        { 
            status: newStatus, 
            role: newRole, 
            updatedBy: adminId 
        },
        { new: true }
    ).select("-password");

    if (!updatedUser) {
        throw new apiError(404, "Target user not found");
    }

    return res.status(200).json(
        new apiResponse(200, updatedUser, "User updated successfully by Admin")
    );
});

export const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        { $unset: { refreshToken: 1 } }, 
        { new: true }
    );

    const options = {
        httpOnly: true,
        secure: true
    };
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new apiResponse(200, {}, "User logged out successfully"));
});