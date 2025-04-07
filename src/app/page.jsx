"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [sessionRole, setSessionRole] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Correo o contraseña incorrectos.");
    } else {
      const roles = data.user.user_metadata?.rol;
      if (!roles) {
        setError("Tu cuenta no tiene rol asignado.");
        return;
      }

      if (Array.isArray(roles) && roles.length > 1) {
        router.push("/elige-rol");
      } else {
        const rol = Array.isArray(roles) ? roles[0] : roles;
        router.push(`/${rol}`);
      }
    }
  };

  const handleContinue = () => {
    if (sessionRole) {
      if (Array.isArray(sessionRole) && sessionRole.length > 1) {
        router.push("/elige-rol");
      } else {
        router.push(`/${Array.isArray(sessionRole) ? sessionRole[0] : sessionRole}`);
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSessionRole(null);
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getUser();
      const roles = data?.user?.user_metadata?.rol;

      if (roles) {
        setSessionRole(roles);
      }
    };
    checkSession();
  }, []);

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-blue-50 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4 text-blue-700">Ingreso a IN-Class</h1>

        {sessionRole ? (
          <>
            <p className="mb-4 text-gray-700">
              Ya tienes una sesión iniciada como{" "}
              <strong>{Array.isArray(sessionRole) ? sessionRole.join(", ") : sessionRole}</strong>.
            </p>
            <button
              onClick={handleContinue}
              className="w-full mb-3 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              Continuar
            </button>
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
            {error && <p className="text-red-600">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Ingresar
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
