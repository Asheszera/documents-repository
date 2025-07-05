import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

sqlite3.verbose();

export default async function connectDB() {
  const dbPath = path.resolve(__dirname, "../db/pacientes.sqlite");

  return open({
    filename: dbPath,
    driver: sqlite3.Database
  });
}