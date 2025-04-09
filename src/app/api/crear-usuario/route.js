import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  const { nombre, email, rol } = await req.json();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  console.log("✅ Intentando invitar a:", email);
  console.log("✅ Roles asignados:", rol);

  try {
    const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
      data: { nombre, rol },
    });

    if (error) {
      console.error("❌ Error al invitar usuario:", error.message);
      return new Response(
        JSON.stringify({ error: "Error al invitar usuario: " + error.message }),
        { status: 500 }
      );
    }

    console.log("✅ Usuario invitado con éxito:", data.user.id);

    const insert = await supabase.from("usuarios").insert([
      {
        id: data.user.id,
        nombre,
        email,
        rol: rol, // este es un array como ["profesor", "apoderado"]
      },
    ]);

    if (insert.error) {
      console.error("❌ Error al insertar en usuarios:", insert.error.message);
      return new Response(
        JSON.stringify({ error: "Error al insertar usuario: " + insert.error.message }),
        { status: 500 }
      );
    }

    return new Response(JSON.stringify({ mensaje: "Usuario creado correctamente" }));
  } catch (err) {
    console.error("❌ Error inesperado:", err);
    return new Response(
      JSON.stringify({ error: "Error inesperado al crear usuario" }),
      { status: 500 }
    );
  }
}
