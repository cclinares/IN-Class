"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import FormCrearUsuario from "./FormCrearUsuario";

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
      setUsuarios(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (authorized) {
      fetchUsuarios();
    }
  }, [authorized]);

  if (!authorized) return null;

  return (
    <main className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-blue-700">Panel de Administrador</h1>

      <a
        href="/admin/asignar-profesor"
        className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      >
        Asignar profesores a asignaturas
      </a>

      <FormCrearUsuario onUsuarioCreado={fetchUsuarios} />

      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Usuarios registrados</h2>

        {loading ? (
          <p>Cargando usuarios...</p>
        ) : (
          <table className="w-full table-auto border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Nombre</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Rol</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id} className="border-t">
                  <td className="p-2 border">{usuario.nombre}</td>
                  <td className="p-2 border">{usuario.email}</td>
                  <td className="p-2 border">
                    {Array.isArray(usuario.rol)
                      ? usuario.rol.join(", ")
                      : usuario.rol || "Sin rol"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
