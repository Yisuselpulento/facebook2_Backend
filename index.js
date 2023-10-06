import express from "express";
import dotenv from "dotenv";
 import cors from "cors"; 
import conectarDB from "./config/db.js";
import usuarioRoutes from "./routes/usuarioRoutes.js"
import postsRoutes from "./routes/postsRoutes.js"
import commentRoutes from "./routes/commentRoutes.js"

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


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});