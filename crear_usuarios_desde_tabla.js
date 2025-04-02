import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const SUPABASE_URL = 'https://djftpnxuwujyhxixedwj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqZnRwbnh1d3VqeWh4aXhlZHdqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzUxMjk2MCwiZXhwIjoyMDU5MDg4OTYwfQ.ta6CZ7Oc23UAR6YM0DxTn6KHNglOD0Y5oZo6SsAuSkE';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const TABLA_USUARIOS = 'usuarios';
const TABLA_LOG = 'registro_creacion';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ivanjozape@gmail.com',
    pass: 'yspi aoqg tjfa gant'
  }
});

function generarPassword() {
  const caracteres = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let password = '';
  for (let i = 0; i < 10; i++) {
    password += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return password;
}

async function crearUsuariosDesdeTabla() {
  console.log('🔍 Cargando usuarios...');

  const { data, error } = await supabase.from(TABLA_USUARIOS).select('*');

  if (error) {
    console.error('❌ Error al obtener usuarios:', error.message);
    return;
  }

  for (const usuario of data) {
    const { email, nombre, rol } = usuario;
    const password = generarPassword();

    const { error: signUpError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { nombre, rol }
    });

    if (signUpError) {
      const mensaje = signUpError.code === 'email_exists'
        ? 'Ya existe'
        : signUpError.message;

      console.log(`⚠️ ${email}: ${mensaje}`);

      await supabase.from(TABLA_LOG).insert({
        email,
        nombre,
        rol,
        estado: 'error',
        mensaje
      });

      // ⛔️ No se envía el correo si ya existía
      if (signUpError.code === 'email_exists') continue;
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <div style="text-align: center;">
          <img src="https://i.ibb.co/rGPwn1Wp/2024.png" alt="Logo Colegio" width="90" />
          <h2 style="color: #2c3e50;">Cuenta creada en la Plataforma Educativa</h2>
        </div>
        <p>Estimado/a <strong>${nombre}</strong>,</p>
        <p>Tu cuenta ha sido creada con éxito en la plataforma del Colegio Concepción Linares. A continuación, te dejamos tus credenciales de acceso:</p>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">📧 Correo</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">🔑 Contraseña</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${password}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">👤 Rol</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${rol}</td>
          </tr>
        </table>

        <div style="text-align: center; margin: 30px 0;">
          <a href="http://localhost:3000/login" style="background-color: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-right: 10px;">
            Ingreso a IN Class
          </a>
          <a href="mailto:soporte@colegioconcepcionlinares.cl" style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Contactar a Soporte
          </a>
        </div>

        <p style="color: #888;"><em>Actualmente la plataforma está en desarrollo y disponible solo en modo local.</em></p>
        <p style="color: #b91c1c;"><strong>No compartas esta información con terceros.</strong></p>

        <p style="margin-top: 30px;">Saludos cordiales,<br><strong>Equipo de Desarrollo</strong><br>Colegio Concepción Linares</p>
      </div>
    `;

    const mailOptions = {
      from: '"Plataforma Colegio" <ivanjozape@gmail.com>',
      to: email,
      subject: 'Tu cuenta fue creada',
      html
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`📨 Correo enviado a: ${email}`);
    } catch (correoError) {
      console.error(`❌ Error al enviar correo a ${email}:`, correoError.message);
    }

    await supabase.from(TABLA_LOG).insert({
      email,
      nombre,
      rol,
      estado: 'ok',
      mensaje: 'Usuario creado y correo enviado'
    });

    console.log(`✅ Usuario creado: ${email}`);
  }

  console.log('🏁 Proceso completado.');
}

crearUsuariosDesdeTabla();
