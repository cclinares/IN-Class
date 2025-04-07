const handleSubmit = async (e) => {
  e.preventDefault();
  setCargando(true);
  setMensaje("");

  const password = generarPassword();

  const { error: errorAuth, data } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: false,
    user_metadata: {
      nombre,
      rol,
    },
  });

  if (errorAuth) {
    setMensaje(`❌ Error al crear usuario: ${errorAuth.message}`);
    setCargando(false);
    return;
  }

  // Insertar en tabla usuarios (visible en el sistema)
  const { error: errorTabla } = await supabase.from("usuarios").insert([
    {
      nombre,
      email,
      rol: [rol],
    },
  ]);

  // Insertar en tabla registro_usuarios (con contraseña)
  const { error: errorRegistro } = await supabase.from("registro_usuarios").insert([
    {
      nombre,
      email,
      rol: [rol],
      password,
    },
  ]);

  if (errorTabla || errorRegistro) {
    setMensaje("❌ Error al guardar en la base de datos.");
  } else {
    setMensaje("✅ Usuario creado correctamente.");
    onUsuarioCreado?.();
    setNombre("");
    setEmail("");
    setRol("estudiante");
  }

  setCargando(false);
};
