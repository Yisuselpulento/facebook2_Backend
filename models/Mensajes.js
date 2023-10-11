import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
});

const Message = mongoose.model('Message', messageSchema);

export default Message;