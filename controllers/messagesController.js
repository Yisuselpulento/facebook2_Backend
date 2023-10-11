import Message from "../models/Mensajes.js"


const sendMessages = async (req, res) => {
   
    try {
        const message = new Message({
            content :req.body.content,
            user : req.usuario._id
        }); 
        await message.save()

        const populatedMessage = await Message.findById(message._id).populate({
            path: 'user',
            select: 'nombre _id image' 
        });

        res.json(populatedMessage)
    } catch (error) {
        console.error("Error al guardar el mensaje", error);
        res.status(500).json({ error: "Error al guardar el mensaje" })
    }
    
}

const getMessages = async (req , res) => {
    try {
       
        const messages = await Message.find()
            .populate('user', 'nombre image') 
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