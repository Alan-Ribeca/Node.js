import nodemailer from "nodemailer";

const emailRegistro = async (datos) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const { email, nombre, token } = datos;

  // enviar el email
  await transport.sendMail({
    from: "BienesRaices.com",
    to: email,
    subject: "Confirma tu cuenta en BienesRaices.com",
    text: "Confirma tu cuenta en BienesRaices.com",
    html: `
    <p>Hola ${nombre}, comprueba tu cuenta en BienesRices.com</p>
    <p>Para confirmar tu cuenta, haz click en el siguiente enlace: <a href="${
      process.env.BACKEND_URL
    }:${process.env.PORT ?? 3000}/auth/confirmar/${token}">
    Confirmar Cuenta
    <a/></p>
    <p>Si no has sido registrado en BienesRaices.com, ignora este correo.</p>
    `,
  });
};

// olvide mi password
const emailOlvidePassword = async (datos) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const { email, nombre, token } = datos;

  // enviar el email
  await transport.sendMail({
    from: "BienesRaices.com",
    to: email,
    subject: "Restablece tu password en BienesRaices.com",
    text: "Restablece tu password en BienesRaices.com",
    html: `
    <p>Hola ${nombre}, has solicitado restableces tu password en BienesRaices.com</p>
    <p>Sigue el siguiente enlace para generar un password nuevo <a href="${
      process.env.BACKEND_URL
    }:${process.env.PORT ?? 3000}/auth/olvide-password/${token}">
    Restableces password
    <a/></p>
    <p>Si no has solicitado el cambio de password, ignora este correo.</p>
    `,
  });
};
export { emailRegistro, emailOlvidePassword };
