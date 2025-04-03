"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function ElegirRolPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      const { data } = await supabase.auth.getUser();
      const rolData = data?.user?.user_metadata?.rol || [];

      setRoles(Array.isArray(rolData) ? rolData : [rolData]);
    };

    fetchRoles();
  }, [supabase]);

  const irADashboard = (rol) => {
    router.push(`/${rol}`);
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gray-50 p-6">
      <div className="bg-white shadow-xl rounded-xl p-8 text-center max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">¿Con qué perfil deseas ingresar?</h1>
        <div className="space-y-4">
          {roles.map((rol) => (
            <button
              key={rol}
              onClick={() => irADashboard(rol)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold capitalize"
            >
              Ingresar como {rol}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
