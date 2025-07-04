import { z } from "zod";

// 🎯 Esquema de validação para login
export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(6, "A senha precisa de no mínimo 6 caracteres"),
});