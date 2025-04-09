"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

function CrearPasswordInner() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const searchParams = useSearchParams();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
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
    if (password !== confirm) {
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
      setMensaje("Contraseña creada correctamente. Redirigiendo...");
      setTimeout(() => router.push("/"), 3000);
    }
  };

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">Crear tu contraseña</h1>

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
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      />
      <button
        onClick={actualizarPassword}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Guardar contraseña
      </button>

      {mensaje && <p className="mt-4 text-center text-red-600">{mensaje}</p>}
    </main>
  );
}

export default function CrearPasswordPage() {
  return (
    <Suspense fallback={<p className="p-6">Cargando formulario...</p>}>
      <CrearPasswordInner />
    </Suspense>
  );
}
