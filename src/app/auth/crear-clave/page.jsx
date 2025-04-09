'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function CrearClavePage() {
  const supabase = createClientComponentClient();
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [mensaje, setMensaje] = useState("");

  const cambiarClave = async () => {
    if (password !== confirmar) {
      setMensaje("Las contraseñas no coinciden.");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setMensaje("Error al guardar la contraseña.");
    } else {
      setMensaje("¡Contraseña creada con éxito!");
    }
  };

  return (
    <main className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Crea tu contraseña</h1>

      <input
        type="password"
        placeholder="Nueva contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 w-full"
      />

      <input
        type="password"
        placeholder="Confirmar contraseña"
        value={confirmar}
        onChange={(e) => setConfirmar(e.target.value)}
        className="border p-2 w-full"
      />

      <button
        onClick={cambiarClave}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Guardar contraseña
      </button>

      {mensaje && <p className="text-red-600">{mensaje}</p>}
    </main>
  );
}
