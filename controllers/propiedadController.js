import { validationResult } from "express-validator";
import { Precio, Categoria, Propiedad } from "../models/index.js";

const admin = async (req, res) => {
  const { id } = req.usuario;
  const propiedades = await Propiedad.findAll({ where: { usuarioId: id } });

  res.render("propiedades/admin", {
    pagina: "Mis propiedades",
    propiedades,
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

  const { id: usuarioId } = req.usuario;

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
      usuarioId,
      imagen: "",
    });

    const { id } = propiedadGuardada;

    res.redirect(`/propiedades/agregar-imagen/${id}`);
  } catch (error) {
    console.log(error);
  }
};

const agregarImagen = async (req, res) => {
  const { id } = req.params;

  // validar que la propiedad exista
  const propiedad = await Propiedad.findByPk(id);

  if (!propiedad) {
    return res.redirect("/mis-propiedades");
  }

  //validar que la propiedad no esta publicada
  if (propiedad.publicado) {
    return res.redirect("/mis-propiedades");
  }

  // validar que la propiedad pertenece a quien visita la pag

  if (req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
    return res.redirect("/mis-propiedades");
  }

  res.render("propiedades/agregar-imagen", {
    pagina: `Agregar imagen: ${propiedad.titulo}`,
    csrfToken: req.csrfToken(),
    propiedad,
  });
};

const almacenarImagen = async (req, res, next) => {
  const { id } = req.params;

  // validar que la propiedad exista
  const propiedad = await Propiedad.findByPk(id);

  if (!propiedad) {
    return res.redirect("/mis-propiedades");
  }

  //validar que la propiedad no esta publicada
  if (propiedad.publicado) {
    return res.redirect("/mis-propiedades");
  }

  // validar que la propiedad pertenece a quien visita la pag

  if (req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
    return res.redirect("/mis-propiedades");
  }

  try {
    //almacenar la imga y publica la propiedad (propiedad es como se llama la columna en la base de datos y imagen es como se llama una columna de la base de datos )
    console.log(req.file);

    propiedad.imagen = req.file.filename;

    propiedad.publicado = 1;

    await propiedad.save();

    next();
  } catch (error) {
    console.log(error);
  }
};

export { admin, crear, guardarPropiedad, agregarImagen, almacenarImagen };
