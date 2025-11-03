//en estos scripts estan las funciones de insercion, actualizacion y eliminación correspondiente a cada colección
import { connectDB } from "../db.js";
import {ObjectId} from 'mongodb';

export async function insertarAutor(autor) {
  const db = await connectDB();
  await db.collection("AUTOR").insertOne(autor);
  console.log("Autor insertado correctamente.");
}


export async function actualizarAutor(nombre, nuevosDatos) {
  const db = await connectDB();
  const autor = await db.collection("AUTOR").findOne({ nombre });
  if (!autor) {
    console.log("No se encontró un autor con ese nombre.");
    return;
  }
   await db.collection("AUTOR").updateOne(
    { _id: autor._id },
    { $set: nuevosDatos }
  );
  console.log("Autor actualizado correctamente.");
}

export async function eliminarAutor(autor) {
  const db = await connectDB();
  const autor = await db.collection("AUTOR").findOne({ nombre });
  if (!autor) {
    console.log("No se encontró un autor con ese nombre.");
    return;
  }
  await db.collection("AUTOR").deleteOne({ _id: autor._id });
  console.log("Autor eliminado.");
}
