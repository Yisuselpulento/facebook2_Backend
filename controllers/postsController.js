import Post from "../models/Posts.js"


const getGlobalPost = async (req , res) => {
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

        res.json(posts)
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los posts", error: error.message });
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

        // Populamos el post guardado con la información detallada del autor.
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
        console.log("error al crear post", error);
        res.status(500).json({ message: "Error al crear el post", error: error.message });
    }
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

const giveLike = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.usuario._id;
        const userName = req.usuario.nombre;
        const userImage = req.usuario.image;
        const post = await Post.findById(postId);

        if (!userId) {
            return res.status(404).send({ message: "Usuario no encontrado." });
        }

        if (!post) {
            return res.status(404).send({ message: "Post no encontrado." });
        }

        if (!post.likes) {
            post.likes = [];
        }

        const likeIndex = post.likes.findIndex(like => like.userId.equals(userId));

        let hasLiked;
        if (likeIndex !== -1) {
            post.likes.splice(likeIndex, 1);
            hasLiked = false;
        } else {
            post.likes.push({ userId, userName, userImage });
            hasLiked = true;
        }

        await post.save();

        res.status(200).send({
            likesCount: post.likes.length,
            hasLiked,
            user: {
                userId,
                userName,
                userImage
            },
            likesUsers: post.likes
        });
    } catch (error) {
        res.status(500).send({ message: "Error al procesar la solicitud.", error: error.message });
    }
};

export {
    getGlobalPost,
    newPost,
    deletePost,
    giveLike
}