"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function PanelProfesor() {
  const [asignaturas, setAsignaturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(null);
  const router = useRouter();

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

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
      setUsuario(user);

      // Traer asignaturas desde la tabla usando usuario_id
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
      <header className="mb-4">
        <h1 className="text-2xl font-bold">IN-Class</h1>
        <button
          onClick={cerrarSesion}
          className="bg-gray-200 border px-2 py-1 rounded mt-2"
        >
          Cerrar sesión
        </button>
      </header>

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
