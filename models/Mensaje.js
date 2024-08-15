import { DataTypes } from "sequelize";
import bd from "../config/db.js";

const Mensaje = bd.define("mensajes", {
  mensaje: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
});

export default Mensaje;
