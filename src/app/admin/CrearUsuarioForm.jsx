"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function CrearUsuarioForm({ onUsuarioCreado }) {
  const supabase = createClientComponentClient();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState("estudiante");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const generarPassword = () => {
    const caracteres = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    return Array.from({ length: 10 }, () =>
      caracteres.charAt(Math.floor(Math.random() * caracteres.length))
    ).join("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje("");

    const password = generarPassword();

    const { error: errorAuth } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
      user_metadata: {
        nombre,
        rol,
      },
    });

    if (errorAuth) {
      setMensaje(`❌ Error al crear usuario: ${errorAuth.message}`);
      setCargando(false);
      return;
    }

    const { error: errorTabla } = await supabase.from("usuarios").insert([
      {
        nombre,
        email,
        rol: [rol],
      },
    ]);

    if (errorTabla) {
      setMensaje(`❌ Error al insertar en tabla usuarios: ${errorTabla.message}`);
    } else {
      setMensaje("✅ Usuario creado correctamente.");
      onUsuarioCreado?.(); // Actualiza tabla si existe handler
      setNombre("");
      setEmail("");
      setRol("estudiante");
    }

    setCargando(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow max-w-md">
      <h2 className="text-lg font-semibold text-blue-700">Crear nuevo usuario</h2>

      <input
        type="text"
        placeholder="Nombre completo"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full p-2 border rounded"
      />
      <select
        value={rol}
        onChange={(e) => setRol(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="estudiante">Estudiante</option>
        <option value="apoderado">Apoderado</option>
        <option value="profesor">Profesor</option>
        <option value="admin">Administrador</option>
      </select>

      <button
        type="submit"
        disabled={cargando}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        {cargando ? "Creando..." : "Crear usuario"}
      </button>

      {mensaje && <p className="text-sm mt-2">{mensaje}</p>}
    </form>
  );
}
