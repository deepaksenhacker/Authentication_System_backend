import express from 'express';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import { jwtAuthentication } from '../config/JwtConfig.js';
dotenv.config();

const router = express.Router();


// getuser

router.get('/getuser',jwtAuthentication,async(req,res)=>{
    const userid = req.userId;
    try {
        const user = await userModel.findById({_id:userid}).select('-password');
        res.json({user});               

    } catch (error) {
        res.json({error:"Server error"});
    }

})


router.post('/sign-in',async(req,res)=>{
    const {email,password}= req.body;
    try {
        if(!email || !password ){
            return res.json({error:"Fill All Details "});
        }
        const existingUser = await userModel.findOne({email:email});
        if(!existingUser){
           return res.json({error:"User is not sign up"});
        };
        const checkPassword =await bcrypt.compare(password,existingUser.password);
        if(!checkPassword){
            return res.json({error:"Password or Email Wrong"});
        }
        const token = jwt.sign({userId:existingUser._id},process.env.SECRET,{expiresIn:"1h"});
        if(token){
            return res.json({token})
        };

    } catch (error) {
        console.log(error);
        res.json({error:"Server Error"})
    }

})

router.post('/sign-up', async (req, res) => {
    const { email, password, name, phone } = req.body;

    try {
        if (!email || !password || !name || !phone) {
            return res.json({ error: "Fill all details" });
        }

        // Use findOne() instead of find()
        const existingUser = await userModel.findOne({ email: email });

        if (existingUser) {
            return res.json({ error: "User is already signed up" });
        }

        // Hash password before saving
        const round = 12;
        const encryptedPassword = await bcrypt.hash(password, round);

        const user = new userModel({
            email,
            password: encryptedPassword,
            name,
            phone
        });

        await user.save();
         res.json({ success: "Successfully signed up with email!" });

    } catch (error) {
        console.error(error);
        res.json({ error: "Server error" });
    }
});



export default router