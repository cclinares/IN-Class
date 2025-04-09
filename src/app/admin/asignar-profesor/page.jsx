"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AsignarProfesorPage() {
  const [asignaturas, setAsignaturas] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState("");
  const [asignaciones, setAsignaciones] = useState({});
  const [guardando, setGuardando] = useState(false);

  const cargarDatos = async () => {
    const { data: asignaturas } = await supabase
      .from("asignaturas")
      .select("*");

    const { data: profesores } = await supabase
      .from("usuarios")
      .select("id, nombre, rol");

    const { data: cursos } = await supabase
      .from("cursos")
      .select("*");

    setAsignaturas(asignaturas || []);
    setProfesores((profesores || []).filter(p => p.rol.includes("profesor")));
    setCursos(cursos || []);

    const mapa = {};
    for (const a of asignaturas || []) {
      if (a.profesor_id) {
        mapa[a.id] = a.profesor_id;
      }
    }
    setAsignaciones(mapa);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const guardarCambios = async () => {
    setGuardando(true);
    for (const [asignaturaId, profesorId] of Object.entries(asignaciones)) {
      const { error } = await supabase
        .from("asignaturas")
        .update({ profesor_id: profesorId, usuario_id: profesorId })
        .eq("id", asignaturaId);

      if (error) {
        console.error("Error al asignar:", error.message);
      }
    }
    setGuardando(false);
    await cargarDatos(); // recarga después de guardar
  };

  const handleAsignar = (asignaturaId, profesorId) => {
    setAsignaciones((prev) => ({ ...prev, [asignaturaId]: profesorId }));
  };

  const asignaturasFiltradas = asignaturas.filter(
    (a) => cursoSeleccionado === "" || a.curso_id === cursoSeleccionado
  );

  return (
    <div className="p-4">
      <a
        href="/admin"
        className="inline-block mb-4 bg-gray-100 border text-sm px-3 py-1 rounded hover:bg-gray-200"
      >
        ← Volver al panel de administrador
      </a>

      <h1 className="text-2xl font-bold mb-4">Asignar profesores</h1>

      <div className="mb-4">
        <label className="mr-2">Filtrar por curso:</label>
        <select
          value={cursoSeleccionado}
          onChange={(e) => setCursoSeleccionado(e.target.value)}
          className="border px-2 py-1"
        >
          <option value="">Todos</option>
          {cursos.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>

        <button
          className="ml-4 bg-blue-500 text-white px-3 py-1 rounded"
          onClick={cargarDatos}
        >
          Actualizar datos
        </button>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Asignatura</th>
            <th className="p-2 border">Curso</th>
            <th className="p-2 border">Profesor</th>
          </tr>
        </thead>
        <tbody>
          {asignaturasFiltradas.map((a) => {
            const curso = cursos.find((c) => c.id === a.curso_id);
            return (
              <tr key={a.id}>
                <td className="p-2 border">{a.nombre}</td>
                <td className="p-2 border">{curso?.nombre || "Sin curso"}</td>
                <td className="p-2 border">
                  <select
                    value={asignaciones[a.id] || ""}
                    onChange={(e) => handleAsignar(a.id, e.target.value)}
                    className="border px-2 py-1"
                  >
                    <option value="">Sin asignar</option>
                    {profesores.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nombre}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <button
        onClick={guardarCambios}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
        disabled={guardando}
      >
        {guardando ? "Guardando..." : "Guardar cambios"}
      </button>
    </div>
  );
}
