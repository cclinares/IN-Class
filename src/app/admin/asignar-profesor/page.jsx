"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function AsignarProfesorPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [autorizado, setAutorizado] = useState(false);
  const [asignaturas, setAsignaturas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const rol = userData?.user?.user_metadata?.rol;

      if (rol !== "admin" && !rol?.includes("admin")) {
        router.push("/");
        return;
      }

      setAutorizado(true);

      const { data: asignaturasData } = await supabase
        .from("asignaturas")
        .select("id, nombre, profesor_id");

      const { data: usuariosData } = await supabase
        .from("usuarios")
        .select("id, nombre, rol");

      setAsignaturas(asignaturasData || []);
      setUsuarios((usuariosData || []).filter((u) =>
        u.rol?.includes("profesor")
      ));
    };

    cargarDatos();
  }, []);

  const asignarProfesor = async (asignaturaId, profesorId) => {
    setGuardando(true);
    const { error } = await supabase
      .from("asignaturas")
      .update({ profesor_id: profesorId })
      .eq("id", asignaturaId);

    if (error) {
      alert("Error al asignar profesor: " + error.message);
    } else {
      setAsignaturas((prev) =>
        prev.map((a) =>
          a.id === asignaturaId ? { ...a, profesor_id: profesorId } : a
        )
      );
    }

    setGuardando(false);
  };

  if (!autorizado) return null;

  return (
    <main className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-blue-700">Asignar Profesores</h1>

      {asignaturas.map((asig) => (
        <div key={asig.id} className="bg-white p-4 rounded shadow border">
          <h2 className="font-semibold text-lg">{asig.nombre}</h2>
          <select
            className="mt-2 p-2 border rounded"
            value={asig.profesor_id || ""}
            onChange={(e) => asignarProfesor(asig.id, e.target.value)}
            disabled={guardando}
          >
            <option value="">-- Selecciona un profesor --</option>
            {usuarios.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nombre}
              </option>
            ))}
          </select>
        </div>
      ))}
    </main>
  );
}
