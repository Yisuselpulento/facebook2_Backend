import Post from "../models/Posts.js"

const getGlobalPost = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', 'image nombre')
            .populate({
                path: 'comments',
                populate: {
                    path: 'author',
                    select: 'nombre'
                }
            })
            .sort({ createdAt: -1 })
            .exec();
        
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los posts" });
    }
}

const newPost = async (req, res) => {
    const newPost = new Post({
        content: req.body.content,
        author: req.usuario._id,
        NameAuthor: req.usuario.nombre,
        image: req.usuario.image,
        likes: []
    });

    try {
        await newPost.save();
        const populatedPost = await Post.findById(newPost._id)
            .populate('author', 'image nombre')
            .populate({
                path: 'comments',
                populate: {
                    path: 'author',
                    select: 'nombre'
                }
            })
            .exec();
        
        res.json(populatedPost);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el post" });
    }
}

const deletePost = async (req, res) => {
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
        res.status(500).json({ error: 'Hubo un error al eliminar el post' });
    }
}

const giveLike = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.usuario._id;
        const userName = req.usuario.nombre;
        const userImage = req.usuario.image;

        if (!userId) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post no encontrado." });
        }

        const userAlreadyLiked = post.likes.some(like => like.userId.equals(userId));

        if (userAlreadyLiked) {
            await Post.findByIdAndUpdate(postId, {
                $pull: { likes: { userId } }
            });
        } else {
            await Post.findByIdAndUpdate(postId, {
                $push: { likes: { userId, userName, userImage } }
            });
        }

        // Recuperar el post después de la actualización para obtener la lista actualizada de "likes"
        const updatedPost = await Post.findById(postId);

        res.json({
            likesCount: updatedPost.likes.length,
            hasLiked: !userAlreadyLiked,
            user: { userId, userName, userImage },
            likesUsers: updatedPost.likes
        });

    } catch (error) {
        res.status(500).json({ message: "Error al procesar la solicitud." });
    }
};

export {
    getGlobalPost,
    newPost,
    deletePost,
    giveLike
}
