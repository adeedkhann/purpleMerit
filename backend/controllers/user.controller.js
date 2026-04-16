import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

export const registerUser = asyncHandler(async(req , res)=>{
    const {name , email , password , role , createdBy , status} = req.body;

    if(!name || !email || !password || !role || !status){
        throw new ApiError(400 , "all fields are required")
    }


    const existUser =await User.findOne({email})
    if(existUser){
        throw new ApiError(400 , "user already exists please log in")
    }

    const hashPassword = await bcrypt.hash(password , 10)

   const user = await User.create({
    name,
    email,
    password: hashPassword,
    role: role.toLowerCase(),
    status,
    // If req.user exists (Admin is logged in), use their ID. 
    // Otherwise, use the provided createdBy or null for the first user.
    createdBy: req.user?._id || createdBy || null 
})

    const createdUser= await User.findById(user._id).select("-password")
    if(!createdUser){
        throw new ApiError(400 , "error while registering the user")
    }
    
    return res.status(200).json(
        new ApiResponse(200 , createdUser , " user registered successfully")
    )

})

export const loginUser = asyncHandler(async(req,res)=>{
   const {email , password} = req.body

   if(!email || !password){
    throw new ApiError(401 , "all fields are required")
   }




   const user = await User.findOne({email}).select("+password");
   if(!user){
    throw new ApiError(404 , "user not found")
   } 

   if(user.status === "inActive"){
    throw new ApiError(403 , "user is inactive")
   }

   const isPasswordValid = await bcrypt.compare(password,user.password)
   if(!isPasswordValid){
    throw new ApiError(401,"invalid credentials")
   }


   const accessToken = user.generateAccessToken();
   const refreshToken = user.generateRefreshToken();

user.refreshToken = refreshToken;
await user.save({ validateBeforeSave: false });


   const loggedInUser = await User.findById(user._id).select("-password")

 const options = {
    httpOnly: true,
    secure: true, 
    sameSite: 'None',
    maxAge: 7 * 24 * 60 * 60 * 1000 
};


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

export const getAllUser = asyncHandler(async (req, res) => {
    // Extract query params for search, filter, and pagination 
    const { page = 1, limit = 10, search = "", role, status } = req.query;

    const query = {
        _id: { $ne: req.user._id }, // Exclude self
        $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } }
        ]
    };

    // Add optional filters
    if (role) query.role = role;
    if (status) query.status = status;

    const users = await User.find(query)
        .select("-password")
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

    const count = await User.countDocuments(query);

    return res.status(200).json(
        new ApiResponse(200, {
            users,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page),
            totalUsers: count
        }, "Users fetched successfully")
    );
});

export const changeStatus = asyncHandler(async (req, res) => {

    const { targetUserId, newStatus, newRole } = req.body;
    const adminId = req.user._id; 

    if (!targetUserId) {
        throw new ApiError(400, "Target User ID is required");
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
        throw new ApiError(404, "Target user not found");
    }

    return res.status(200).json(
        new ApiResponse(200, updatedUser, "User updated successfully by Admin")
    );
});
export const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user?._id,
        { 
            $set: { refreshToken: undefined } 
        }, 
        { new: true }
    );

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'None' 
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});


export const getUserDetails = asyncHandler(async (req, res) => {
   const userId = req.params.userId || req.user?._id;
    const user = await User.findById(userId).select("-password");
    if (!user) throw new ApiError(404, "User not found");

    return res.status(200).json(
        new ApiResponse(200, user, "User details fetched")
    );
});

export const updateAccountDetails = asyncHandler(async(req, res) => {
    const { name, email } = req.body;

    if (!name && !email) {
        throw new ApiError(400, "Name or email are required");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        { $set: { name, email } },
        { new: true }
    ).select("-password");

    return res.status(200).json(
        new ApiResponse(200, user, "Account details updated successfully")
    );
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request: No refresh token provided");
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        
        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(401, "Invalid refresh token: User no longer exists");
        }
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or already used");
        }

        const accessToken = user.generateAccessToken();
        const newRefreshToken = user.generateRefreshToken();

        user.refreshToken = newRefreshToken;
        await user.save({ validateBeforeSave: false });

        const options = { httpOnly: true, secure: true };

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, "Access token refreshed"));

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});
export const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id).select("+password");

    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password");
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse(200, {}, "Password changed successfully")
    );
});

export const adminCreateUser = asyncHandler(async (req, res) => {
    const { name, email, role, status } = req.body;

    if ([name, email, role].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashPassword = await bcrypt.hash(tempPassword, 10);

    const newUser = await User.create({
        name,
        email,
        password: hashPassword,
        role,
        status: status || "active",
        createdBy: req.user._id
    });

    return res.status(201).json(
        new ApiResponse(201, { user: newUser, tempPassword }, "User created by Admin")
    );
});

export const deleteUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    
    const user = await User.findByIdAndDelete(userId);
    
    if (!user) throw new ApiError(404, "User not found");

    return res.status(200).json(
        new ApiResponse(200, {}, "User deleted successfully from database")
    );
});