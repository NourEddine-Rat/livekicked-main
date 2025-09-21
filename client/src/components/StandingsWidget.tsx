import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Team {
  name: string;
  shortName: string;
  id: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  scoresStr: string;
  goalConDiff: number;
  pts: number;
  idx: number;
  qualColor?: string;
}

interface StandingsResponse {
  table: Array<{
    data: {
      table: {
        all: Team[];
      };
    };
  }>;
}

export default function StandingsWidget() {
  const { data: standingsData, isLoading, error } = useQuery<StandingsResponse>({
    queryKey: ['/api/leagues/47']
  });

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Premier League Table</h3>
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-6 h-6 bg-muted rounded" />
                <div className="w-8 h-8 bg-muted rounded-full" />
                <div className="flex-1 space-y-1">
                  <div className="h-4 bg-muted rounded w-24" />
                  <div className="h-3 bg-muted rounded w-16" />
                </div>
                <div className="h-4 bg-muted rounded w-8" />
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Premier League Table</h3>
          <p className="text-sm text-muted-foreground">Failed to load standings: {error.message}</p>
        </div>
      </Card>
    );
  }

  const teams = standingsData?.table?.[0]?.data?.table?.all?.slice(0, 10) || [];

  if (!teams || teams.length === 0) {
    return (
      <Card className="p-4">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Premier League Table</h3>
          <p className="text-sm text-muted-foreground">No standings data available</p>
        </div>
      </Card>
    );
  }

  const getPositionColor = (position: number) => {
    if (position <= 4) return "bg-green-100 text-green-800 border-green-200";
    if (position === 5) return "bg-blue-100 text-blue-800 border-blue-200";
    if (position >= 18) return "bg-red-100 text-red-800 border-red-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getQualificationBadge = (team: Team) => {
    if (team.qualColor === "#2AD572") {
      return <Badge className="text-xs bg-green-100 text-green-800">UCL</Badge>;
    }
    if (team.qualColor === "#0046A7") {
      return <Badge className="text-xs bg-blue-100 text-blue-800">UEL</Badge>;
    }
    if (team.qualColor === "#FF4646") {
      return <Badge className="text-xs bg-red-100 text-red-800">REL</Badge>;
    }
    return null;
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-foreground">Premier League Table</h3>
          <Badge variant="outline" className="text-xs">2025/26</Badge>
        </div>
        
        <div className="space-y-2">
          {teams.map((team) => (
            <div key={team.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${getPositionColor(team.idx)}`}>
                {team.idx}
              </div>
              
              <Avatar className="w-8 h-8 rounded-none">
                <AvatarImage 
                  src={`https://images.fotmob.com/image_resources/logo/teamlogo/${team.id}.png`}
                  alt={team.shortName}
                />
                <AvatarFallback className="text-xs font-semibold">
                  {team.shortName.substring(0, 3).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {team.shortName}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {team.played}G • {team.wins}W {team.draws}D {team.losses}L
                  </span>
                  {getQualificationBadge(team)}
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-sm font-bold text-foreground">{team.pts}</p>
                <p className="text-xs text-muted-foreground">
                  {team.goalConDiff > 0 ? '+' : ''}{team.goalConDiff}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>UCL: Champions League</span>
            <span>UEL: Europa League</span>
            <span>REL: Relegation</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
