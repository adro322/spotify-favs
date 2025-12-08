import { useState } from "react";
import Login from "./components/Login";
import TopArtists from "./components/TopArtists";
import TopTracks from "./components/TopTracks";
import GenreChart from "./components/GenreChart";
import TimeRangeSelector from "./components/TimeRangeSelector";

function App() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<
    "short_term" | "medium_term" | "long_term"
  >("short_term");

  return (
    <div className="min-h-screen bg-black text-white">

      {/* HEADER */}
      <header className="w-full py-5 px-10 bg-black/40 backdrop-blur-md border-b border-white/10 flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wide">SpotiStats</h1>

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

      {/* LOGIN */}
      {!accessToken ? (
        <Login onToken={(t) => setAccessToken(t)} />
      ) : (
        <>
        <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* 1. BOTONES ARRIBA (Centrados) */}
        <div className="flex justify-center mb-8">
          <TimeRangeSelector timeRange={timeRange} setTimeRange={setTimeRange} />
        </div>

        {/* 2. LA GRILLA MAESTRA (2 columnas) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* EL GRÁFICO (Ocupa las 2 columnas) 
              md:col-span-2 -> Esto hace que se estire a lo ancho
          */}
          <section className="md:col-span-2 h-[400px]">
            <GenreChart accessToken={accessToken} timeRange={timeRange} />
          </section>

          {/* TOP ARTISTS (Columna Izquierda) */}
          <section className="w-full">
             <TopArtists accessToken={accessToken} timeRange={timeRange} />
          </section>

          {/* TOP TRACKS (Columna Derecha) */}
          <section className="w-full">
             <TopTracks accessToken={accessToken} timeRange={timeRange} />
          </section>

        </div>
      </main>
      // --- FIN DEL DISEÑO ---
        </>
      )}
    </div>
  );
}

export default App;
