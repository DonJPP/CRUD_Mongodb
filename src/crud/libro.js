import { connectDB } from "../db.js";
import { ObjectId } from "mongodb";

export async function insertarLibro(libro) {
  const db = await connectDB();

  // Buscar el autor por nombre
  const autor = await db.collection("AUTOR").findOne({ nombre: libro.autor});

  if (!autor) {
    console.log(` No se pudo insertar el libro. No existe un autor con el nombre "${libro.autor}".`);
    return;
  }

  // Crear documento final
  const nuevoLibro = {
    titulo: libro.titulo,
    ISBN: libro.ISBN,
    año: libro.año,
    idioma: libro.idioma,
    autor: autor._id // referencia al autor
  };

  await db.collection("LIBRO").insertOne(nuevoLibro);
  console.log("✅ Libro insertado correctamente.");
}

/**
 * Actualiza un libro por su ISBN, validando el nuevo autor si se cambia.
 */
export async function actualizarLibro(ISBN, nuevosDatos) {
  const db = await connectDB();

  const libro = await db.collection("LIBRO").findOne({ ISBN });
  if (!libro) {
    console.log("❌ No se encontró un libro con ese ISBN.");
    return;
  }

  // Si el usuario desea cambiar el autor
  if (nuevosDatos.autorNombre) {
    const autor = await db.collection("AUTOR").findOne({ nombre: nuevosDatos.autorNombre });

    if (!autor) {
      console.log(`❌ No se pudo actualizar el libro. No existe un autor con el nombre "${nuevosDatos.autorNombre}".`);
      return;
    }

    nuevosDatos.autor = autor._id;
    delete nuevosDatos.autorNombre; // limpiamos el campo auxiliar
  }

  await db.collection("LIBRO").updateOne(
    { _id: libro._id },
    { $set: nuevosDatos }
  );

  console.log("✅ Libro actualizado correctamente.");
}

/**
 * Elimina un libro por ISBN.
 */
export async function eliminarLibro(ISBN) {
  const db = await connectDB();
  const libro = await db.collection("LIBRO").findOne({ ISBN });

  if (!libro) {
    console.log("❌ No se encontró un libro con ese ISBN.");
    return;
  }

  await db.collection("LIBRO").deleteOne({ _id: libro._id });
  console.log("🗑️ Libro eliminado correctamente.");
}

