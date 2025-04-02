'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://djftpnxuwujyhxixedwj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqZnRwbnh1d3VqeWh4aXhlZHdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1MTI5NjAsImV4cCI6MjA1OTA4ODk2MH0.lrjGhYn6O_i4uoIhTbkfKPUehERg_pYA1H2DRHtHVO8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError('Correo o contraseña incorrectos.');
    } else {
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-semibold mb-4 text-center">Ingreso a IN Class</h1>
        {error && <p className="text-red-500 mb-3 text-center">{error}</p>}
        <input
          type="email"
          placeholder="Correo electrónico"
          className="w-full p-2 mb-3 border border-gray-300 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Ingresar
        </button>
      </div>
    </div>
  );
}
