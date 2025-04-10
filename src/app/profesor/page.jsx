// src/app/profesor/page.jsx
"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

export default function PanelProfesor() {
  const [asignaturas, setAsignaturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    const obtenerAsignaturas = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.user) {
        console.log("❌ No se pudo obtener el usuario:", sessionError);
        setLoading(false);
        return;
      }

      const user = session.user;
      setUsuario(user);

      const { data, error } = await supabase
        .from("asignaturas")
        .select("id, nombre, curso:curso_id(nombre)")
        .eq("usuario_id", user.id);

      if (error) {
        console.error("❌ Error al obtener asignaturas:", error.message);
      } else {
        setAsignaturas(data);
      }

      setLoading(false);
    };

    obtenerAsignaturas();
  }, []);

  return (
    <div>
      <h1>IN-Class</h1>
      <button onClick={() => supabase.auth.signOut()}>Cerrar sesión</button>

      <h2>Asignaturas que impartes</h2>

      {loading ? (
        <p>Cargando asignaturas...</p>
      ) : asignaturas.length === 0 ? (
        <p>No tienes asignaturas asignadas.</p>
      ) : (
        <ul>
          {asignaturas.map((a) => (
            <li key={a.id}>
              {a.nombre} ({a.curso?.nombre || "Sin curso"})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
