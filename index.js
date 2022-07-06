import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import getPostes from "./routes/postes.js"
import getUser from "./routes/user.js"
import dotenv from 'dotenv'

const app=express();
dotenv.config()
app.use(bodyParser.json({limit: '30mb', extended: true}));
app.use(bodyParser.urlencoded({ limit: '30mb' , extended: true }));
app.use(cors());
app.use('/post', getPostes)
app.use('/user', getUser)
app.get('/', (req, res)=>{
     res.send('hello to San3a api')
})
//databse connection
//MONGODB_URI='mongodb+srv://chaima:chaima104@cluster0.rvmoq.mongodb.net/?retryWrites=true&w=majority'
const PORT = process.env.PORT|| 5000;
//app.listen(PORT, ()=>console.log(`Server Running on port :${PORT} `))
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
     .then(()=> app.listen(PORT, ()=>console.log(`Server Running on port :${PORT} `)))
     .catch((error)=> console.log(error.message));


