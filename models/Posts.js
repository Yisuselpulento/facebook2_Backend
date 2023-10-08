import mongoose from "mongoose";


const postSchema =  mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',  
        required: true
    },
    NameAuthor: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    image: {
        type: String,
         
    },
});

const Post = mongoose.model('Post', postSchema);

export default Post;
