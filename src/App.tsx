import {  useEffect } from 'react'
import './App.css'

function App() {

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      fetch("/api/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Token:", data.access_token);
          // Aquí puedes guardar el token en localStorage o state
        });
    }
  }, []);
return(
  <div className="p-10 text-white bg-gray-900 min-h-screen">
      <a
        href={`https://accounts.spotify.com/authorize?client_id=${
          import.meta.env.VITE_SPOTIFY_CLIENT_ID
        }&response_type=code&redirect_uri=${import.meta.env.VITE_REDIRECT_URI}&scope=user-top-read`}
        className="px-6 py-3 bg-green-500 rounded-lg hover:bg-green-600"
      >
        Conectar con Spotify
      </a>
    </div>
  );
}

export default App
