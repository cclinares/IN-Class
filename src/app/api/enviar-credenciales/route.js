import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

// Configuración
const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Generar contraseña
function generarPassword() {
  const caracteres = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 10 }, () =>
    caracteres.charAt(Math.floor(Math.random() * caracteres.length))
  ).join("");
}

// API route
export async function POST(req) {
  const { usuarios } = await req.json();

  if (!usuarios || usuarios.length === 0) {
    return NextResponse.json({ mensaje: "No se enviaron usuarios." }, { status: 400 });
  }

  for (const u of usuarios) {
    const { email, nombre, rol } = u;
    const password = generarPassword();

    const { data: authData } = await supabase.auth.admin.listUsers({ email });
    const usuarioAuth = authData?.users?.[0];

    if (!usuarioAuth) {
      console.error(`❌ Usuario no encontrado en auth: ${email}`);
      continue;
    }

    await supabase.auth.admin.updateUserById(usuarioAuth.id, {
      password,
    });

    // HTML del correo (idéntico al anterior)
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <div style="text-align: center;">
          <img src="https://i.ibb.co/rGPwn1Wp/2024.png" alt="Logo Colegio" width="90" />
          <h2 style="color: #2c3e50;">Cuenta creada en la Plataforma Educativa</h2>
        </div>
        <p>Estimado/a <strong>${nombre}</strong>,</p>
        <p>Tu cuenta ha sido activada o reconfigurada. A continuación, te dejamos tus credenciales de acceso:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr><td style="padding: 8px; border: 1px solid #ddd;">📧 Correo</td><td style="padding: 8px; border: 1px solid #ddd;">${email}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;">🔑 Contraseña</td><td style="padding: 8px; border: 1px solid #ddd;">${password}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;">👤 Rol</td><td style="padding: 8px; border: 1px solid #ddd;">${rol?.join(", ")}</td></tr>
        </table>
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://in-class-liard.vercel.app/login" style="background-color: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-right: 10px;">
            Ingreso a IN Class
          </a>
          <a href="mailto:soporte@colegioconcepcionlinares.cl" style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Contactar a Soporte
          </a>
        </div>
        <p style="color: #888;"><em>Actualmente la plataforma está disponible en línea.</em></p>
        <p style="color: #b91c1c;"><strong>No compartas esta información con terceros.</strong></p>
        <p style="margin-top: 30px;">Saludos cordiales,<br><strong>Equipo de Desarrollo</strong><br>Colegio Concepción Linares</p>
      </div>
    `;

    try {
      await resend.emails.send({
        from: "IN-Class <no-reply@colegioconcepcionlinares.cl>",
        to: email,
        subject: "Tu cuenta IN-Class",
        html,
      });

      console.log(`📨 Correo enviado a ${email}`);
    } catch (error) {
      console.error(`❌ Error al enviar con Resend a ${email}:`, error.message);
    }
  }

  return NextResponse.json({ mensaje: "Credenciales enviadas." });
}
