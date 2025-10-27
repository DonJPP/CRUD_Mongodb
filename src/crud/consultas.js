import inquirer from "inquirer";

export async function consultaCopias(db) {
  const resultado = await db.collection("COPIA").aggregate([
    {
      $lookup: {
        from: "EDICION",
        localField: "edicion_id",
        foreignField: "_id",
        as: "edicion"
      }
    },
    { $unwind: "$edicion" },
    {
      $lookup: {
        from: "LIBRO",
        localField: "edicion.libro_id",
        foreignField: "_id",
        as: "libro"
      }
    },
    { $unwind: "$libro" },
    {
      $lookup: {
        from: "AUTOR",
        localField: "libro.autor",
        foreignField: "_id",
        as: "autores"
      }
    },
    {
      $project: {
        _id: 0,
        codigo_copia: 1,
        estado: 1,
        "libro.titulo": 1,
        "edicion.año": 1,
        "edicion.idioma": 1,
        "autores.nombre": 1
      }
    }
  ]).toArray();

  if (resultado.length === 0) {
    console.log("\nNo hay copias registradas o no se encontraron relaciones válidas.\n");
  } else {
    console.table(resultado);
  }
}


export async function consultaLibrosPrestados(db) {
  const { nombreUsuario } = await inquirer.prompt([
    {
      type: "input",
      name: "nombreUsuario",
      message: "Ingrese el nombre del usuario:"
    }
  ]);

  const resultado = await db.collection("PRESTAMO").aggregate([
    {
      $lookup: {
        from: "USUARIO",
        localField: "usuario_id",
        foreignField: "_id",
        as: "usuario"
      }
    },
    { $unwind: "$usuario" },
    { $match: { "usuario.nombre": nombreUsuario } },
    {
      $lookup: {
        from: "COPIA",
        localField: "copia_id",
        foreignField: "_id",
        as: "copia"
      }
    },
    { $unwind: "$copia" },
    {
      $lookup: {
        from: "EDICION",
        localField: "copia.edicion_id",
        foreignField: "_id",
        as: "edicion"
      }
    },
    { $unwind: "$edicion" },
    {
      $lookup: {
        from: "LIBRO",
        localField: "edicion.libro_id",
        foreignField: "_id",
        as: "libro"
      }
    },
    { $unwind: "$libro" },
    {
      $lookup: {
        from: "AUTOR",
        localField: "libro.autor",
        foreignField: "_id",
        as: "autores"
      }
    },
    {
      $project: {
        _id: 0,
        "usuario.nombre": 1,
        "libro.titulo": 1,
        "autores.nombre": 1,
        "copia.codigo_copia": 1,
        fecha_prestamo: 1,
        fecha_devolucion: 1
      }
    }
  ]).toArray();

  if (resultado.length === 0) {
    console.log(`\nNo se encontraron préstamos para el usuario "${nombreUsuario}".\n`);
  } else {
    console.table(resultado);
  }
}
