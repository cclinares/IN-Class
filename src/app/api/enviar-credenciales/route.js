import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

// Supabase y nodemailer config
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ivanjozape@gmail.com",
    pass: "yspi aoqg tjfa gant",
  },
});

export async function POST(req) {
  const { usuarios } = await req.json();

  for (const u of usuarios) {
    const { email } = u;

    const { data, error } = await supabase
      .from("registro_usuarios")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !data) {
      console.error(`❌ No se encontró información para ${email}`);
      continue;
    }

    const { nombre, rol, password } = data;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #2c3e50;">Reenvío de credenciales</h2>
        <p>Estimado/a <strong>${nombre}</strong>, aquí están tus datos de acceso:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr><td>Correo</td><td>${email}</td></tr>
          <tr><td>Contraseña</td><td>${password}</td></tr>
          <tr><td>Rol</td><td>${rol?.join(", ")}</td></tr>
        </table>
        <a href="https://in-class-liard.vercel.app/login" style="background:#1e40af; color:white; padding:10px 20px; border-radius:6px;">Ingresar a IN-Class</a>
      </div>
    `;

    try {
      await transporter.sendMail({
        from: '"IN-Class" <ivanjozape@gmail.com>',
        to: email,
        subject: "Reenvío de credenciales IN-Class",
        html,
      });
    } catch (e) {
      console.error(`❌ Error al enviar a ${email}:`, e.message);
    }
  }

  return NextResponse.json({ mensaje: "Correos reenviados." });
}
