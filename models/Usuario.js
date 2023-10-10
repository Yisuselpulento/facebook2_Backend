import mongoose from "mongoose";
import bcrypt from "bcrypt";

const usuarioSchema = mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    token: {
      type: String,
    },
    confirmado: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      default: 'default.jpg'
  },
  sexo: { 
      type: String, 
      enum: ['Supeior', 'Inferior', 'Otro'] ,
      default: 'Otro'
  },
  age: { 
      type: Number, 
      min: 0, 
      max: 120,
      default: 18
  },
  country: {
      type: String,
      default: 'No editado'
  }
  },
  {
    timestamps: true,
  }
);

usuarioSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  });
  
  usuarioSchema.methods.comprobarPassword = async function (passwordFormulario) {
    return await bcrypt.compare(passwordFormulario, this.password);
  };

const Usuario = mongoose.model("Usuario", usuarioSchema);
export default Usuario;