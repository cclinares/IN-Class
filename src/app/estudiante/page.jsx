"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function EstudiantePage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      const { data } = await supabase.auth.getUser();
      const rol = data?.user?.user_metadata?.rol;

      if (rol === "estudiante" || (Array.isArray(rol) && rol.includes("estudiante"))) {
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
      <h1 className="text-3xl font-bold text-orange-700">Panel del Estudiante</h1>
      <p className="mt-4 text-gray-600">Revisa tus clases, tareas y avances.</p>
    </main>
  );
}
