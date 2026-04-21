import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registroInicialRequest } from "../../services/authService";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!nombre.trim() || !email.trim() || !password.trim()) {
      setError("Completa los campos obligatorios");
      return;
    }

    try {
      setLoading(true);

      await registroInicialRequest({
        nombre,
        apellidos,
        email,
        password,
      });

      // 👉 REDIRECCIÓN A LOGIN
      navigate("/login");

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error al registrarse");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Registro</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Apellidos"
          value={apellidos}
          onChange={(e) => setApellidos(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />

        <button type="submit" disabled={loading}>
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <p style={{ marginTop: 16 }}>
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </div>
  );
}