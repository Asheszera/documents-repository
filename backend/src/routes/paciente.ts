import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { connectDB } from "../db/database";

const router = Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (_, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

router.get("/arquivos", async (_, res) => {
  try {
    const db = await connectDB();
    const arquivos = await db.all(`SELECT * FROM arquivos`);
    res.json(arquivos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar arquivos." });
  }
});

router.get("/pacientes", async (_, res) => {
  try {
    const db = await connectDB();
    const pacientes = await db.all("SELECT * FROM paciente");
    res.json(pacientes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar pacientes." });
  }
});

router.post("/pacientes", upload.array("arquivos", 10), async (req, res) => {
  const { nome, email } = req.body;
  const arquivos = req.files as Express.Multer.File[];

  try {
    const db = await connectDB();

    await db.exec(`
      CREATE TABLE IF NOT EXISTS paciente (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        email TEXT
      );
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS arquivos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        paciente_id INTEGER,
        nome_arquivo TEXT,
        caminho TEXT
      );
    `);

    const result = await db.run(`INSERT INTO paciente (nome, email) VALUES (?, ?)`, [nome, email]);
    const pacienteId = result.lastID;

    for (const file of arquivos) {
      await db.run(`INSERT INTO arquivos (paciente_id, nome_arquivo, caminho) VALUES (?, ?, ?)`, [
        pacienteId,
        file.originalname,
        file.filename
      ]);
    }

    res.status(201).json({ sucesso: true, pacienteId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao salvar paciente." });
  }
});

router.get("/pacientes/:id/arquivos", async (req, res) => {
  const { id } = req.params;

  try {
    const db = await connectDB();

    const arquivos = await db.all(
      `SELECT id, nome_arquivo, caminho FROM arquivos WHERE paciente_id = ?`,
      [id]
    );

    res.json(arquivos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar arquivos." });
  }
});

router.post("/arquivos", upload.array("arquivos", 10), async (req, res): Promise<void> => {
  const { pacienteId } = req.body;
  const arquivos = req.files as Express.Multer.File[];

  if (!pacienteId || arquivos.length === 0) {
    res.status(400).json({ erro: "Paciente e arquivos obrigatórios." });
    return;
  }

  try {
    const db = await connectDB();

    for (const file of arquivos) {
      await db.run(
        `INSERT INTO arquivos (paciente_id, nome_arquivo, caminho) VALUES (?, ?, ?)`,
        [pacienteId, file.originalname, file.filename]
      );
    }

    res.status(201).json({ sucesso: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao salvar arquivos." });
  }
});

export default router;