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
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchAsignaturas = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        console.log("👤 Usuario:", user);

        if (userError || !user) {
          console.error("❌ No se pudo obtener el usuario:", userError);
          setErrorMsg("No se pudo obtener el usuario autenticado.");
          setLoading(false);
          return;
        }

        const userId = user.id;
        console.log("🔍 Buscando asignaturas para usuario_id:", userId);

        const { data: asignaturasData, error } = await supabase
          .from("asignaturas")
          .select("id, nombre, curso_id, cursos(nombre)")
          .eq("usuario_id", userId);

        if (error) {
          console.error("❌ Error al traer asignaturas:", error.message);
          setErrorMsg("Error al cargar las asignaturas.");
        } else {
          console.log("✅ Asignaturas encontradas:", asignaturasData);
          setAsignaturas(asignaturasData);
        }
      } catch (err) {
        console.error("❌ Error inesperado:", err);
        setErrorMsg("Error inesperado al cargar asignaturas.");
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
        ) : errorMsg ? (
          <p className="text-red-600">{errorMsg}</p>
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
