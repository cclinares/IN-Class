"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function AsignarProfesorPage() {
  const supabase = createClientComponentClient();
  const [asignaturas, setAsignaturas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [cursoFiltrado, setCursoFiltrado] = useState("");

  useEffect(() => {
    const cargarDatos = async () => {
      const { data: asignaturasData } = await supabase
        .from("asignaturas")
        .select("id, nombre, curso_id, cursos(nombre), profesor_id");

      const { data: usuariosData } = await supabase
        .from("usuarios")
        .select("id, nombre, rol");

      const { data: cursosData } = await supabase.from("cursos").select("id, nombre");

      setAsignaturas(asignaturasData || []);
      setUsuarios(usuariosData || []);
      setCursos(cursosData || []);
    };

    cargarDatos();
  }, []);

  const asignarProfesor = async (asignaturaId, profesorId) => {
    await supabase
      .from("asignaturas")
      .update({ profesor_id: profesorId })
      .eq("id", asignaturaId);

    // Refrescar después de actualizar
    const { data: asignaturasActualizadas } = await supabase
      .from("asignaturas")
      .select("id, nombre, curso_id, cursos(nombre), profesor_id");

    setAsignaturas(asignaturasActualizadas || []);
  };

  const profesores = usuarios.filter((u) => u.rol.includes("profesor"));
  const cursosUnicos = [...new Set(asignaturas.map((a) => a.curso_id))];

  const asignaturasFiltradas = cursoFiltrado
    ? asignaturas.filter((a) => a.curso_id === cursoFiltrado)
    : asignaturas;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Asignar Profesores a Asignaturas</h1>

      <label className="block mb-2 font-semibold">Filtrar por curso:</label>
      <select
        value={cursoFiltrado}
        onChange={(e) => setCursoFiltrado(e.target.value)}
        className="mb-6 p-2 border rounded"
      >
        <option value="">Todos</option>
        {cursos.map((curso) => (
          <option key={curso.id} value={curso.id}>
            {curso.nombre}
          </option>
        ))}
      </select>

      <div className="space-y-4">
        {asignaturasFiltradas.map((asignatura) => {
          const profesorAsignado = profesores.find((p) => p.id === asignatura.profesor_id);

          return (
            <div key={asignatura.id} className="border rounded-lg p-4 shadow bg-white">
              <h2 className="font-semibold text-lg">{asignatura.nombre}</h2>
              <p className="text-sm text-gray-500 mb-2">
                Curso: {asignatura.cursos?.nombre || "Sin curso"}
              </p>

              <select
                value={asignatura.profesor_id || ""}
                onChange={(e) => asignarProfesor(asignatura.id, e.target.value)}
                className="p-2 border rounded"
              >
                <option value="">Seleccionar profesor</option>
                {profesores.map((profesor) => (
                  <option key={profesor.id} value={profesor.id}>
                    {profesor.nombre}
                  </option>
                ))}
              </select>

              {profesorAsignado && (
                <p className="text-sm mt-1 text-green-700">
                  Profesor asignado: <strong>{profesorAsignado.nombre}</strong>
                </p>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
