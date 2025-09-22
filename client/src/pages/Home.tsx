import TodayMatches from "@/components/TodayMatches";
import TopLeagues from "@/components/TopLeagues";
import NewsWidget from "@/components/NewsWidget";
import StandingsWidget from "@/components/StandingsWidget";

export default function Home() {
  return (
    <div className="flex flex-col lg:flex-row gap-4 p-4">
      {/* Top Leagues - Hidden on mobile, left sidebar on desktop */}
      <div className="hidden lg:block lg:w-56 lg:flex-shrink-0">
        <div className="sticky top-4 pt-16 max-h-[calc(100vh-2rem)] overflow-y-auto">
          <TopLeagues />
        </div>
      </div>
      
      {/* Center Column - Today's Matches */}
      <div className="flex-1 min-w-0">
        <TodayMatches />
      </div>
      
      {/* Right Column - News & Standings - Bottom on mobile, right sidebar on desktop */}
      <div className="lg:w-72 lg:flex-shrink-0">
        <div className="lg:sticky lg:top-4 lg:pt-16 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto space-y-4">
          <NewsWidget />
          <StandingsWidget />
        </div>
      </div>
    </div>
  );
}