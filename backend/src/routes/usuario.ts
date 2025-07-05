import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connectDB from "../config/db";

const router = express.Router();
const SECRET = "sua_chave_secreta_super_segura"; // Use .env depois!

// Cadastro
router.post("/usuarios", async (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) return res.status(400).json({ erro: "Campos obrigatórios" });

  try {
    const db = await connectDB();
    const existe = await db.get(`SELECT * FROM usuario WHERE email = ?`, [email]);
    if (existe) return res.status(409).json({ erro: "Email já cadastrado" });

    const hash = await bcrypt.hash(senha, 10);
    await db.run(`INSERT INTO usuario (nome, email, senha) VALUES (?, ?, ?)`, [nome, email, hash]);
    res.status(201).json({ sucesso: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao cadastrar usuário" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ erro: "Informe email e senha" });

  try {
    const db = await connectDB();
    const usuario = await db.get(`SELECT * FROM usuario WHERE email = ?`, [email]);
    if (!usuario) return res.status(401).json({ erro: "Usuário não encontrado" });

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) return res.status(401).json({ erro: "Senha incorreta" });

    const token = jwt.sign({ id: usuario.id, email: usuario.email }, SECRET, { expiresIn: "2h" });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro no login" });
  }
});

export default router;