"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function AdminPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      const { data } = await supabase.auth.getUser();
      const rol = data?.user?.user_metadata?.rol;

      if (rol === "admin" || (Array.isArray(rol) && rol.includes("admin"))) {
        setAuthorized(true);
      } else {
        router.push("/");
      }
    };

    checkRole();
  }, [router, supabase]);

  if (!authorized) return null;

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold text-blue-700">Panel de Administrador</h1>
      <p className="mt-4 text-gray-600">
        Bienvenido al panel de control del sistema IN-Class.
      </p>
    </main>
  );
}
