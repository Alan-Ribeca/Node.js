import express from "express";
import { body } from "express-validator";
import {
  admin,
  crear,
  guardarPropiedad,
  agregarImagen,
  almacenarImagen,
  editar,
  guardarCambios,
  eliminar,
  cambiarEstado,
  mostrarPropiedad,
  enviarMensaje,
  verMensajes,
} from "../controllers/propiedadController.js";
import protegerRuta from "../middleware/protegerRuta.js";
import upload from "../middleware/subirImg.js";
import identificarUsuario from "../middleware/identificarUsuario.js";

const router = express.Router();

router.get("/mis-propiedades", protegerRuta, admin);
router.get("/propiedades/crear", protegerRuta, crear);
router.post(
  "/propiedades/crear",
  protegerRuta,
  body("titulo").notEmpty().withMessage("El titulo del anuncio es obligatorio"),
  body("descripcion")
    .notEmpty()
    .withMessage("La descripcion no puede ir vacia")
    .isLength({ max: 200 })
    .withMessage("La descripcion es muy larga"),
  body("categoria").isNumeric().withMessage("Seleccione una categoria"),
  body("precio").isNumeric().withMessage("Seleccione un rango de precio"),
  body("habitaciones")
    .isNumeric()
    .withMessage("Seleccione la cantidad de habitaciones"),
  body("Estacionamiento")
    .isNumeric()
    .withMessage("Seleccione la cantidad de estacionamiento"),
  body("WC").isNumeric().withMessage("Seleccione la cantidad de baño"),
  body("lat").isNumeric().withMessage("Ubica la propiedad en el mapa"),

  guardarPropiedad
);

router.get("/propiedades/agregar-imagen/:id", protegerRuta, agregarImagen);

//primero protegemos la ruta, despues subimos la img y por ultimo la almacenamos en la base de datos
router.post(
  "/propiedades/agregar-imagen/:id",
  protegerRuta,
  upload.single("imagen"),
  almacenarImagen
);

router.get("/propiedades/editar/:id", protegerRuta, editar);

router.post(
  "/propiedades/editar/:id",
  protegerRuta,
  body("titulo").notEmpty().withMessage("El titulo del anuncio es obligatorio"),
  body("descripcion")
    .notEmpty()
    .withMessage("La descripcion no puede ir vacia")
    .isLength({ max: 200 })
    .withMessage("La descripcion es muy larga"),
  body("categoria").isNumeric().withMessage("Seleccione una categoria"),
  body("precio").isNumeric().withMessage("Seleccione un rango de precio"),
  body("habitaciones")
    .isNumeric()
    .withMessage("Seleccione la cantidad de habitaciones"),
  body("Estacionamiento")
    .isNumeric()
    .withMessage("Seleccione la cantidad de estacionamiento"),
  body("WC").isNumeric().withMessage("Seleccione la cantidad de baño"),
  body("lat").isNumeric().withMessage("Ubica la propiedad en el mapa"),

  guardarCambios
);

router.post("/propiedades/eliminar/:id", protegerRuta, eliminar);

router.put("/propiedades/:id", protegerRuta, cambiarEstado);

//area publica
router.get("/propiedad/:id", identificarUsuario, mostrarPropiedad);

//almacenar los mensajes (que se mandan en las propiedades)
router.post(
  "/propiedad/:id",
  identificarUsuario,
  body("mensaje")
    .isLength({ min: 10 })
    .withMessage("El mensaje no puede ir vacio, o es muy corto"),
  enviarMensaje
);

router.get("/mensajes/:id", protegerRuta, verMensajes);

export default router;
