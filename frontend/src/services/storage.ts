import axios from "axios";

const API_URL = "http://localhost:3333/api";

/**
 * Envia múltiplos arquivos vinculados a um paciente.
 * @param pacienteId ID do paciente
 * @param arquivos Lista de arquivos selecionados
 */
export async function enviarArquivos(pacienteId: number, arquivos: FileList) {
  const formData = new FormData();

  Array.from(arquivos).forEach((file) => {
    formData.append("arquivos", file);
  });

  formData.append("pacienteId", String(pacienteId));

  const response = await axios.post(`${API_URL}/arquivos`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

/**
 * Lista todos os arquivos armazenados para um paciente específico.
 * @param pacienteId ID do paciente
 */
export async function listarArquivosPorPaciente(pacienteId: number) {
  const response = await axios.get(`${API_URL}/pacientes/${pacienteId}/arquivos`);
  return response.data;
}