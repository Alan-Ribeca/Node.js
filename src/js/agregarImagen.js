import { Dropzone } from "dropzone";

const token = document
  .querySelector('meta[name="csrf-token"]')
  .getAttribute("content");

Dropzone.options.imagen = {
  dictDefaultMessage: "Sube tus imágenes aquí",
  acceptedFiles: ".png,.jpg,.jpeg",
  maxFilesize: 5, // Tamaño máximo del archivo en MB
  maxFiles: 1, // Máximo de archivos permitidos
  parallelUploads: 1, // Número de subidas en paralelo
  autoProcessQueue: false, // Procesar automáticamente la cola (corrección)
  addRemoveLinks: true, // Mostrar el enlace para eliminar archivos
  dictRemoveFile: "Borrar archivo", // Texto del enlace de eliminación
  dictMaxFilesExceeded: "El limite es 1 archivo",
  headers: {
    "CSRF-Token": token,
  },
  paramName: "imagen",
};
