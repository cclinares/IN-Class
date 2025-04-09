"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function AsignarProfesorPage() {
  const supabase = createClientComponentClient();
  const [asignaturas, setAsignaturas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [cursoFiltrado, setCursoFiltrado] = useState("");
  const [asignaciones, setAsignaciones] = useState({});
  const [mensaje, setMensaje] = useState("");

  const cargarDatos = async () => {
    const { data: asignaturasData } = await supabase
      .from("asignaturas")
      .select("id, nombre, curso_id, cursos(nombre), profesor_id, usuario_id");

    const { data: usuariosData } = await supabase
      .from("usuarios")
      .select("id, nombre, rol");

    const { data: cursosData } = await supabase.from("cursos").select("id, nombre");

    setAsignaturas(asignaturasData || []);
    setUsuarios(usuariosData || []);
    setCursos(cursosData || []);

    const asignacionesIniciales = {};
    (asignaturasData || []).forEach((a) => {
      asignacionesIniciales[a.id] = a.profesor_id || a.usuario_id || "";
    });
    setAsignaciones(asignacionesIniciales);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const profesores = usuarios.filter((u) => u.rol?.includes("profesor"));
  const asignaturasFiltradas = cursoFiltrado
    ? asignaturas.filter((a) => a.curso_id === cursoFiltrado)
    : asignaturas;

  const guardarAsignacion = async (asignaturaId) => {
    const profesorId = asignaciones[asignaturaId];

    const { error } = await supabase
      .from("asignaturas")
      .update({
        profesor_id: profesorId,
        usuario_id: profesorId, // 🔁 aseguramos sincronización
      })
      .eq("id", asignaturaId);

    if (error) {
      setMensaje("❌ Error al guardar asignación.");
    } else {
      setMensaje("✅ Asignación guardada correctamente.");
      setTimeout(() => setMensaje(""), 3000);
    }

    await cargarDatos();
  };

  return (
    <main className="p-6 space-y-6">
      <a
        href="/admin"
        className="inline-block mb-4 bg-gray-100 border text-sm px-3 py-1 rounded hover:bg-gray-200"
      >
        ← Volver al panel de administrador
      </a>

      <h1 className="text-2xl font-bold text-blue-700">Asignar Profesores a Asignaturas</h1>

      <div className="flex flex-wrap items-center gap-4 mb-4">
        <button
          onClick={cargarDatos}
          className="bg-gray-200 px-4 py-2 rounded border hover:bg-gray-300"
        >
          🔁 Actualizar datos
        </button>

        <div>
          <label className="mr-2 font-semibold">Filtrar por curso:</label>
          <select
            value={cursoFiltrado}
            onChange={(e) => setCursoFiltrado(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Todos</option>
            {cursos.map((curso) => (
              <option key={curso.id} value={curso.id}>
                {curso.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {mensaje && <p className="text-sm text-green-600">{mensaje}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {asignaturasFiltradas.map((asignatura) => (
          <div
            key={asignatura.id}
            className="border rounded-lg p-4 shadow bg-white space-y-2"
          >
            <h2 className="text-lg font-semibold">{asignatura.nombre}</h2>
            <p className="text-sm text-gray-500">
              Curso: {asignatura.cursos?.nombre || "Sin curso"}
            </p>

            <select
              value={asignaciones[asignatura.id] || ""}
              onChange={(e) =>
                setAsignaciones((prev) => ({
                  ...prev,
                  [asignatura.id]: e.target.value,
                }))
              }
              className="p-2 border rounded w-full"
            >
              <option value="">Seleccionar profesor</option>
              {profesores.map((profesor) => (
                <option key={profesor.id} value={profesor.id}>
                  {profesor.nombre}
                </option>
              ))}
            </select>

            <button
              onClick={() => guardarAsignacion(asignatura.id)}
              className="bg-blue-600 text-white px-3 py-1 rounded mt-2"
            >
              Guardar cambios
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
