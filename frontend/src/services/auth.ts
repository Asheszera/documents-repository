import axios from "axios";

const API_URL = "http://localhost:3333/api";

export async function login(email: string, senha: string) {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, senha });

    // Supondo que o backend devolva um token
    const token = response.data.token;
    localStorage.setItem("auth_token", token);

    return true;
  } catch (error) {
    console.error("Erro no login:", error);
    return false;
  }
}

export function logout() {
  localStorage.removeItem("auth_token");
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem("auth_token");
}

export function getAuthToken(): string | null {
  return localStorage.getItem("auth_token");
}