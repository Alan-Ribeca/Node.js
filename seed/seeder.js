import categorias from "./categorias.js";
import precios from "./precios.js";
import Categorias from "../models/Categoria.js";
import Precio from "../models/Precio.js";
import db from "../config/db.js";

const importarDatos = async () => {
  try {
    //autenticar en la base de datos
    await db.authenticate();

    // generar las columnas en la bd
    await db.sync();

    //insertamos los datos en la bd

    await Promise.all([
      Categorias.bulkCreate(categorias),
      Precio.bulkCreate(precios),
    ]);

    console.log("Datos importados correctamente");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const eliminarDatos = async () => {
  try {
    await db.sync({ force: true });
    console.log("Datos eliminados correctamente");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

if (process.argv[2] === "-i") {
  importarDatos();
}

if (process.argv[2] === "-e") {
  eliminarDatos();
}
