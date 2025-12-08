import { useEffect } from "react";


export default function Login({
  onToken,
}: {
  onToken: (token: string) => void;
}) {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_REDIRECT_URI;

  console.log("URI enviada:", redirectUri); // <--- AGREGA ESTO PARA VERLO EN CONSOLA
  
  const loginUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
    redirectUri
)}&scope=user-top-read&show_dialog=true`;

  // Cuando Spotify redirige con ?code=...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!code) return;

    fetch("/api/callback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, redirect_uri: redirectUri }),
    })
      .then((res) => res.json())
      .then((data) => {
        onToken(data.access_token);
        window.history.replaceState({}, document.title, "/");
      })
      .catch((err) => console.error("Error callback:", err));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center px-6">
      <h2 className="text-4xl font-bold mb-6">
        Bienvenido a <span className="text-green-400">Spotify Favs</span>
      </h2>

      <p className="text-lg text-gray-300 mb-8 max-w-xl">
        Conecta tu cuenta de Spotify para ver tus estadísticas personalizadas.
      </p>

      <a
        href={loginUrl}
        className="px-8 py-3 bg-green-500 text-lg rounded-xl hover:bg-green-600 transition shadow-lg"
      >
        Iniciar sesión con Spotify
      </a>
    </div>
  );
}
