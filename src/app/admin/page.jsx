"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import CrearUsuarioForm from "./CrearUsuarioForm";

export default function AdminPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [authorized, setAuthorized] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      const { data } = await supabase.auth.getUser();
      const rol = data?.user?.user_metadata?.rol;

      if (rol === "admin" || (Array.isArray(rol) && rol.includes("admin"))) {
        setAuthorized(true);
      } else {
        router.push("/");
      }
    };

    checkRole();
  }, []);

  const fetchUsuarios = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("usuarios").select("*");

    if (error) {
      console.error("Error al cargar usuarios:", error.message);
    } else {
      setUsuarios(data.map((u) => ({ ...u, seleccionado: false })));
    }

    setLoading(false);
  };

  useEffect(() => {
    if (authorized) {
      fetchUsuarios();
    }
  }, [authorized]);

  const handleEnviarCredenciales = async () => {
    const seleccionados = usuarios.filter((u) => u.seleccionado);
    if (seleccionados.length === 0) return alert("Selecciona al menos un usuario.");

    const res = await fetch("/api/enviar-credenciales", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuarios: seleccionados }),
    });

    const data = await res.json();
    alert(data.mensaje || "Credenciales enviadas.");
  };

  if (!authorized) return null;

  return (
    <main className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-blue-700">Panel de Administrador</h1>

      <CrearUsuarioForm onUsuarioCreado={fetchUsuarios} />

      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Usuarios registrados</h2>

        {loading ? (
          <p>Cargando usuarios...</p>
        ) : (
          <>
            <div className="mb-4">
              <button
                onClick={handleEnviarCredenciales}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Enviar credenciales a seleccionados
              </button>
            </div>

            <table className="w-full table-auto border border-gray-300">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2 border">
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        setUsuarios(
                          usuarios.map((u) => ({
                            ...u,
                            seleccionado: e.target.checked,
                          }))
                        )
                      }
                    />
                  </th>
                  <th className="p-2 border">Nombre</th>
                  <th className="p-2 border">Email</th>
                  <th className="p-2 border">Rol</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario, idx) => (
                  <tr key={usuario.id} className="border-t">
                    <td className="p-2 border">
                      <input
                        type="checkbox"
                        checked={usuario.seleccionado || false}
                        onChange={(e) => {
                          const updated = [...usuarios];
                          updated[idx].seleccionado = e.target.checked;
                          setUsuarios(updated);
                        }}
                      />
                    </td>
                    <td className="p-2 border">{usuario.nombre}</td>
                    <td className="p-2 border">{usuario.email}</td>
                    <td className="p-2 border">{usuario.rol?.join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </main>
  );
}
