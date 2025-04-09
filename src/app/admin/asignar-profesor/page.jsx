"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function AsignarProfesor() {
  const supabase = createClientComponentClient();
  const [asignaturas, setAsignaturas] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const cargarDatos = async () => {
      const { data: asig } = await supabase
        .from("asignaturas")
        .select("id, nombre, curso_id, profesor_id, cursos(nombre)");

      const { data: profs } = await supabase
        .from("usuarios")
        .select("id, nombre, rol");

      const { data: cursosData } = await supabase
        .from("cursos")
        .select("id, nombre");

      setAsignaturas(asig || []);
      setProfesores(profs?.filter((p) => p.rol.includes("profesor")) || []);
      setCursos(cursosData || []);
    };

    cargarDatos();
  }, []);

  const guardarCambios = async () => {
    setMensaje("Guardando...");
    for (const asignatura of asignaturas) {
      const { id, profesor_id } = asignatura;
      if (profesor_id) {
        const { error } = await supabase
          .from("asignaturas")
          .update({ profesor_id, usuario_id: profesor_id }) // 🔄 sincroniza ambos campos
          .eq("id", id);

        if (error) {
          console.error("Error al guardar:", error.message);
        }
      }
    }
    setMensaje("Cambios guardados.");
  };

  const actualizarLista = async () => {
    const { data: asig } = await supabase
      .from("asignaturas")
      .select("id, nombre, curso_id, profesor_id, cursos(nombre)");

    setAsignaturas(asig || []);
  };

  const handleSeleccion = (asignaturaId, profesorId) => {
    setAsignaturas((prev) =>
      prev.map((a) =>
        a.id === asignaturaId ? { ...a, profesor_id: profesorId } : a
      )
    );
  };

  const asignaturasFiltradas = cursoSeleccionado
    ? asignaturas.filter((a) => a.curso_id === cursoSeleccionado)
    : asignaturas;

  return (
    <main className="p-6 space-y-4">
      <a
        href="/admin"
        className="inline-block mb-4 bg-gray-100 border text-sm px-3 py-1 rounded hover:bg-gray-200"
      >
        ← Volver al panel de administrador
      </a>

      <h1 className="text-xl font-bold">Asignar Profesores a Asignaturas</h1>

      <label className="block">
        Filtrar por curso:
        <select
          className="ml-2"
          value={cursoSeleccionado}
          onChange={(e) => setCursoSeleccionado(e.target.value)}
        >
          <option value="">Todos</option>
          {cursos.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
        <button
          onClick={actualizarLista}
          className="ml-2 px-2 py-1 text-sm bg-blue-100 rounded hover:bg-blue-200"
        >
          Actualizar
        </button>
      </label>

      <ul>
        {asignaturasFiltradas.map((asig) => (
          <li key={asig.id} className="mb-2">
            <strong>{asig.nombre}</strong> ({asig.cursos?.nombre || "Sin curso"})
            <select
              className="ml-2"
              value={asig.profesor_id || ""}
              onChange={(e) => handleSeleccion(asig.id, e.target.value)}
            >
              <option value="">-- Seleccionar Profesor --</option>
              {profesores.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </li>
        ))}
      </ul>

      <button
        onClick={guardarCambios}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Guardar Cambios
      </button>

      {mensaje && <p className="mt-2 text-sm">{mensaje}</p>}
    </main>
  );
}
