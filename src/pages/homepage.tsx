import "react";

const clientId = "28f681099dd4476ab876de8f335a4645";
const redirectUri = "https://spotify-favs-iota.vercel.app/callback";
const scopes = [
  "user-top-read",      // permiso para top artists y tracks
  "user-read-private"
].join(" ");

export default function HomePage() {
  const handleLogin = () => {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;
    window.location.href = authUrl;
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Mis Favoritos de Spotify</h1>
      <button onClick={handleLogin} style={{ padding: "10px 20px", fontSize: "16px" }}>
        Login con Spotify
      </button>
    </div>
  );
}
