import { connectDB } from "../db.js";
import { ObjectId } from "mongodb";

export async function insertarPrestamo(prestamo) {
  const db = await connectDB();

  const usuario = await db.collection("USUARIO").findOne({ nombre: prestamo.usuario });
  if (!usuario) {
    console.log(`No existe un usuario con el nombre "${prestamo.usuario}".`);
    return;
  }

  const copia = await db.collection("COPIA").findOne({ codigo: prestamo.numero });
  if (!copia) {
    console.log(`No existe una copia con el código "${prestamo.numero}".`);
    return;
  }

  const nuevoPrestamo = {
    usuario: usuario._id,
    copia: copia._id,
    fechaPrestamo: prestamo.fechaPrestamo,
    fechaDevolucion: prestamo.fechaDevolucion,
  };

  await db.collection("PRESTAMO").insertOne(nuevoPrestamo);
  console.log(" Préstamo insertado correctamente.");
}


export async function actualizarPrestamo(numero, nuevosDatos) {
  const db = await connectDB();

  const copia = await db.collection("COPIA").findOne({ numero: numero });
  if (!copia) {
    console.log(" No se encontró una copia con ese código.");
    return;
  }

  const prestamo = await db.collection("PRESTAMO").findOne({ copia: copia._id });
  if (!prestamo) {
    console.log("No existe un préstamo activo para esa copia.");
    return;
  }

  // Si se quiere cambiar el usuario
  if (nuevosDatos.usuario) {
    const usuario = await db.collection("USUARIO").findOne({ nombre: nuevosDatos.usuario });

    if (!usuario) {
      console.log(`No se encontró un usuario con el nombre "${nuevosDatos.usuario}".`);
      return;
    }

    nuevosDatos.usuario = usuario._id;
    delete nuevosDatos.usuario;
  }

  await db.collection("PRESTAMO").updateOne(
    { _id: prestamo._id },
    { $set: nuevosDatos }
  );

  console.log(" Préstamo actualizado correctamente.");
}


export async function eliminarPrestamo(numero) {
  const db = await connectDB();

  const copia = await db.collection("COPIA").findOne({ numero: numero });
  if (!copia) {
    console.log(" No se encontró una copia con ese código.");
    return;
  }

  const prestamo = await db.collection("PRESTAMO").findOne({ copia: copia._id });
  if (!prestamo) {
    console.log(" No existe un préstamo para esa copia.");
    return;
  }

  await db.collection("PRESTAMO").deleteOne({ _id: prestamo._id });
  console.log(" Préstamo eliminado correctamente.");
}
