import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Dashboard</h1>
      <p>Bienvenido {user?.nombreMostrar}</p>
      <p>Email: {user?.email}</p>
      <p>Rol: {user?.rol}</p>

      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
}