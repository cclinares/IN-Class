"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function HomePage() {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/login");
      } else {
        setUser(data.user);
      }
    };
    getUser();
  }, [supabase, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4">Bienvenido a IN-Class</h1>
        {user && (
          <>
            <p className="text-lg text-gray-700 mb-4">
              Correo: <strong>{user.email}</strong>
            </p>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600 transition"
            >
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </main>
  );
}
