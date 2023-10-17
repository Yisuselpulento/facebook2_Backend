import express from "express";
import dotenv from "dotenv";
 import cors from "cors"; 
import conectarDB from "./config/db.js";
import usuarioRoutes from "./routes/usuarioRoutes.js"
import postsRoutes from "./routes/postsRoutes.js"
import commentRoutes from "./routes/commentRoutes.js"
import messageRoutes from "./routes/messageRoutes.js"
import { sendMessages } from "./controllers/messagesController.js";

const app = express();
app.use(express.json());

dotenv.config();

conectarDB();

 const whitelist = [process.env.FRONTEND_URL];

/* const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Error de Cors"));
    }
  },
}; */

const corsOptions = {
  origin: process.env.FRONTEND_URL,
};

app.use(cors(corsOptions)); 


app.use("/api/usuarios", usuarioRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/messages", messageRoutes);


const PORT = process.env.PORT || 4000;
const servidor = app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

import { Server } from 'socket.io'

const io = new Server(servidor , {
  pingTimeout: 60000,
  cors : {
    origin : process.env.FRONTEND_URL
  }
})

io.on("connection", (socket) => {
  console.log('Usuario conectado');

   socket.on('send_message', (data) => {
    console.log(data)
     
     io.emit('receive_message', {
      content : data.content
    });  
  });



  socket.on('disconnect', () => {
      console.log('Usuario desconectado')
    
  });

  
})