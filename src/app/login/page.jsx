"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) console.error("Error al iniciar sesión:", error.message);
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        router.push("/");
      }
    };
    checkUser();
  }, [router, supabase]);

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-blue-50 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4 text-blue-700">IN-Class Login</h1>
        <p className="mb-4 text-gray-600">Accede con tu cuenta institucional</p>
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
        >
          Iniciar sesión con Google
        </button>
      </div>
    </main>
  );
}
