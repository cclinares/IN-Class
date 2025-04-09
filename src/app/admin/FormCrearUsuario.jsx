"use client";
import { useState, useEffect } from "react";

export default function FormCrearUsuario() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [roles, setRoles] = useState([]);
  const [mensaje, setMensaje] = useState("");

  const toggleRol = (rol) => {
    setRoles((prev) =>
      prev.includes(rol) ? prev.filter((r) => r !== rol) : [...prev, rol]
    );
  };

  const crearUsuario = async () => {
    setMensaje("Creando usuario...");
    console.log("Enviando solicitud al backend...");

    try {
      const res = await fetch("/api/crear-usuario", {
        method: "POST",
        body: JSON.stringify({ nombre, email, rol: roles }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      console.log("Respuesta del servidor:", data);
      setMensaje(data.mensaje || data.error || "Usuario creado correctamente");
    } catch (err) {
      console.error("Error al crear usuario:", err);
      setMensaje("Error al crear usuario.");
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold">Crear nuevo usuario</h2>
      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className="border p-2 mr-2"
      />
      <input
        type="email"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 mr-2"
      />

      <div className="mt-2 mb-2">
        <label className="mr-2">Roles:</label>
        {["profesor", "apoderado", "admin"].map((rol) => (
          <label key={rol} className="mr-4">
            <input
              type="checkbox"
              checked={roles.includes(rol)}
              onChange={() => toggleRol(rol)}
              className="mr-1"
            />
            {rol.charAt(0).toUpperCase() + rol.slice(1)}
          </label>
        ))}
      </div>

      <button onClick={crearUsuario} className="bg-blue-500 text-white px-4 py-2 rounded">
        Crear usuario
      </button>

      {mensaje && <p className="mt-2 text-sm text-green-700">{mensaje}</p>}
    </div>
  );
}
