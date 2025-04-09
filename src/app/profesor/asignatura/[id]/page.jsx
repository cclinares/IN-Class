"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function DetalleAsignaturaPage() {
  const supabase = createClientComponentClient();
  const params = useParams();
  const router = useRouter();

  const [asignatura, setAsignatura] = useState(null);
  const [estudiantes, setEstudiantes] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      const id = params.id;

      // Obtener la asignatura
      const { data: asig, error: errorAsig } = await supabase
        .from("asignaturas")
        .select("id, nombre, curso_id, cursos(nombre)")
        .eq("id", id)
        .single();

      if (errorAsig) {
        console.error("Error al cargar asignatura:", errorAsig.message);
        return;
      }

      setAsignatura(asig);

      // Obtener estudiantes del curso
      const { data: ests, error: errorEsts } = await supabase
        .from("estudiantes")
        .select("*")
        .eq("curso_id", asig.curso_id);

      if (errorEsts) {
        console.error("Error al cargar estudiantes:", errorEsts.message);
        return;
      }

      setEstudiantes(ests);
      setCargando(false);
    };

    cargarDatos();
  }, []);

  if (cargando) return <p className="p-6">Cargando información...</p>;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">
        {asignatura.nombre} - Curso {asignatura.cursos?.nombre}
      </h1>

      <h2 className="text-lg font-semibold text-gray-700 mb-2">Estudiantes del curso:</h2>

      <ul className="list-disc pl-6">
        {estudiantes.map((est) => (
          <li key={est.id}>{est.nombre}</li>
        ))}
      </ul>
    </main>
  );
}
