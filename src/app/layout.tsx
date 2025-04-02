export const metadata = {
  title: 'App CCL',
  description: 'Aplicación educativa',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}

