import { useState } from "react";
import Login from "./components/Login";
import TopArtists from "./components/TopArtists";
import TopTracks from "./components/TopTracks";
import GenreChart from "./components/GenreChart";
import TimeRangeSelector from "./components/TimeRangeSelector";
import Header from "./components/Header";

function App() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<
    "short_term" | "medium_term" | "long_term"
  >("short_term");

// Creamos la función de cerrar sesión aquí, donde vive el estado
  const handleLogout = () => {
    setAccessToken(null);
    window.location.href = "/";
  };
  return (
    <div className="min-h-screen bg-black text-white">

    <Header accessToken={accessToken} onLogout={handleLogout} />

      {/* LOGIN */}
      {!accessToken ? (
        <Login onToken={(t) => setAccessToken(t)} />
      ) : (
        <>
          <main className="max-w-7xl mx-auto px-6 py-8">
            
            <div className="flex justify-left">
              <TimeRangeSelector timeRange={timeRange} setTimeRange={setTimeRange} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section className="md:col-span-2 h-[500px] pb-4">
                <GenreChart accessToken={accessToken} timeRange={timeRange} />
              </section>
              <section className="w-full">
                <TopArtists accessToken={accessToken} timeRange={timeRange} />
              </section>
              <section className="w-full">
                <TopTracks accessToken={accessToken} timeRange={timeRange} />
              </section>
            </div>
          </main>
        </>
      )}
    </div>
  );
}

export default App;
