"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function ProfesorPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [asignaturas, setAsignaturas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [autorizado, setAutorizado] = useState(false);

  useEffect(() => {
    const obtenerAsignaturas = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      // Verifica el rol del usuario
      const rol = user?.user_metadata?.rol;
      if (!rol || (!rol.includes("profesor") && rol !== "profesor")) {
        router.push("/");
        return;
      }

      setAutorizado(true);

      // 👉 Mostrar el ID del usuario logueado para comprobarlo en Supabase
      console.log("ID del usuario logueado:", user.id);

      // Buscar asignaturas donde usuario_id = user.id
      const { data: asignaturasData, error } = await supabase
        .from("asignaturas")
        .select("id, nombre, curso_id, cursos(nombre)")
        .eq("usuario_id", user.id);

      if (error) {
        console.error("Error al cargar asignaturas:", error.message);
        return;
      }

      setAsignaturas(asignaturasData);
      setCargando(false);
    };

    obtenerAsignaturas();
  }, []);

  if (!autorizado) return null;

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-blue-700">Panel de Profesor</h1>

      {cargando ? (
        <p>Cargando asignaturas...</p>
      ) : asignaturas.length === 0 ? (
        <p>No tienes asignaturas asignadas.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {asignaturas.map((asignatura) => (
            <div
              key={asignatura.id}
              className="border rounded-lg p-4 shadow bg-white"
            >
              <h2 className="text-lg font-semibold text-gray-800">
                {asignatura.nombre}
              </h2>
              <p className="text-gray-600">
                Curso:{" "}
                <strong>{asignatura.cursos?.nombre || "Sin curso"}</strong>
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
