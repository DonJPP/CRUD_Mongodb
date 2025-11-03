import inquirer from "inquirer";
import { connectDB } from "./db.js";
import { insertarAutor, actualizarAutor, eliminarAutor } from "./crud/autor.js";
import { insertarLibro, actualizarLibro, eliminarLibro } from "./crud/libro.js";
import { insertarCopia, actualizarCopia, eliminarCopia } from "./crud/copia.js";
import { insertarUsuario, actualizarUsuario, eliminarUsuario } from "./crud/Usuario.js";
import { insertarPrestamo, actualizarPrestamo, eliminarPrestamo } from "./crud/prestamo.js";
import { consultaCopias, consultaLibrosPrestados } from "./crud/consultas.js";

async function menuPrincipal() {
  console.log("\n=== SISTEMA DE GESTION DE BIBLIOTECA ===");
  console.log("1. Gestion de Autores");
  console.log("2. Gestion de Libros");
  console.log("3. Gestion de Copias");
  console.log("4. Gestion de Usuarios");
  console.log("5. Gestion de Prestamos");
  console.log("6. Consultas");
  console.log("7. Salir");

  const { opcion } = await inquirer.prompt([
    {
      type: "input",
      name: "opcion",
      message: "Seleccione una opcion:",
      validate: (input) => {
        const num = parseInt(input);
        return (num >= 1 && num <= 7) || "Ingrese un numero entre 1 y 7";
      }
    }
  ]);

  switch (opcion) {
    case "1":
      await menuAutores();
      break;
    case "2":
      await menuLibros();
      break;
    case "3":
      await menuCopias();
      break;
    case "4":
      await menuUsuarios();
      break;
    case "5":
      await menuPrestamos();
      break;
    case "6":
      await menuConsultas();
      break;
    case "7":
      console.log("\nHasta luego!\n");
      process.exit(0);
  }

  await menuPrincipal();
}

// ============ MENÚ AUTORES ============
async function menuAutores() {
  console.log("\n=== GESTION DE AUTORES ===");
  console.log("1. Insertar Autor");
  console.log("2. Actualizar Autor");
  console.log("3. Eliminar Autor");
  console.log("4. Volver");

  const { accion } = await inquirer.prompt([
    {
      type: "input",
      name: "accion",
      message: "Seleccione una accion:",
      validate: (input) => {
        const num = parseInt(input);
        return (num >= 1 && num <= 4) || "Ingrese un numero entre 1 y 4";
      }
    }
  ]);

  switch (accion) {
    case "1":
      await insertarAutorMenu();
      break;
    case "2":
      await actualizarAutorMenu();
      break;
    case "3":
      await eliminarAutorMenu();
      break;
    case "4":
      return;
  }

  await menuAutores();
}

async function insertarAutorMenu() {
  const { nombre } = await inquirer.prompt([
    {
      type: "input",
      name: "nombre",
      message: "Ingrese el nombre del autor:",
      validate: (input) => input.trim() !== "" || "El nombre no puede estar vacio"
    }
  ]);

  await insertarAutor({ nombre });
}

async function actualizarAutorMenu() {
  const { nombre, nuevoNombre } = await inquirer.prompt([
    {
      type: "input",
      name: "nombre",
      message: "Ingrese el nombre del autor a actualizar:",
      validate: (input) => input.trim() !== "" || "El nombre no puede estar vacio"
    },
    {
      type: "input",
      name: "nuevoNombre",
      message: "Ingrese el nuevo nombre del autor:",
      validate: (input) => input.trim() !== "" || "El nombre no puede estar vacio"
    }
  ]);

  await actualizarAutor(nombre, { nombre: nuevoNombre });
}

async function eliminarAutorMenu() {
  const { nombre } = await inquirer.prompt([
    {
      type: "input",
      name: "nombre",
      message: "Ingrese el nombre del autor a eliminar:",
      validate: (input) => input.trim() !== "" || "El nombre no puede estar vacio"
    }
  ]);

  await eliminarAutor(nombre);
}

// ============ MENÚ LIBROS ============
async function menuLibros() {
  console.log("\n=== GESTION DE LIBROS ===");
  console.log("1. Insertar Libro");
  console.log("2. Actualizar Libro");
  console.log("3. Eliminar Libro");
  console.log("4. Volver");

  const { accion } = await inquirer.prompt([
    {
      type: "input",
      name: "accion",
      message: "Seleccione una accion:",
      validate: (input) => {
        const num = parseInt(input);
        return (num >= 1 && num <= 4) || "Ingrese un numero entre 1 y 4";
      }
    }
  ]);

  switch (accion) {
    case "1":
      await insertarLibroMenu();
      break;
    case "2":
      await actualizarLibroMenu();
      break;
    case "3":
      await eliminarLibroMenu();
      break;
    case "4":
      return;
  }

  await menuLibros();
}

