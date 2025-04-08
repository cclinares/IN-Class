"use client";

import { useState } from "react";

export default function FormCrearUsuario({ onUsuarioCreado }) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState("profesor");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const crearUsuario = async () => {
    setCargando(true);
    setMensaje("Creando usuario...");

    const res = await fetch("/api/crear-usuario", {
      method: "POST",
      body: JSON.stringify({ nombre, email, rol }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (res.ok) {
      setMensaje("✅ Usuario creado correctamente");
      setNombre("");
      setEmail("");
      setRol("profesor");
      onUsuarioCreado?.(); // refresca la lista si se pasa como prop
    } else {
      setMensaje(`❌ Error: ${data.detalle || "Algo falló"}`);
    }

    setCargando(false);
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h2 className="text-lg font-bold mb-2 text-blue-700">Crear nuevo usuario</h2>

      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="p-2 border rounded w-full"
        />
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border rounded w-full"
        />
        <select
          value={rol}
          onChange={(e) => setRol(e.target.value)}
          className="p-2 border rounded w-full"
        >
          <option value="profesor">Profesor</option>
          <option value="apoderado">Apoderado</option>
          <option value="admin">Administrador</option>
        </select>
      </div>

      <button
        onClick={crearUsuario}
        disabled={cargando}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        {cargando ? "Creando..." : "Crear usuario"}
      </button>

      {mensaje && <p className="mt-3 text-sm text-gray-700">{mensaje}</p>}
    </div>
  );
}
