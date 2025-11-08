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
          // Limpiar el code de la URL para que no se muestre
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
    <div className="p-10 text-white bg-gray-900 min-h-screen">
      {!accessToken ? (
        <a
          href={loginUrl}
          className="px-6 py-3 bg-green-500 rounded-lg hover:bg-green-600"
        >
          Conectar con Spotify
        </a>
      ) : (
        <div>
          <h1 className="text-3xl mb-6">Tus Favoritos de Spotify</h1>
          <TopArtists accessToken={accessToken} />
          <TopTracks accessToken={accessToken} />
        </div>
      )}
    </div>
  );
}

export default App;
