const API_URL = "http://localhost:4000/api/auth";

export type UsuarioAuth = {
  id: number;
  nombre: string;
  apellidos?: string | null;
  nombreMostrar: string;
  email: string;
  rol: string;
  empresa: string;
  cargo?: string | null;
  departamento?: string | null;
};

export async function loginRequest(email: string, password: string) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al iniciar sesión");
  }

  return data as {
    token: string;
    usuario: UsuarioAuth;
  };
}

export async function meRequest() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/me`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al obtener usuario");
  }

  return data as UsuarioAuth;
}