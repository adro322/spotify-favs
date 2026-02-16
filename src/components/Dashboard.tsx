import { useState } from "react";
import TimeRangeSelector from "./TimeRangeSelector";
import GenreChart from "./GenreChart";
import TopArtists from "./TopArtists";
import TopTracks from "./TopTracks";

interface DashboardProps {
  accessToken: string;
}

export default function Dashboard({ accessToken }: DashboardProps) {
  // Mudamos el timeRange aquí, porque a App.tsx no le importa el tiempo
  const [timeRange, setTimeRange] = useState<"short_term" | "medium_term" | "long_term">("short_term");

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      {/* Selector de tiempo */}
      <div className="flex justify-center mb-8">
        <TimeRangeSelector timeRange={timeRange} setTimeRange={setTimeRange} />
      </div>

      {/* Tu Grilla de 2 columnas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="md:col-span-2 h-[400px]">
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
  );
}

/*
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
          </main>*/