async function insertarLibroMenu() {
  const datos = await inquirer.prompt([
    {
      type: "input",
      name: "titulo",
      message: "Ingrese el titulo del libro:",
      validate: (input) => input.trim() !== "" || "El titulo no puede estar vacio"
    },
    {
      type: "number",
      name: "ISBN",
      message: "Ingrese el ISBN del libro:",
      validate: (input) => !isNaN(input) || "Debe ser un numero valido"
    },
    {
      type: "number",
      name: "año",
      message: "Ingrese el año de publicacion:",
      validate: (input) => !isNaN(input) || "Debe ser un numero valido"
    },
    {
      type: "input",
      name: "idioma",
      message: "Ingrese el idioma del libro:",
      validate: (input) => input.trim() !== "" || "El idioma no puede estar vacio"
    },
    {
      type: "input",
      name: "autor",
      message: "Ingrese el nombre del autor:",
      validate: (input) => input.trim() !== "" || "El autor no puede estar vacio"
    }
  ]);

  await insertarLibro(datos);
}

async function actualizarLibroMenu() {
  const { ISBN } = await inquirer.prompt([
    {
      type: "number",
      name: "ISBN",
      message: "Ingrese el ISBN del libro a actualizar:",
      validate: (input) => !isNaN(input) || "Debe ser un numero valido"
    }
  ]);

  console.log("\n=== CAMPOS A ACTUALIZAR ===");
  console.log("1. Titulo");
  console.log("2. Año");
  console.log("3. Idioma");
  console.log("4. Autor");

  const { campo } = await inquirer.prompt([
    {
      type: "input",
      name: "campo",
      message: "Seleccione el campo a actualizar:",
      validate: (input) => {
        const num = parseInt(input);
        return (num >= 1 && num <= 4) || "Ingrese un numero entre 1 y 4";
      }
    }
  ]);

  const campoMap = {
    "1": "titulo",
    "2": "año",
    "3": "idioma",
    "4": "autor"
  };

  const campoSeleccionado = campoMap[campo];
  let nuevosDatos = {};
  
  if (campoSeleccionado === "año") {
    const { valor } = await inquirer.prompt([
      {
        type: "number",
        name: "valor",
        message: `Ingrese el nuevo ${campoSeleccionado}:`,
        validate: (input) => !isNaN(input) || "Debe ser un numero valido"
      }
    ]);
    nuevosDatos[campoSeleccionado] = valor;
  } else {
    const { valor } = await inquirer.prompt([
      {
        type: "input",
        name: "valor",
        message: `Ingrese el nuevo ${campoSeleccionado}:`,
        validate: (input) => input.trim() !== "" || "El valor no puede estar vacio"
      }
    ]);
    nuevosDatos[campoSeleccionado] = valor;
  }

  await actualizarLibro(ISBN, nuevosDatos);
}

async function eliminarLibroMenu() {
  const { ISBN } = await inquirer.prompt([
    {
      type: "number",
      name: "ISBN",
      message: "Ingrese el ISBN del libro a eliminar:",
      validate: (input) => !isNaN(input) || "Debe ser un numero valido"
    }
  ]);

  await eliminarLibro(ISBN);
}

// ============ MENÚ COPIAS ============
async function menuCopias() {
  console.log("\n=== GESTION DE COPIAS ===");
  console.log("1. Insertar Copia");
  console.log("2. Actualizar Copia");
  console.log("3. Eliminar Copia");
  console.log("4. Volver");

  const { accion } = await inquirer.prompt([
    {
      type: "input",
      name: "accion",
      message: "Seleccione una accion:",
      validate: (input) => {
        const num = parseInt(input);
        return (num >= 1 && num <= 4) || "Ingrese un numero entre 1 y 4";
      }
    }
  ]);

  switch (accion) {
    case "1":
      await insertarCopiaMenu();
      break;
    case "2":
      await actualizarCopiaMenu();
      break;
    case "3":
      await eliminarCopiaMenu();
      break;
    case "4":
      return;
  }

  await menuCopias();
}

