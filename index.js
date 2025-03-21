import express from 'express';
import morgan from 'morgan';
import router from './routes/user.js'
import dbConnect from './config/db.js';
import cors from 'cors'
import 'dotenv/config.js'


const app = express()
dbConnect();



// const corspolicy ={
//       origin:'http://localhost:5173',
//       methods:"GET,POST",
//       credentials:true

//     }
app.use(cors(corspolicy));


app.use(morgan('dev'))

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/user',router);


app.get('/',(req,res)=>{
    res.send('Server is start ')
})


app.listen(3000 || process.env.PORT ,()=>{
    console.log('Server is ready');
})

