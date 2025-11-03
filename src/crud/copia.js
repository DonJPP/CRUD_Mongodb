import { connectDB } from "../db.js";
import { ObjectId } from "mongodb";

export async function insertarCopia(copia) {
  const db = await connectDB();

  // Buscar el libro por título
  const libro = await db.collection("LIBRO").findOne({ titulo: copia.libro });

  if (!libro) {
    console.log(`No se pudo insertar la copia. No existe un libro con el título "${copia.libro}".`);
    return;
  }

  const nuevaCopia = {
    numero: copia.codigo,
    libro: libro._id
  };

  await db.collection("COPIA").insertOne(nuevaCopia);
  console.log(" Copia insertada correctamente.");
}

/**
 * Actualiza una copia por su código.
 */
export async function actualizarCopia(numero, nuevosDatos) {
  const db = await connectDB();

  const copia = await db.collection("COPIA").findOne({ numero });
  if (!copia) {
    console.log(" No se encontró una copia con ese código.");
    return;
  }

  // Si se quiere cambiar el libro asociado
  if (nuevosDatos.libro) {
    const libro = await db.collection("LIBRO").findOne({ titulo: nuevosDatos.libro });

    if (!libro) {
      console.log(` No se pudo actualizar. No existe un libro con el título "${nuevosDatos.libro}".`);
      return;
    }

    nuevosDatos.libro = libro._id;
    delete nuevosDatos.libro;
  }

  await db.collection("COPIA").updateOne(
    { _id: copia._id },
    { $set: nuevosDatos }
  );

  console.log(" Copia actualizada correctamente.");
}

/**
 * Elimina una copia por su código.
 */
export async function eliminarCopia(codigo) {
  const db = await connectDB();
  const copia = await db.collection("COPIA").findOne({ codigo });

  if (!copia) {
    console.log(" No se encontró una copia con ese código.");
    return;
  }

  await db.collection("COPIA").deleteOne({ _id: copia._id });
  console.log(" Copia eliminada correctamente.");
}
