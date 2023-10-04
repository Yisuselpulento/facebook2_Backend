import Post from "../models/Posts.js"


const getGlobalPost = async (req , res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).exec();

        res.json(posts)
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los posts", error: error.message });
    }
}

const getAllPostsUsers = async (req , res) => {

}


const newPost = async (req , res) => {
    const newPost = new Post({
        content: req.body.content
    });
    newPost.author = req.usuario._id;
    newPost.NameAuthor = req.usuario.nombre
  
    try {
      const postSave = await newPost.save();
      res.json(postSave);
    } catch (error) {
      console.log("error al crear post", error);
    }
    
}

const getPost = async (req , res) => {
    
}

const deletePost = async (req , res) => {
    
}

export {
    getGlobalPost,
    getAllPostsUsers,
    newPost,
    getPost,
    deletePost
}