import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

// Configuración desde variables de entorno
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export async function POST(req) {
  const { usuarios } = await req.json();

  if (!usuarios || usuarios.length === 0) {
    return NextResponse.json({ mensaje: "No se enviaron usuarios." }, { status: 400 });
  }

  for (const u of usuarios) {
    const { email } = u;

    const { data, error } = await supabase
      .from("registro_usuarios")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !data) {
      console.error(`❌ No se encontró info para ${email}`);
      continue;
    }

    const { nombre, rol, password } = data;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <div style="text-align: center;">
          <img src="https://i.ibb.co/rGPwn1Wp/2024.png" alt="Logo Colegio" width="90" />
          <h2 style="color: #2c3e50;">Reenvío de credenciales</h2>
        </div>
        <p>Estimado/a <strong>${nombre}</strong>,</p>
        <p>Estas son tus credenciales de acceso a la plataforma:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr><td style="padding: 8px; border: 1px solid #ddd;">📧 Correo</td><td style="padding: 8px; border: 1px solid #ddd;">${email}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;">🔑 Contraseña</td><td style="padding: 8px; border: 1px solid #ddd;">${password}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;">👤 Rol</td><td style="padding: 8px; border: 1px solid #ddd;">${rol?.join(", ")}</td></tr>
        </table>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://in-class-liard.vercel.app/login" style="background-color: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-right: 10px;">
            Ingresar a IN Class
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
      await transporter.sendMail({
        from: '"Plataforma IN-Class" <ivanjozape@gmail.com>',
        to: email,
        subject: "Tus credenciales de acceso",
        html,
      });

      console.log(`📨 Correo reenviado a ${email}`);
    } catch (e) {
      console.error(`❌ Error al enviar a ${email}:`, e.message);
    }
  }

  return NextResponse.json({ mensaje: "Correos enviados correctamente." });
}
