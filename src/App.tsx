import { useEffect, useState } from "react";
import "./App.css";
import TopArtists from "./components/TopArtists";
import TopTracks from "./components/TopTracks";

function App() {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      const redirect_uri = import.meta.env.VITE_REDIRECT_URI;

      fetch("/api/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, redirect_uri }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Access token recibido:", data.access_token);
          setAccessToken(data.access_token);
          window.history.replaceState({}, document.title, "/");
        })
        .catch((err) => console.error("Error al obtener token:", err));
    }
  }, []);

  const loginUrl = `https://accounts.spotify.com/authorize?client_id=${
    import.meta.env.VITE_SPOTIFY_CLIENT_ID
  }&response_type=code&redirect_uri=${encodeURIComponent(
    import.meta.env.VITE_REDIRECT_URI
  )}&scope=user-top-read`;

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* HEADER */}
      <header className="w-full py-5 px-10 bg-black/40 backdrop-blur-md border-b border-white/10 flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wide">Spotify Favs</h1>
        <button className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition">Login</button>

        {accessToken && (
          <button
            onClick={() => {
              setAccessToken(null);
              window.location.href = "/";
            }}
            className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition"
          >
            Cerrar sesión
          </button>
        )}
      </header>

      {/* HOME (si NO hay sesión) */}
      {!accessToken ? (
        <div className="flex flex-col items-center justify-center h-[80vh] text-center px-6">
          <h2 className="text-4xl font-bold mb-6">
            Bienvenido a <span className="text-green-400">Spotify Favs</span>
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-xl">
            Conecta tu cuenta de Spotify y descubre tus artistas y canciones más escuchadas.
          </p>

          <a
            href={loginUrl}
            className="px-8 py-3 bg-green-500 text-lg rounded-xl hover:bg-green-600 transition shadow-lg"
          >
            Iniciar sesión con Spotify
          </a>
        </div>
      ) : (
        /* DASHBOARD (si YA hay sesión) */
        <div className="p-10">
          <h2 className="text-3xl mb-6 font-semibold">Tu Dashboard</h2>
          <TopArtists accessToken={accessToken} />
          <TopTracks accessToken={accessToken} />
        </div>
      )}
    </div>
  );
}

export default App;
