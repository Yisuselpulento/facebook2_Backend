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
    try {
        const posts = await Post.find({ author: req.params.userId }).sort({ createdAt: -1 }).exec();
        
        if (!posts || posts.length === 0) {
            return res.status(404).json({ message: 'No se encontraron posts para este usuario' });
        }
        
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error al obtener los posts del usuario' });
    }


}


const newPost = async (req , res) => {

    const newPost = new Post({
        content: req.body.content
    });
    newPost.author = req.usuario._id;
    newPost.NameAuthor = req.usuario.nombre
    newPost.image = req.usuario.image;
  
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

    try {
        const post = await Post.findById(req.params.id);
        
         if (!post) {
            return res.status(404).json({ error: 'Post no encontrado' });
        }
        
        if (post.author.toString() !== req.usuario._id.toString()) {
            return res.status(403).json({ error: 'No tienes permiso para eliminar este post' });
        }
        
        await post.deleteOne();
        res.json({ success: 'Post eliminado con éxito' });   
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error al eliminar el post' })
    }
}

export {
    getGlobalPost,
    getAllPostsUsers,
    newPost,
    getPost,
    deletePost
}