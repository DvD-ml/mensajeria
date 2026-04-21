import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ChatPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Chat</h1>
      <p>Bienvenido {user?.nombre}</p>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
}