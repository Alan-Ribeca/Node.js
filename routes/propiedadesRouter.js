import express from "express";
import { body } from "express-validator";
import {
  admin,
  crear,
  guardarPropiedad,
} from "../controllers/propiedadController.js";

const router = express.Router();

router.get("/mis-propiedades", admin);
router.get("/propiedades/crear", crear);
router.post(
  "/propiedades/crear",
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

export default router;
