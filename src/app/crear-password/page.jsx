"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

function CrearPasswordInner() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const tokensDesdeHash = async () => {
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.replace("#", "?"));

      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (access_token && refresh_token) {
        const { error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });

        if (error) {
          setMensaje("❌ Error al autenticar sesión.");
        }
      } else {
        setMensaje("❌ Enlace inválido o expirado.");
      }

      setCargando(false);
    };

    tokensDesdeHash();
  }, []);

  const actualizarPassword = async () => {
    if (password !== confirmar) {
      setMensaje("⚠️ Las contraseñas no coinciden.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMensaje("❌ Error al establecer contraseña: " + error.message);
    } else {
      setMensaje("✅ Contraseña creada con éxito. Redirigiendo...");
      setTimeout(() => router.push("/"), 3000);
    }
  };

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Crear nueva contraseña</h1>

      {cargando ? (
        <p>Cargando...</p>
      ) : (
        <>
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
        </>
      )}
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
