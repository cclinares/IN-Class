'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function CallbackPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mensaje, setMensaje] = useState("Verificando token...");

  useEffect(() => {
    const verificarToken = async () => {
      const access_token = searchParams.get("access_token");
      const refresh_token = searchParams.get("refresh_token");

      if (access_token && refresh_token) {
        const { error } = await supabase.auth.setSession({
          access_token,
          refresh_token
        });

        if (error) {
          setMensaje("Error al establecer sesión.");
        } else {
          router.push("/auth/crear-clave"); // Redirige a la página donde creará la clave
        }
      } else {
        setMensaje("Token inválido.");
      }
    };

    verificarToken();
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-xl font-bold">Iniciando sesión...</h1>
      <p>{mensaje}</p>
    </main>
  );
}
