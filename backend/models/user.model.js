import mongoose from "mongoose"
import  jwt  from "jsonwebtoken"
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    role:{
        type:String,
        required:true,
        enum:['admin' , 'manager' , 'user']
    },
    status:{
        type:String,
        required:true,
        enum:['active' , 'inActive']
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    updatedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    refreshToken: {
    type: String
    }

},{timestamps:true})



userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            role:this.role
        },
        process.env.ACCESS_TOKEN_SECRET
        ,
        {
            expiresIn:"15m"
        }
    )
}


userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:"7d"
        }
    )
}








export const User = mongoose.model( 'User' , userSchema)