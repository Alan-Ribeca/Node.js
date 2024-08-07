import { validationResult } from "express-validator";
import { Precio, Categoria, propiedad, Propiedad } from "../models/index.js";

const admin = (req, res) => {
  res.render("propiedades/admin", {
    pagina: "Mis propiedades",
    barra: true,
  });
};

//formulario para crear una nueva propiedad
const crear = async (req, res) => {
  //consultar modelo de precio y categoria
  const [categorias, precios] = await Promise.all([
    Categoria.findAll(),
    Precio.findAll(),
  ]);

  res.render("propiedades/crear", {
    pagina: "Crear propiedades",
    barra: true,
    csrfToken: req.csrfToken(),
    categorias,
    precios,
    datos: {},
  });
};

const guardarPropiedad = async (req, res) => {
  //validar los campos (que vienen desde propiedadesRouter.js)
  let resultados = validationResult(req);

  if (!resultados.isEmpty()) {
    //consultar modelo de precio y categoria
    const [categorias, precios] = await Promise.all([
      Categoria.findAll(),
      Precio.findAll(),
    ]);

    return res.render("propiedades/crear", {
      pagina: "Crear propiedades",
      barra: true,
      csrfToken: req.csrfToken(),
      categorias,
      precios,
      errores: resultados.array(), //mostrar los errores en el formulario
      datos: req.body,
    });
  }

  //crear la nueva propiedad

  const {
    titulo,
    descripcion,
    habitaciones,
    Estacionamiento,
    WC,
    calle,
    lat,
    lng,
    precio: precioId,
    categoria: categoriaId,
  } = req.body;

  try {
    const propiedadGuardada = await Propiedad.create({
      titulo,
      descripcion,
      habitaciones,
      Estacionamiento,
      WC,
      calle,
      lat,
      lng,
      precioId,
      categoriaId,
    });
  } catch (error) {
    console.log(error);
  }
};

export { admin, crear, guardarPropiedad };
