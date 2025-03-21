import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const jwtAuthentication=(req,res,next)=>{
    const token = req.header('authentication');

    if(token){
        try {
            const {userId} =jwt.verify(token,process.env.SECRET);
            req.userId = userId;
            console.log("user is ",req.userId);
        } catch (error) {
            console.log(`error`, error);
        }
        
        next();


    }else{
        res.status(400).json({error:"Token is not valid"});

    }
}


