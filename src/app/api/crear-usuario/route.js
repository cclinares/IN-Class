import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Configuración de Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  const { nombre, email, rol } = await request.json();

  // 1. Verificar si el usuario ya existe en Supabase Auth
  const { data: existingUser, error: getUserError } = await supabase.auth.admin.getUserByEmail(email);

  if (existingUser?.user) {
    return NextResponse.json(
      { error: "El correo ya está registrado en el sistema." },
      { status: 400 }
    );
  }

  // 2. Enviar invitación al correo
  const { data: inviteData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email, {
    data: { nombre, rol },
    redirectTo: "https://in-class-liard.vercel.app/auth/callback", // 🔁 Importante para el flujo de contraseña
  });

  if (inviteError) {
    return NextResponse.json(
      { error: "Error al enviar invitación: " + inviteError.message },
      { status: 500 }
    );
  }

  const userId = inviteData?.user?.id;

  // 3. Insertar en tabla usuarios
  const { error: insertError } = await supabase.from("usuarios").insert([
    {
      id: userId,
      nombre,
      email,
      rol: [rol],
    },
  ]);

  if (insertError) {
    return NextResponse.json(
      { error: "Usuario creado en Auth, pero falló al registrar en tabla usuarios: " + insertError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ mensaje: "Usuario creado e invitación enviada con éxito." });
}
