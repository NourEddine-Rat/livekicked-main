import TodayMatches from "@/components/TodayMatches";
import TopLeagues from "@/components/TopLeagues";
import NewsWidget from "@/components/NewsWidget";
import StandingsWidget from "@/components/StandingsWidget";

export default function Home() {
  return (
    <div className="flex gap-4 p-4">
      {/* Left Column - Top Leagues */}
      <div className="w-56 flex-shrink-0">
        <div className="sticky top-4 pt-16 max-h-[calc(100vh-2rem)] overflow-y-auto">
          <TopLeagues />
        </div>
      </div>
      
      {/* Center Column - Today's Matches */}
      <div className="flex-1 min-w-0">
        <TodayMatches />
      </div>
      
      {/* Right Column - News & Standings */}
      <div className="w-72 flex-shrink-0">
        <div className="sticky top-4 pt-16 max-h-[calc(100vh-2rem)] overflow-y-auto space-y-4">
          <NewsWidget />
          <StandingsWidget />
        </div>
      </div>
    </div>
  );
}