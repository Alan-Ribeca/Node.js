import { check, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";
import { generarJWT, generarId } from "../helpers/tokens.js";
import { emailRegistro, emailOlvidePassword } from "../helpers/email.js";
import { where } from "sequelize";

const formularioLogin = (req, res) => {
  res.render("auth/login", {
    pagina: "Iniciar sesion",
    csrfToken: req.csrfToken(),
  });
};

const autenticar = async (req, res) => {
  //validacion
  await check("email")
    .isEmail()
    .withMessage("El email es obligatorio")
    .run(req);
  await check("password")
    .notEmpty()
    .withMessage("Ese password es obligatorio")
    .run(req);

  let resultado = validationResult(req);

  //verificar que el resultado este vacio
  if (!resultado.isEmpty()) {
    //errores
    return res.render("auth/login", {
      pagina: "Iniciar sesion",
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
    });
  }

  const { email, password } = req.body;

  //comprobar si el usuario existe
  const usuario = await Usuario.findOne({ where: { email } });
  if (!usuario) {
    return res.render("auth/login", {
      pagina: "Iniciar sesion",
      csrfToken: req.csrfToken(),
      errores: [
        {
          msg: "El usuario no existe",
        },
      ],
    });
  }

  //comprobar si el usuario esta confirmado
  if (!usuario.confirmado) {
    return res.render("auth/login", {
      pagina: "Iniciar sesion",
      csrfToken: req.csrfToken(),
      errores: [
        {
          msg: "Tu cuenta no ha sido confirmada",
        },
      ],
    });
  }

  //revisar el password
  const validoPassword = await bcrypt.compare(password, usuario.password);
  if (!validoPassword) {
    return res.render("auth/login", {
      pagina: "Iniciar sesion",
      csrfToken: req.csrfToken(),
      errores: [
        {
          msg: "Contraseña incorrecta",
        },
      ],
    });
  }

  //autenticar al usuario
  const token = generarJWT({ id: usuario.id, nombre: usuario.nombre });

  //almacenar en un cookie
  return res
    .cookie("_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: true,
    })
    .redirect("/mis-propiedades");
};

const cerrarSesion = (req, res) => {
  return res.clearCookie("_token").status(200).redirect("/auth/login");
};

const formularioRegistro = (req, res) => {
  res.render("auth/registro", {
    pagina: "Crear cuenta",
    csrfToken: req.csrfToken(),
  });
};

const registrar = async (req, res) => {
  //validacion
  await check("nombre")
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .run(req);
  await check("email").isEmail().withMessage("Email invalido").run(req);
  await check("password")
    .isLength({ min: 6 })
    .withMessage("El password debe ser de al menos 6 caracteres")
    .run(req);
  await check("repetir_password")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Los password no son iguales")
    .run(req);

  let resultado = validationResult(req);

  //verificar que el resultado este vacio
  if (!resultado.isEmpty()) {
    //errores
    return res.render("auth/registro", {
      pagina: "Crear cuenta",
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email,
      },
    });
  }

  //extraer los datos
  const { nombre, email, password } = req.body;

  //verigicar que el usuario no este duplicado
  const existeUsuario = await Usuario.findOne({
    where: { email },
  });

  if (existeUsuario) {
    return res.render("auth/registro", {
      pagina: "Crear cuenta",
      csrfToken: req.csrfToken(),
      errores: [{ msg: "El usuario ya esta registrado" }],
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email,
      },
    });
  }

  //almacenar un usuario
  const usuario = await Usuario.create({
    nombre,
    email,
    password,
    token: generarId(),
  });

  // envia email de confirmacion
  emailRegistro({
    nombre: usuario.nombre,
    email: usuario.email,
    token: usuario.token,
  });

  //mostrar mensaje de confirmacion
  res.render("templates/mensaje", {
    pagina: "Cuenta creada correctamente",
    mensaje: "Hemos enviado un email de confirmacion, preciona en el enlace",
  });
};

