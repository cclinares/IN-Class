"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

function CrearPasswordInner() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace("#", "?"));
    const accessToken = params.get("access_token");

    if (accessToken) {
      setToken(accessToken);
    } else {
      setMensaje("Token inválido o expirado.");
    }
  }, []);

  const actualizarPassword = async () => {
    if (password !== confirmar) {
      setMensaje("Las contraseñas no coinciden");
      return;
    }

    const { error } = await supabase.auth.updateUser(
      { password },
      { accessToken: token }
    );

    if (error) {
      setMensaje("Error al establecer contraseña: " + error.message);
    } else {
      setMensaje("Contraseña creada. Redirigiendo...");
      setTimeout(() => router.push("/"), 3000);
    }
  };

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Crear nueva contraseña</h1>

      <input
        type="password"
        placeholder="Nueva contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      />
      <input
        type="password"
        placeholder="Confirmar contraseña"
        value={confirmar}
        onChange={(e) => setConfirmar(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      />
      <button
        onClick={actualizarPassword}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Guardar contraseña
      </button>

      {mensaje && <p className="mt-4 text-center">{mensaje}</p>}
    </main>
  );
}

export default function CrearPasswordPage() {
  return (
    <Suspense fallback={<div className="p-6">Cargando formulario...</div>}>
      <CrearPasswordInner />
    </Suspense>
  );
}
