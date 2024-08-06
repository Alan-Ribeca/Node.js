import { DataTypes } from "sequelize";
import bd from "../config/db.js";

const Precio = bd.define("precios", {
  nombre: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
});

export default Precio;