// funcion que comprueba una cuenta
const confirmar = async (req, res) => {
  const { token } = req.params;

  //verificar si el token es valido
  const usuario = await Usuario.findOne({ where: { token } });

  if (!usuario) {
    return res.render("auth/confirmar_cuenta", {
      pagina: "Error al confirmar tu cuenta",
      mensaje: "Hubo un error al confirmar tu cuenta, intenta de nuevo",
      error: true,
    });
  }

  //confirmar la cuenta
  usuario.token = null;
  usuario.confirmado = true;

  await usuario.save();

  res.render("auth/confirmar_cuenta", {
    pagina: "Cuenta confirmada",
    mensaje: "La cuenta ha sido confirmada correctamente",
  });
};

const formularioOlvidePassword = (req, res) => {
  res.render("auth/olvide-password", {
    pagina: "Recupera tu acceso a Bienes raices",
    csrfToken: req.csrfToken(),
  });
};

const resetPassword = async (req, res) => {
  //validacion
  await check("email").isEmail().withMessage("Email invalido").run(req);

  let resultado = validationResult(req);

  //verificar que el resultado este vacio
  if (!resultado.isEmpty()) {
    //errores
    return res.render("auth/olvide-password", {
      pagina: "Recupera tu acceso a Bienes raices",
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
    });
  }

  // buscar al usuaruio
  const { email } = req.body;

  const usuario = await Usuario.findOne({ where: { email } });

  // si el usuario no existe creamos el mensaje que no existe
  if (!usuario) {
    return res.render("auth/olvide-password", {
      pagina: "Recupera tu acceso a Bienes raices",
      csrfToken: req.csrfToken(),
      errores: [{ msg: "No hay ningun usuario registrado con este email" }],
    });
  }

  //generar un token y enviar el email
  usuario.token = generarId();
  await usuario.save();

  //enviar un email
  emailOlvidePassword({
    nombre: usuario.nombre,
    email: usuario.email,
    token: usuario.token,
  });

  //renderizar un mensaje
  res.render("templates/mensaje", {
    pagina: "Restablece tu password",
    mensaje: "Hemos enviado un email con las instrucciones",
  });
};

const comprobarToken = async (req, res) => {
  const { token } = req.params;

  //buscar al usuario
  const usuario = await Usuario.findOne({ where: { token } });

  // si el usuario no existe o no esta confirmado, redireccionar al login
  if (!usuario) {
    return res.render("auth/confirmar_cuenta", {
      pagina: "Reestablece tu password",
      mensaje: "Hubo un error al validar tu informacion, intenta de nuevo",
      error: true,
    });
  }

  //mostrar formulario para modificar el password
  res.render("auth/reset-password", {
    pagina: "Reestablece tu password",
    csrfToken: req.csrfToken(),
  });
};

const nuevoPassword = async (req, res) => {
  //validar el password
  await check("password")
    .isLength({ min: 6 })
    .withMessage("El password debe ser de al menos 6 caracteres")
    .run(req);

  let resultado = validationResult(req);

  //verificar que el resultado este vacio
  if (!resultado.isEmpty()) {
    //errores
    return res.render("auth/reset-password", {
      pagina: "Restablece tu password",
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
    });
  }

  const { token } = req.params;
  const { password } = req.body;
  // odentificar quien hace el cambio
  const usuario = await Usuario.findOne({ where: { token } });

  //hashear el nuevo password
  const salt = await bcrypt.genSalt(10);
  usuario.password = await bcrypt.hash(password, salt);
  usuario.token = null;

  await usuario.save();

  res.render("auth/confirmar_cuenta", {
    pagina: "Password reestablecido",
    mensaje: "Tu password ha sido reestablecido correctamente",
  });
};

export {
  formularioLogin,
  autenticar,
  cerrarSesion,
  formularioRegistro,
  registrar,
  confirmar,
  formularioOlvidePassword,
  resetPassword,
  comprobarToken,
  nuevoPassword,
};
