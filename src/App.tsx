import { useState } from "react";
import Login from "./components/Login";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";

function App() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
 

// Creamos la función de cerrar sesión aquí, donde vive el estado
  const handleLogout = () => {
    setAccessToken(null);
    window.location.href = "/";
  };
  return (
    <div className="min-h-screen bg-gray-950 text-white pb-20">
      <Header accessToken={accessToken} onLogout={handleLogout} />

      {!accessToken ? (
        <Login onToken={(t) => setAccessToken(t)} />
      ) : (
        <Dashboard accessToken={accessToken} /> 
      )}
    </div>
  );
}


export default App;
