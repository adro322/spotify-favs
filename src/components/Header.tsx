interface HeaderProps {
  accessToken: string | null;
  onLogout: () => void;
}

export default function Header({ accessToken, onLogout }: HeaderProps) {
  return (
    <header className="w-full py-5 px-6 md:px-10 bg-black/40 backdrop-blur-md border-b border-white/10 flex justify-between items-center sticky top-0 z-10">
      <h1 className="text-2xl font-bold tracking-wide text-white">SpotiStats</h1>
      
      {/* Si hay un accessToken, mostramos el botón de cerrar sesión */}
      {accessToken && (
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition text-sm font-medium text-white"
        >
          Cerrar sesión
        </button>
      )}
    </header>
  );
}