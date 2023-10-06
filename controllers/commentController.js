import Comment from "../models/Comentarios.js"
import Post from "../models/Posts.js"


const getComments = async (req , res) => {

  try {
    const comments = await Comment.find({ post: req.params.postId }).populate('author', 'nombre');
    res.json(comments);
} catch (error) {
    res.status(500).json({ error: 'Hubo un error al obtener los comentarios' });
}
    
}


const newComment = async (req , res) => {

  const { postId } = req.params
 
   try {
    const newComment = new Comment({
      content: req.body.content,
      author : req.usuario._id,
      post : postId,
      NameAuthor : req.usuario.nombre
  });

  const commentSave = await newComment.save();
  res.json(commentSave);
  } catch (error) {
    console.log(error)
  }
        
}


const deleteComment = async (req , res) => {

  try {
    const comment = await Comment.findById(req.params.commentId);
    
    if (!comment) {
        return res.status(404).json({ error: 'Comentario no encontrado' });
    }

    if (comment.author.toString() !== req.usuario._id.toString()) {
        return res.status(403).json({ error: 'No tienes permiso para eliminar este comentario' });
    }

    await comment.deleteOne();
    res.json({ success: 'Comentario eliminado con éxito' });
} catch (error) {
    res.status(500).json({ error: 'Hubo un error al eliminar el comentario' });
}
    
}

export {
  getComments,
    newComment,
    deleteComment
}