async function insertarCopiaMenu() {
  const datos = await inquirer.prompt([
    {
      type: "number",
      name: "codigo",
      message: "Ingrese el numero de copia:",
      validate: (input) => !isNaN(input) || "Debe ser un numero valido"
    },
    {
      type: "input",
      name: "libro",
      message: "Ingrese el titulo del libro:",
      validate: (input) => input.trim() !== "" || "El titulo no puede estar vacio"
    }
  ]);

  await insertarCopia(datos);
}

async function actualizarCopiaMenu() {
  const { numero } = await inquirer.prompt([
    {
      type: "number",
      name: "numero",
      message: "Ingrese el numero de copia a actualizar:",
      validate: (input) => !isNaN(input) || "Debe ser un numero valido"
    }
  ]);

  const { libro } = await inquirer.prompt([
    {
      type: "input",
      name: "libro",
      message: "Ingrese el nuevo titulo del libro:",
      validate: (input) => input.trim() !== "" || "El titulo no puede estar vacio"
    }
  ]);

  await actualizarCopia(numero, { libro });
}

async function eliminarCopiaMenu() {
  const { codigo } = await inquirer.prompt([
    {
      type: "number",
      name: "codigo",
      message: "Ingrese el codigo de la copia a eliminar:",
      validate: (input) => !isNaN(input) || "Debe ser un numero valido"
    }
  ]);

  await eliminarCopia(codigo);
}

// ============ MENÚ USUARIOS ============
async function menuUsuarios() {
  console.log("\n=== GESTION DE USUARIOS ===");
  console.log("1. Insertar Usuario");
  console.log("2. Actualizar Usuario");
  console.log("3. Eliminar Usuario");
  console.log("4. Volver");

  const { accion } = await inquirer.prompt([
    {
      type: "input",
      name: "accion",
      message: "Seleccione una accion:",
      validate: (input) => {
        const num = parseInt(input);
        return (num >= 1 && num <= 4) || "Ingrese un numero entre 1 y 4";
      }
    }
  ]);

  switch (accion) {
    case "1":
      await insertarUsuarioMenu();
      break;
    case "2":
      await actualizarUsuarioMenu();
      break;
    case "3":
      await eliminarUsuarioMenu();
      break;
    case "4":
      return;
  }

  await menuUsuarios();
}

async function insertarUsuarioMenu() {
  const datos = await inquirer.prompt([
    {
      type: "number",
      name: "RUT",
      message: "Ingrese el RUT del usuario:",
      validate: (input) => !isNaN(input) || "Debe ser un numero valido"
    },
    {
      type: "input",
      name: "nombre",
      message: "Ingrese el nombre del usuario:",
      validate: (input) => input.trim() !== "" || "El nombre no puede estar vacio"
    }
  ]);

  await insertarUsuario(datos);
}

async function actualizarUsuarioMenu() {
  const { RUT } = await inquirer.prompt([
    {
      type: "number",
      name: "RUT",
      message: "Ingrese el RUT del usuario a actualizar:",
      validate: (input) => !isNaN(input) || "Debe ser un numero valido"
    }
  ]);

  const { nombre } = await inquirer.prompt([
    {
      type: "input",
      name: "nombre",
      message: "Ingrese el nuevo nombre del usuario:",
      validate: (input) => input.trim() !== "" || "El nombre no puede estar vacio"
    }
  ]);

  await actualizarUsuario(RUT, { nombre });
}

async function eliminarUsuarioMenu() {
  const { RUT } = await inquirer.prompt([
    {
      type: "number",
      name: "RUT",
      message: "Ingrese el RUT del usuario a eliminar:",
      validate: (input) => !isNaN(input) || "Debe ser un numero valido"
    }
  ]);

  await eliminarUsuario(RUT);
}

// ============ MENÚ PRÉSTAMOS ============
async function menuPrestamos() {
  console.log("\n=== GESTION DE PRESTAMOS ===");
  console.log("1. Insertar Prestamo");
  console.log("2. Actualizar Prestamo");
  console.log("3. Eliminar Prestamo");
  console.log("4. Volver");

  const { accion } = await inquirer.prompt([
    {
      type: "input",
      name: "accion",
      message: "Seleccione una accion:",
      validate: (input) => {
        const num = parseInt(input);
        return (num >= 1 && num <= 4) || "Ingrese un numero entre 1 y 4";
      }
    }
  ]);

  switch (accion) {
    case "1":
      await insertarPrestamoMenu();
      break;
    case "2":
      await actualizarPrestamoMenu();
      break;
    case "3":
      await eliminarPrestamoMenu();
      break;
    case "4":
      return;
  }

  await menuPrestamos();
}

