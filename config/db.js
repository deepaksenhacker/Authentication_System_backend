import mongoose from "mongoose";
import 'dotenv/config'
const dbConnect =async()=>{
    
try {
    await mongoose.connect(process.env.MONGODB)
    console.log('Connected to Database');
} catch (error) {
    console.log(error);    
}

}


export default dbConnect;