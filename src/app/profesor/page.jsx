"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function PanelProfesor() {
  const [asignaturas, setAsignaturas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAsignaturas = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("No se pudo obtener el usuario autenticado");
        return;
      }

      const userId = user.id;

      const { data: asignaturasData, error } = await supabase
        .from("asignaturas")
        .select("id, nombre, curso_id, cursos(nombre)")
        .eq("usuario_id", userId);

      if (error) {
        console.error("Error al traer asignaturas:", error);
      } else {
        setAsignaturas(asignaturasData);
      }

      setLoading(false);
    };

    fetchAsignaturas();
  }, []);

  return (
    <div className="p-4">
      <main>
        <h2 className="text-xl font-semibold mb-4">Asignaturas que impartes</h2>
        {loading ? (
          <p>Cargando asignaturas...</p>
        ) : asignaturas.length === 0 ? (
          <p>No tienes asignaturas asignadas.</p>
        ) : (
          <ul className="list-disc ml-6">
            {asignaturas.map((asig) => (
              <li key={asig.id}>
                {asig.nombre} – Curso: {asig.cursos?.nombre || "Sin curso"}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
