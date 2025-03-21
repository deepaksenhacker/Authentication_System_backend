import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    timestamp:{
        type:Date,
        default:Date.now
    }

});



const userModel = mongoose.model('user',userSchema);

export default userModel;


