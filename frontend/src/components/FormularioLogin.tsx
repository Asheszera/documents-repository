import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

// 🛡️ Schema de validação com Zod
const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(6, "Mínimo de 6 caracteres"),
});

type LoginData = z.infer<typeof loginSchema>;

export default function FormularioLogin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const [mensagem, setMensagem] = useState("");

  const onSubmit = async (data: LoginData) => {
    try {
      // Aqui você faria a requisição de login — essa é uma simulação
      console.log("Login:", data);
      setMensagem("✅ Login realizado com sucesso!");
    } catch (err) {
      console.error(err);
      setMensagem("❌ Erro ao fazer login.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        maxWidth: "400px",
        margin: "0 auto",
      }}
    >
      <h2>Login</h2>

      <input placeholder="Email" {...register("email")} />
      {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}

      <input type="password" placeholder="Senha" {...register("senha")} />
      {errors.senha && <p style={{ color: "red" }}>{errors.senha.message}</p>}

      <button type="submit">Entrar</button>

      {mensagem && <p>{mensagem}</p>}
    </form>
  );
}
