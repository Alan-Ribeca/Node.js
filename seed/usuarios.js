import bcrypt from "bcrypt";

const usuarios = [
  {
    nombre: "juan",
    email: "juan@gmail.com",
    confirmado: 1,
    password: bcrypt.hashSync("password", 10),
  },
];

export default usuarios;
