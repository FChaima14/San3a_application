import User from '../models/user.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

//signUp fonction backend
export const SignUp=async(req, res)=>{
    const {email, firstName, lastName, password, confirmPassword}=req.body;
    try{
        const existUser=await User.findOne({ email });
        if (existUser) return res.status(400).json({message : 'user allready exist '});
        if (password !== confirmPassword) return res.status(400).json({message: 'password dont match'});
        const hachedPassword= await bcrypt.hash(password, 12);
        const result=await User.create({email, password: hachedPassword, username: `${firstName}${lastName}` })
        const token= jwt.sign({email: result.email, id: result._id}, 'test', {expiresIn: '1h'});
        res.status(200).json({result , token})

    }catch(error){
        res.status(500).json({message: error})
    }

}

//SignIn backend 
export const SignIn=async(req, res)=>{
    const {email, password}=req.body;
    try{
        const existUser=await User.findOne({email})
        if(!existUser) return res.status(400).json({ message: 'user not exist' });
        const isPwdCorrect=await bcrypt.compare(password, existUser.password);
        if(!isPwdCorrect) return res.status(400).json({message: 'bad authentication'})
        const token= jwt.sign({email: existUser.email, id: existUser._id}, 'test' , {expiresIn: '1h'});
        res.status(200).json({ result: existUser, token});
    }catch(error){
        res.status(500).json('something get wrong')
    }

}