import express from "express";
import cookieParser from "cookie-parser";
import csrf from "csurf";
import usuarioRouter from "./routes/usuarioRouter.js";
import propiedadesRouter from "./routes/propiedadesRouter.js";
import appRouter from "./routes/appRouter.js";
import db from "./config/db.js";

//crear la app
const app = express();

//habilitar lectura de datos de formularios
app.use(express.urlencoded({ extended: true }));

//habilitar cookie parser
app.use(cookieParser());

//habilitar csrf protection
app.use(csrf({ cookie: true }));

//coneccion a la base de datos
try {
  await db.authenticate();
  db.sync();
  console.log("coneccion correcta a la base de datos");
} catch (error) {
  console.log(error);
}

//habilitar pug
app.set("view engine", "pug");
app.set("views", "./views");

//carpeta publica y los archivos estaticos
app.use(express.static("public"));

// Routing
app.use("/", appRouter);
app.use("/auth", usuarioRouter);
app.use("/", propiedadesRouter);

//definir un puerto y arrancar el proyecto
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`el servidor esta funcionando en el puerto ${port}`);
});
