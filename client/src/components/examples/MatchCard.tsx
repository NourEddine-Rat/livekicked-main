import MatchCard from '../MatchCard';

const mockMatch = {
  id: 1,
  leagueId: 47,
  leagueName: "Premier League",
  time: "2024-09-21 15:00",
  timeTS: Date.now() + 3600000,
  home: { 
    id: 8678, 
    name: "Arsenal", 
    longName: "Arsenal FC", 
    score: 2 
  },
  away: { 
    id: 10261, 
    name: "Man City", 
    longName: "Manchester City", 
    score: 1 
  },
  status: { 
    started: true, 
    finished: false, 
    cancelled: false, 
    ongoing: true, 
    scoreStr: "2 - 1", 
    liveTime: { short: "78'", long: "78 minutes" } 
  }
};

export default function MatchCardExample() {
  return (
    <div className="max-w-md p-4 bg-background">
      <MatchCard match={mockMatch} />
    </div>
  );
}