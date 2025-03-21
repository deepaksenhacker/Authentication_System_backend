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
    try {
        const { email, password, name, phone } = req.body;
        console.log("Received signup data:", req.body);

        if (!email || !password || !name || !phone) {
            return res.status(400).json({ error: "Fill all details" });
        }

        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ error: "User is already signed up" });
        }

        const saltRounds = 12;
        const encryptedPassword = await bcrypt.hash(password, saltRounds);

        const user = new userModel({
            email,
            password: encryptedPassword,
            name,
            phone
        });

        await user.save();
        res.status(201).json({ success: "Successfully signed up with email!" });

    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


export default router