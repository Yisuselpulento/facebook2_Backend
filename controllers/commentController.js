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
  const { postId } = req.params;
  try {

    const newComment = new Comment({
        content: req.body.content,
        author: req.usuario._id,
        post: postId
    });

    const savedComment = await newComment.save();
     const populatedComment = await Comment.findById(savedComment._id).populate('author', 'nombre');
    const postToUpdate = await Post.findById(postId);
    if (!postToUpdate) {
        return res.status(404).json({ message: "Post no encontrado" });
    }
    postToUpdate.comments.push(savedComment._id);
    await postToUpdate.save();

    // Devolver el comentario poblado
    res.json(populatedComment);

  } catch (error) {
    console.log("Error al crear comentario:", error); 
    res.status(500).json({ error: 'Hubo un error al crear el comentario', details: error.message });
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