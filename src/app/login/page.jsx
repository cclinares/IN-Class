'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)

    let result
    if (isRegistering) {
      result = await supabase.auth.signUp({ email, password })
    } else {
      result = await supabase.auth.signInWithPassword({ email, password })
    }

    if (result.error) {
      alert('Error: ' + result.error.message)
    } else {
      alert(isRegistering ? 'Registro exitoso. Revisa tu correo.' : 'Inicio de sesión correcto.')
      router.push('/')
    }

    setLoading(false)
  }

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', paddingTop: 50 }}>
      <h1>{isRegistering ? 'Registrarse' : 'Iniciar sesión'}</h1>
      <form onSubmit={handleAuth}>
        <input
          type="email"
          placeholder="Correo institucional"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: 10, width: '100%', marginBottom: 10 }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: 10, width: '100%', marginBottom: 10 }}
        />
        <button type="submit" disabled={loading} style={{ padding: 10, width: '100%' }}>
          {loading ? 'Cargando...' : isRegistering ? 'Registrarse' : 'Iniciar sesión'}
        </button>
      </form>
      <p style={{ marginTop: 20 }}>
        {isRegistering ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
        <button onClick={() => setIsRegistering(!isRegistering)} style={{ border: 'none', background: 'none', color: 'cyan', cursor: 'pointer' }}>
          {isRegistering ? 'Iniciar sesión' : 'Registrarse'}
        </button>
      </p>
    </div>
  )
}
