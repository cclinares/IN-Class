"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export default function CrearPassword() {
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
  );

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const tipo = searchParams.get("type");
    const token = searchParams.get("access_token");

    if (tipo === "signup" && token) {
      supabase.auth
        .setSession({ access_token: token, refresh_token: "" })
        .then(() => {
          setLoading(false);
        })
        .catch(() => {
          setMensaje("Error al establecer sesión");
        });
    } else {
      setLoading(false);
    }
  }, [searchParams, supabase]);

  const manejarSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmar) {
      setMensaje("Las contraseñas no coinciden");
      return;
    }

    const { data: userData, error: sessionError } = await supabase.auth.getUser();
    if (sessionError || !userData?.user?.id) {
      setMensaje("No se pudo obtener sesión del usuario");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setMensaje("Error al actualizar la contraseña");
    } else {
      setMensaje("Contraseña creada correctamente");
      router.push("/profesor");
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div>
      <h1>Crear contraseña</h1>
      <form onSubmit={manejarSubmit}>
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmar}
          onChange={(e) => setConfirmar(e.target.value)}
        />
        <button type="submit">Establecer contraseña</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}
