import Comment from "../models/Comentarios.js"
import Post from "../models/Posts.js"


const getGlobalComment = async (req , res) => {
    
}


const newComment = async (req , res) => {

 
/*   try {
    const newComment = new Comment({
      content: req.body.content
  });
  newComment.author = req.usuario._id;
  newComment.NameAuthor = req.usuario.nombre
  newComment.post = 

  const commentSave = await newComment.save();
  res.json(commentSave);
  
  } catch (error) {
    console.log(error)
  }
     */

/*   const { post } = req.body

  const exist = await Post.findById(post)

   if(!exist) {
    const error = new Error("No existe el post")
    return res.status(404).json({ msg : error.message})
  }  */

    
}


const deleteComment = async (req , res) => {
    
}

export {
    getGlobalComment,
    newComment,
    deleteComment
}