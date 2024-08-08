import express from "express";
import { body } from "express-validator";
import {
  admin,
  crear,
  guardarPropiedad,
  agregarImagen,
} from "../controllers/propiedadController.js";
import protegerRuta from "../middleware/protegerRuta.js";
import upload from "../middleware/subirImg.js";

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

router.post("/propiedades/agregar-imagen/:id", upload.single("imagen"));

export default router;
