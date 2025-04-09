"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import supabase from "@/lib/supabase-browser";

export default function CrearPassword() {
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const accessToken = searchParams.get("access_token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      setMensaje("Las contraseñas no coinciden");
      return;
    }

    if (!accessToken) {
      setMensaje("Token no encontrado");
      return;
    }

    setCargando(true);

    const { error } = await supabase.auth.updateUser(
      { password },
      { accessToken }
    );

    setCargando(false);
    if (error) {
      setMensaje("Error al establecer contraseña: " + error.message);
    } else {
      setMensaje("Contraseña actualizada correctamente");
      window.location.href = "/profesor";
    }
  };

  return (
    <div>
      <h1>Crear tu contraseña</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        <br />
        <button type="submit" disabled={cargando}>
          {cargando ? "Estableciendo..." : "Establecer contraseña"}
        </button>
      </form>
      <p>{mensaje}</p>
    </div>
  );
}
