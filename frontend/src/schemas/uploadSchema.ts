import { z } from "zod";

// 🧾 Esquema de validação para envio de arquivos
export const uploadSchema = z.object({
  pacienteId: z.number().int().positive("Paciente inválido"),
  descricao: z.string().min(3, "Descrição muito curta"),
  arquivos: z
    .any()
    .refine((files) => files && files.length > 0, "Envie pelo menos um arquivo"),
});