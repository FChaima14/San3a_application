import mongoose from "mongoose";

const postSchema=mongoose.Schema({
    title: String,
    description: String,
    image: String,
    tags:[String],
    name: String,
    creator:String, 
    likes:{
        type:[String],
        default:[],
    },
    created_at:{
        type: Date,
        default: new Date(),
    }

});

const post=mongoose.model('postModel', postSchema);
export default post;
