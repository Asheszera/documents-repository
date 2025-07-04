import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import axios from "axios";
import { z } from "zod";

// 🎯 Schema com Zod
const schema = z.object({
  nome: z.string().min(2, "Nome obrigatório"),
  email: z.string().email("E-mail inválido"),
});

type FormData = z.infer<typeof schema>;

export default function FormularioPaciente() {
  const [arquivos, setArquivos] = useState<FileList | null>(null);
  const [sucesso, setSucesso] = useState<boolean | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    if (!arquivos || arquivos.length === 0) {
      alert("Selecione pelo menos um arquivo");
      return;
    }

    const formData = new FormData();
    formData.append("nome", data.nome);
    formData.append("email", data.email);
    Array.from(arquivos).forEach((file) => formData.append("arquivos", file));

    try {
      await axios.post("http://localhost:3333/api/pacientes", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSucesso(true);
    } catch (error) {
      console.error(error);
      setSucesso(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
      <h2>Cadastro de Paciente</h2>

      <input placeholder="Nome" {...register("nome")} />
      {errors.nome && <p>{errors.nome.message}</p>}

      <input placeholder="Email" type="email" {...register("email")} />
      {errors.email && <p>{errors.email.message}</p>}

      <input
        type="file"
        multiple
        onChange={(e) => setArquivos(e.target.files)}
      />

      <button type="submit">Enviar</button>

      {sucesso === true && (
        <p style={{ color: "green" }}>Cadastro realizado com sucesso!</p>
      )}
      {sucesso === false && (
        <p style={{ color: "red" }}>Erro ao enviar dados.</p>
      )}
    </form>
  );
}
