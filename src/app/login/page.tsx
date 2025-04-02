'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) alert('Error al iniciar sesión');
    else window.location.href = '/panel';
  };

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Login</h1>
      <input placeholder="Correo" onChange={e => setEmail(e.target.value)} /><br />
      <input type="password" placeholder="Contraseña" onChange={e => setPassword(e.target.value)} /><br />
      <button onClick={handleLogin}>Iniciar Sesión</button>
    </main>
  );
}
