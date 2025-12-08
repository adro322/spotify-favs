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
    <div className="min-h-screen bg-gray-950 text-white pb-12">

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
        <main className="max-w-7xl mx-auto px-6 md:px-8 py-8 space-y-8">
          {/* TIME RANGE BUTTONS */}
          <div className="flex justify-center">
            <TimeRangeSelector
              timeRange={timeRange}
              setTimeRange={setTimeRange}
            />

            {/* DASHBOARD */}
            <section className="w-full lg:h-[500px]">
            <GenreChart accessToken={accessToken} timeRange={timeRange} />
            </section>
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <TopArtists accessToken={accessToken} timeRange={timeRange} />
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
