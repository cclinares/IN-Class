"use client";
import { useState } from "react";

export default function FormCrearUsuario() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState("profesor");
  const [mensaje, setMensaje] = useState("");

  const crearUsuario = async () => {
    setMensaje("Creando usuario...");
    console.log("🚀 Enviando solicitud al backend...");

    try {
      const res = await fetch("/api/crear-usuario", {
        method: "POST",
        body: JSON.stringify({ nombre, email, rol }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      console.log("📦 Respuesta del servidor:", data);
      setMensaje(data.mensaje || data.error || "Usuario creado correctamente");
    } catch (err) {
      console.error("❌ Error al crear usuario:", err);
      setMensaje("Error al crear usuario.");
    }
  };

  return (
    <div className="mb-4">
      <h2>Crear nuevo usuario</h2>
      <input
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className="mr-2"
      />
      <input
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mr-2"
      />
      <select value={rol} onChange={(e) => setRol(e.target.value)} className="mr-2">
        <option value="profesor">Profesor</option>
        <option value="apoderado">Apoderado</option>
        <option value="admin">Admin</option>
      </select>
      <button onClick={crearUsuario} disabled={!nombre || !email}>
        Crear usuario
      </button>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}
