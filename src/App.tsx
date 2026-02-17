import { useState } from "react";
import Login from "./components/Login";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";

function App() {
  const [accessToken, setAccessToken] = useState<string | null>(() => {
  // Al cargar la página, primero revisa si ya había un token guardado
  return localStorage.getItem("spotify_token") || null;
});
 
const handleLogin = (token: string) => {
  localStorage.setItem("spotify_token", token); // Lo guardamos en el navegador
  setAccessToken(token); // Lo guardamos en React
};

// Creamos la función de cerrar sesión aquí, donde vive el estado
  const handleLogout = () => {
    localStorage.removeItem("spotify_token"); // Limpiamos el token del navegador
    setAccessToken(null);
    window.location.href = "/";
  };
  return (
    <div className="min-h-screen bg-gray-950 text-white pb-20">
      <Header accessToken={accessToken} onLogout={handleLogout} />

      {!accessToken ? (
        <Login onToken={handleLogin} />
      ) : (
        <Dashboard accessToken={accessToken} /> 
      )}
    </div>
  );
}


export default App;
