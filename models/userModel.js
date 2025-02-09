import mongoose, { Schema } from "mongoose";

const userSchema=new Schema({
    phone:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    address:{
        type:String,
        
    },
    createdAt:{
        type:Date,
        default:Date.now,
        default:Date.now

    }

})

const User = mongoose.model("User",userSchema)

export default User;