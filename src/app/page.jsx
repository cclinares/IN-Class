'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const supabase = createClientComponentClient()
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (!data.user) {
        router.push('/login')
      } else {
        setUser(data.user)
      }
    }
    getUser()
  }, [router, supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Inicio</h1>
      {user && (
        <>
          <p>Bienvenido: {user.email}</p>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </>
      )}
    </main>
  )
}
