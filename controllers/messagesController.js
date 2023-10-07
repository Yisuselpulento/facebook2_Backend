import Message from "../models/Mensajes.js"


const sendMessages = async (req, res) => {
   
    try {
        const message = new Message({
            content :req.body.content,
            user : req.usuario._id,
            NameAuthor : req.usuario.nombre
        });  // data debe tener { content, user: userId }
        await message.save()
        res.json(message)
    } catch (error) {
        console.error("Error al guardar el mensaje", error);
    }
    
}

const getMessages = async (req , res) => {
    try {
        // Obtiene los mensajes y la información del usuario relacionado.
        const messages = await Message.find()
            .populate('user', 'nombre') // Solo obtiene el campo 'username', excluye el '_id'
            .sort({ timestamp: 1 });
        
        res.json(messages);
    } catch (error) {
        console.error("Error al obtener los mensajes", error);
        res.status(500).json({ error: "Error al obtener los mensajes" });
    }


}



export {
    getMessages,
    sendMessages,
    
}