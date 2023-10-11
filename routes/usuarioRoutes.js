import express from "express";
const router = express.Router();
import {
  registrar,
  autenticar,
  confirmar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  perfil,
  getAllUsers,
  actualizarUsuario,
  upload,
  avatar,
  getperfilUser,
  buscarPorNombre
} from "../controllers/usuarioController.js";

import checkAuth from "../middleware/checkAuth.js";
import multer from 'multer'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../servidor/uploads/avatars/")
  },
  filename : (req, file, cb)=> {
    cb(null, "avatar-"+Date.now()+"-"+file.originalname)

  }
})

const uploads = multer({storage});

router.route("/")
        .post(registrar)
       .get(checkAuth, getAllUsers)
; 
router.post("/login", autenticar);
router.get("/confirmar/:token", confirmar);
router.post("/olvide-password", olvidePassword);
router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword);
router.get("/perfil", checkAuth, perfil);
router.get("/perfil/:id", checkAuth, getperfilUser);
router.put("/editar-perfil/:id", checkAuth, actualizarUsuario);
router.post("/upload",[checkAuth, uploads.single("file0") ], upload )
router.get("/avatar/:file", avatar);
router.get("/buscar/:nombre", checkAuth, buscarPorNombre);

export default router;