'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

function CallbackInner() {
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
          router.push("/auth/crear-clave"); // redirige a página de cambio de clave
        }
      } else {
        setMensaje("Token inválido o expirado.");
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

export default function CallbackPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <CallbackInner />
    </Suspense>
  );
}
