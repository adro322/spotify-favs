import { useState } from "react";
import TimeRangeSelector from "./TimeRangeSelector";
import GenreChart from "./GenreChart";
import TopArtists from "./TopArtists";
import TopTracks from "./TopTracks";
import NowPlaying from "./NowPlaying";

interface DashboardProps {
  accessToken: string;
}

export default function Dashboard({ accessToken }: DashboardProps) {
  const [timeRange, setTimeRange] = useState<"short_term" | "medium_term" | "long_term">("short_term");

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex justify-left mb-2">
        <TimeRangeSelector timeRange={timeRange} setTimeRange={setTimeRange} />
      </div>

      <div className="w-full mb-8">
        <NowPlaying accessToken={accessToken} />
      </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="md:col-span-2 h-[500px]">
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