async function insertarPrestamoMenu() {
  const datos = await inquirer.prompt([
    {
      type: "input",
      name: "usuario",
      message: "Ingrese el nombre del usuario:",
      validate: (input) => input.trim() !== "" || "El nombre no puede estar vacio"
    },
    {
      type: "number",
      name: "numero",
      message: "Ingrese el numero de copia:",
      validate: (input) => !isNaN(input) || "Debe ser un numero valido"
    },
    {
      type: "input",
      name: "fechaPrestamo",
      message: "Ingrese la fecha de prestamo (YYYY-MM-DD):",
      validate: (input) => {
        const fecha = new Date(input);
        return !isNaN(fecha.getTime()) || "Fecha invalida. Use formato YYYY-MM-DD";
      }
    },
    {
      type: "input",
      name: "fechaDevolucion",
      message: "Ingrese la fecha de devolucion (YYYY-MM-DD):",
      validate: (input) => {
        const fecha = new Date(input);
        return !isNaN(fecha.getTime()) || "Fecha invalida. Use formato YYYY-MM-DD";
      }
    }
  ]);

  datos.fechaPrestamo = new Date(datos.fechaPrestamo);
  datos.fechaDevolucion = new Date(datos.fechaDevolucion);

  await insertarPrestamo(datos);
}

async function actualizarPrestamoMenu() {
  const { numero } = await inquirer.prompt([
    {
      type: "number",
      name: "numero",
      message: "Ingrese el numero de copia del prestamo a actualizar:",
      validate: (input) => !isNaN(input) || "Debe ser un numero valido"
    }
  ]);

  console.log("\n=== CAMPOS A ACTUALIZAR ===");
  console.log("1. Usuario");
  console.log("2. Fecha de Prestamo");
  console.log("3. Fecha de Devolucion");

  const { campo } = await inquirer.prompt([
    {
      type: "input",
      name: "campo",
      message: "Seleccione el campo a actualizar:",
      validate: (input) => {
        const num = parseInt(input);
        return (num >= 1 && num <= 3) || "Ingrese un numero entre 1 y 3";
      }
    }
  ]);

  const campoMap = {
    "1": "usuario",
    "2": "fechaPrestamo",
    "3": "fechaDevolucion"
  };

  const campoSeleccionado = campoMap[campo];
  let nuevosDatos = {};

  if (campoSeleccionado === "usuario") {
    const { valor } = await inquirer.prompt([
      {
        type: "input",
        name: "valor",
        message: "Ingrese el nuevo nombre del usuario:",
        validate: (input) => input.trim() !== "" || "El nombre no puede estar vacio"
      }
    ]);
    nuevosDatos[campoSeleccionado] = valor;
  } else {
    const { valor } = await inquirer.prompt([
      {
        type: "input",
        name: "valor",
        message: `Ingrese la nueva ${campoSeleccionado} (YYYY-MM-DD):`,
        validate: (input) => {
          const fecha = new Date(input);
          return !isNaN(fecha.getTime()) || "Fecha invalida. Use formato YYYY-MM-DD";
        }
      }
    ]);
    nuevosDatos[campoSeleccionado] = new Date(valor);
  }

  await actualizarPrestamo(numero, nuevosDatos);
}

async function eliminarPrestamoMenu() {
  const { numero } = await inquirer.prompt([
    {
      type: "number",
      name: "numero",
      message: "Ingrese el numero de copia del prestamo a eliminar:",
      validate: (input) => !isNaN(input) || "Debe ser un numero valido"
    }
  ]);

  await eliminarPrestamo(numero);
}

// ============ MENÚ CONSULTAS ============
async function menuConsultas() {
  const db = await connectDB();

  console.log("\n=== CONSULTAS ===");
  console.log("1. Ver todas las copias");
  console.log("2. Ver libros prestados por usuario");
  console.log("3. Volver");

  const { consulta } = await inquirer.prompt([
    {
      type: "input",
      name: "consulta",
      message: "Seleccione una opcion:",
      validate: (input) => {
        const num = parseInt(input);
        return (num >= 1 && num <= 3) || "Ingrese un numero entre 1 y 3";
      }
    }
  ]);

  switch (consulta) {
    case "1":
      await consultaCopias(db);
      break;
    case "2":
      await consultaLibrosPrestados(db);
      break;
    case "3":
      return;
  }

  await menuConsultas();
}

// ============ INICIO DEL PROGRAMA ============
async function main() {
  console.clear();
  console.log("\n=============================================");
  console.log("  SISTEMA DE GESTION DE BIBLIOTECA");
  console.log("=============================================\n");

  await connectDB();
  await menuPrincipal();
}

main().catch(console.error);