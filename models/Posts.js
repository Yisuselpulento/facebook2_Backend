import mongoose from "mongoose";


const postSchema =  mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    likes: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Usuario'
        },
        userName: String,
        userImage: String
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',  
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },   
});

const Post = mongoose.model('Post', postSchema);

export default Post;
