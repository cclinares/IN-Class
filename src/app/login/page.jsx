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
    <main style={{ padding: "2rem" }}>
      <h1>Iniciar sesión</h1>
      <button onClick={handleLogin}>Login con Google</button>
    </main>
  );
}
