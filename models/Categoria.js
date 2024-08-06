import { DataTypes } from "sequelize";
import bd from "../config/db.js";

const Categoria = bd.define("categorias", {
  nombre: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
});

export default Categoria;
