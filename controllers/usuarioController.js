import Usuario from "../models/Usuario.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import { emailRegistro, emailOlvidePassword } from "../helpers/email.js";
import  fs from "fs"
import path from "path";

const registrar = async (req, res) => {
 
  const { email } = req.body;
  const existeUsuario = await Usuario.findOne({ email });

  if (existeUsuario) {
    const error = new Error("Email ya registrado");
    return res.status(400).json({ msg: error.message });
  }

  try {
    const usuario = new Usuario(req.body);
    usuario.token = generarId();
    await usuario.save();

     emailRegistro({
      email: usuario.email,
      nombre: usuario.nombre,
      token: usuario.token,
    }); 

    res.json({
      msg: "Usuario Creado Correctamente, Revisa tu Email para confirmar tu cuenta",
    });
  } catch (error) {
    console.log(error);
  }
};

const autenticar = async (req, res) => {
  const { email, password } = req.body;


  const usuario = await Usuario.findOne({ email });
  if (!usuario) {
    const error = new Error("El Usuario no existe");
    return res.status(404).json({ msg: error.message });
  }

  if (!usuario.confirmado) {
    const error = new Error("Tu Cuenta no ha sido confirmada");
    return res.status(403).json({ msg: error.message });
  }

  if (await usuario.comprobarPassword(password)) {
    res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      sexo: usuario.sexo,
      image: usuario.image,
      country: usuario.country,
      age: usuario.age,
      token: generarJWT(usuario._id),

    });
  } else {
    const error = new Error("El Password es Incorrecto");
    return res.status(403).json({ msg: error.message });
  }
};

const buscarPorNombre = async (req, res) => {
  try {
    const nombre = req.params.nombre;

    if (!nombre) {
      return res.status(400).json({ error: 'El nombre es requerido' });
    }

    const usuarios = await Usuario.find({ nombre: new RegExp(nombre, 'i') });  // Usamos una RegExp para una búsqueda insensible a mayúsculas/minúsculas.

    if (!usuarios.length) {
      return res.status(404).json({ error: 'No se encontraron usuarios' });
    }

    return res.status(200).json(usuarios);
  } catch (error) {
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

const confirmar = async (req, res) => {
  const { token } = req.params;
  const usuarioConfirmar = await Usuario.findOne({ token });
  if (!usuarioConfirmar) {
    const error = new Error("Token no válido");
    return res.status(403).json({ msg: error.message });
  }

  try {
    usuarioConfirmar.confirmado = true;
    usuarioConfirmar.token = "";
    await usuarioConfirmar.save();
    res.json({ msg: "Usuario Confirmado Correctamente" });
  } catch (error) {
    console.log(error);
  }
};

const olvidePassword = async (req, res) => {
  const { email } = req.body;
  const usuario = await Usuario.findOne({ email });
  if (!usuario) {
    const error = new Error("El Usuario no existe");
    return res.status(404).json({ msg: error.message });
  }

  try {
    usuario.token = generarId();
    await usuario.save();
    
     emailOlvidePassword({
      email: usuario.email,
      nombre: usuario.nombre,
      token: usuario.token,
    }); 

    res.json({ msg: "Te he enviado un email para cambiar el password" });
  } catch (error) {
    console.log(error);
  }
};



const comprobarToken = async (req, res) => {
  const { token } = req.params;

  const tokenValido = await Usuario.findOne({ token });

  if (tokenValido) {
    res.json({ msg: "Token válido y el usuario existe" });
  } else {
    const error = new Error("Token no válido");
    return res.status(404).json({ msg: error.message });
  }
};

const nuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const usuario = await Usuario.findOne({ token });

  if (usuario) {
    usuario.password = password;
    usuario.token = "";
    try {
      await usuario.save();
      res.json({ msg: "Password Modificado Correctamente" });
    } catch (error) {
      console.log(error);
    }
  } else {
    const error = new Error("Token no válido");
    return res.status(404).json({ msg: error.message });
  }
};

const perfil = async (req, res) => {
  const { usuario } = req;

  if (!usuario) {
    return res.status(400).json({ error: 'Usuario no encontrado' });
  }

  res.json(usuario);
};

const getperfilUser = async (req, res) => {

  try {
    const user = await Usuario.findById(req.params.id)
  
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
  }
  res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

const getAllUsers = async (req,res) => {
    try {  
      const users = await Usuario.find()
      res.json(users)
    } catch (error) {
      res.status(404).json({message : error})
    }
}

const actualizarUsuario = async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = {
        image: req.body.image,
        sexo: req.body.sexo,
        age: req.body.age,
        country: req.body.country,
    };

    const user = await Usuario.findByIdAndUpdate(userId, updates, { new: true });

    if (!user) {
        return res.status(404).send({ message: 'Usuario no encontrado' });
    }

    res.send(user);
} catch (error) {
    res.status(500).send(error);
}

}

const upload = async (req, res) => {
  // Log para verificar que la función se invoca correctamente
  console.log("Función Upload Invocada.");

  // Log para verificar el contenido de req.file
  console.log("req.file:", req.file);

  if (!req.file) {
      return res.status(400).json({
          status: "error",
          message: 'Por favor, sube una imagen'
      });
  }

  let image = req.file.originalname;
  let imageSplit = image.split(".");
  let extension = imageSplit[imageSplit.length - 1];

  if (extension != "png" && extension != "jpg" && extension != "jpeg" && extension != "gif") {
      const filePath = req.file.path;
      fs.unlinkSync(filePath);
      return res.status(400).json({
          status: "error",
          message: "Extension del fichero invalida"
      });
  }

  try {
      console.log("Actualizando usuario con imagen:", req.file.filename);

      const user = await Usuario.findByIdAndUpdate(
          req.usuario._id,
          { image: req.file.filename },
          { new: true }
      ).select('_id nombre image age country sexo');  

      return res.status(200).json({
          status: "success",
          data: user
      });

  } catch (error) {
      console.error("Error al actualizar el usuario con la imagen:", error);
      res.status(500).json({
          status: "error",
          message: "Internal Server Error",
          error: error.message  // Esta línea te proporciona un mensaje detallado del error. Puedes omitirla si no deseas enviar detalles del error al cliente.
      });
  }
}

const avatar = (req, res) => {
  const file = req.params.file;
  const filepath = path.resolve("./uploads/avatars/" + file);
  const defaultImagePath = path.resolve("./uploads/avatars/default.jpg");

  fs.access(filepath, fs.constants.F_OK, (error) => {
      if (error) {
          console.error(`File not found: ${filepath}`);
          return res.sendFile(defaultImagePath);
      }
      return res.sendFile(filepath);
  });
};

export {
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
};
