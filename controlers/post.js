import mongoose from "mongoose";
import post from '../models/Postes.js';

//get post method to fetch alll the post api
export const getPost=async(req, res) =>{
    const {page}=req.query
    try{
         const LIMIT= 8
         const startIndex=(Number(page)-1)*LIMIT // start index in the page
         const totale= await post.countDocuments({}) // count all the post in dataset
         const posts= await post.find().sort({_id: -1}).limit(LIMIT).skip(startIndex); //find all the post in the cuenrnt page sorted by the Id
         res.status(200).json({ data: posts, 
                                currentPage: Number(page),
                                numberOfPages: Math.ceil(totale/LIMIT)})
    } catch(error){
        res.status(404).json({'message': error.message})
    }
}
//get one post detail by id
export const getPostById=async(req, res) =>{
    const {id}=req.params
    try{
        const data= await post.findById(id)
        res.status(200).json({data: data})
    } catch(error){
        res.status(404).json({'message': error.message})
    }
}
//create new post method
export const createPost=async(req, res) =>{
    const Post= req.body; //get the body of the request
    const newPost= new post({...Post, creator: req.userId, createsAt:new Date().toISOString()}) //create new post model
    try{
        await newPost.save(); //save the post in the dataset
        res.status(201).json(newPost); //201 is the http code that maintain the post creation
    }catch(error){
        res.status(409).json({'message': error.message});// 409 is the code when the post not created succusfuly
    }
}
//update a post related to a Id
export const updatePost=async(req, res) =>{
    const {id : _id}=req.params;  //get the id 
    const updatedPost=req.body; // get the body of request
    if(!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(404).send('No object match to this Id') // in the case of the id is not exist the server return 404 not found
    }
    const newPost=await post.findByIdAndUpdate(_id, updatedPost, {new :true} );
    res.json(newPost)
}

//delete a post related to an Id 
export const deletePost= async(req, res)=>{
    const {id}=req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).send('No object match to this Id')
    }
    await post.findByIdAndRemove(id)
    res.json({"message": "post deleted successfuly"})
}
//like functionality
export const likePost=async(req, res)=>{
    const {id}=req.params;
    if(!req.userId) return res.json({ message: 'user unauthenticated'})
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).send('No object match to this Id')
    }
    const newPost= await post.findById(id);
    const index= newPost.likes.findIndex((id)=>id ===String(req.userId));
    if(index === -1){
        newPost.likes.push(req.userId)
    }else{
        newPost.likes=newPost.likes.filter((id)=>id !== String(req.userId));
    }
    const resPsot=await post.findByIdAndUpdate(id, newPost, {new: true})
    res.json(resPsot);
}

//search functionality

export const searchPost=async(req, res)=>{
    const {searchQuery, tags} =req.query
    try{
        const title= new RegExp(searchQuery, 'i')  //get the upperCase and the lowerCase title
        const posts=await post.find({ $or: [{title}, {tags: { $in: tags.split(',')}}] })
        res.json({data: posts})
    }catch(error){
        res.status(404).json({'message': error.message});
    }
}