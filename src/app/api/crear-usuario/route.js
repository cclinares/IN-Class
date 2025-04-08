import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function POST(request) {
  const { nombre, email, rol } = await request.json();

  const { data: authUser, error: authError } = await supabase.auth.admin.inviteUserByEmail(email, {
    data: { nombre, rol },
  });

  if (authError) {
    console.error(authError);
    return Response.json({ error: "Error al crear usuario" });
  }

  const { data: usuarioInsertado, error: insertError } = await supabase
    .from("usuarios")
    .insert([{ id: authUser.user.id, nombre, email, rol }]);

  if (insertError) {
    console.error(insertError);
    return Response.json({ error: "Usuario creado en auth, pero falló en tabla usuarios" });
  }

  return Response.json({ mensaje: "Usuario creado correctamente e invitación enviada" });
}
