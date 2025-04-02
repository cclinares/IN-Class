'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuth = async () => {
      const { error } = await supabase.auth.getSession()

      if (!error) {
        router.push('/') // Redirige al home o a donde quieras
      } else {
        console.error('Error de sesión:', error)
      }
    }

    handleAuth()
  }, [router])

  return (
    <div style={{ padding: 50 }}>
      <p>Verificando sesión...</p>
    </div>
  )
}
