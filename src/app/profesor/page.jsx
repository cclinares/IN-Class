'use client'

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function PanelProfesor() {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState(null);
  const [asignaturas, setAsignaturas] = useState([]);

  useEffect(() => {
    const obtenerUsuarioYAsignaturas = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: asignaturasData } = await supabase
          .from('asignaturas')
          .select('id, nombre, cursos(nombre)')
          .eq('profesor_id', user.id); // <-- este filtro usa profesor_id

        setAsignaturas(asignaturasData || []);
      }
    };

    obtenerUsuarioYAsignaturas();
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Asignaturas que impartes</h1>
      {asignaturas.length === 0 ? (
        <p>No tienes asignaturas asignadas.</p>
      ) : (
        <ul>
          {asignaturas.map((asig) => (
            <li key={asig.id} className="mb-2">
              <strong>{asig.nombre}</strong> ({asig.cursos?.nombre || 'Sin curso'})
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
