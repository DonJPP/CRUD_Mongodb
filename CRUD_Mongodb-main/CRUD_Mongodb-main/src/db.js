import {MongoClient} from "mongodb";

const uri = "mongodb://localhost:27017"
const client = new MongoClient(uri);


export async function connectDB() {
  try {
    await client.connect();
    console.log("Conectado a MongoDB");
    const db = client.db("biblioteca");
    return db;
  } catch (error) {
    console.error("Error al conectar con MongoDB:", error);
  }
}

