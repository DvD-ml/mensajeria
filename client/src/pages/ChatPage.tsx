import { useAuth } from "../context/AuthContext";

export default function ChatPage() {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: 40 }}>
      <h1>Chat</h1>
      <p>Bienvenido {user?.nombre}</p>

      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
}