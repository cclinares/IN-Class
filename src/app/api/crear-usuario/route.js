import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

// Conexión a Supabase
const supabase = createClient(
  "https://djftpnxuwujyhxixedwj.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqZnRwbnh1d3VqeWh4aXhlZHdqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzUxMjk2MCwiZXhwIjoyMDU5MDg4OTYwfQ.ta6CZ7Oc23UAR6YM0DxTn6KHNglOD0Y5oZo6SsAuSkE"
);

// Función para generar contraseña segura
function generarContrasena(longitud = 10) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let pass = "";
  for (let i = 0; i < longitud; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
}

export async function POST(req) {
  const { nombre, email, rol } = await req.json();
  const password = generarContrasena();

  // 1. Crear usuario en Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { rol, nombre },
  });

  if (authError) {
    return NextResponse.json({ error: "Error al crear usuario en Auth", detalle: authError.message }, { status: 500 });
  }

  const userId = authData.user.id;

  // 2. Guardar en tabla `usuarios`
  const { error: userError } = await supabase.from("usuarios").insert([
    {
      id: userId,
      nombre,
      email,
      rol: [rol],
    }
  ]);

  if (userError) {
    return NextResponse.json({ error: "Error al insertar en tabla usuarios", detalle: userError.message }, { status: 500 });
  }

  // 3. Guardar en `registro_usuarios` para enviar después las credenciales
  await supabase.from("registro_usuarios").insert([
    {
      id: uuidv4(),
      email,
      nombre,
      rol,
      estado: "pendiente",
      contrasena: password,
    }
  ]);

  return NextResponse.json({ mensaje: "Usuario creado correctamente" });
}
