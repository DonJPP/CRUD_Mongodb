import { connectDB } from "../db.js";
import {ObjectId} from 'mongodb';

export async function insertarUsuario(usuario) {
  const db = await connectDB();
  await db.collection("USUARIO").insertOne(usuario);
  console.log("Usuario insertado correctamente.");
}


export async function actualizarUsuario(RUT, nuevosDatos) {
  const db = await connectDB();
  const usuario = await db.collection("USUARIO").findOne({ RUT });
  if (!usuario) {
    console.log("No se encontró un usuario con ese RUT.");
    return;
  }
   await db.collection("USUARIO").updateOne(
    { _id: usuario._id },
    { $set: nuevosDatos }
  );
  console.log("Usuario actualizado correctamente.");
}

export async function eliminarUsuario(RUT) {
  const db = await connectDB();
  const usuario = await db.collection("USUARIO").findOne({ RUT });
  if (!usuario) {
    console.log("No se encontró un usuario con ese nombre.");
    return;
  }
  await db.collection("USUARIO").deleteOne({ _id: usuario._id });
  console.log("usuario eliminado.");
}
