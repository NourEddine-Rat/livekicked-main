import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Play, CheckCircle, Pause } from "lucide-react";
import { format } from "date-fns";

interface Team {
  id: number;
  name: string;
  longName: string;
  score?: number;
}

interface MatchStatus {
  started: boolean;
  finished: boolean;
  cancelled: boolean;
  ongoing?: boolean;
  scoreStr?: string;
  reason?: {
    short: string;
    long: string;
  };
  liveTime?: {
    short: string;
    long: string;
  };
}

interface Match {
  id: number;
  leagueId: number;
  leagueName: string;
  time: string;
  home: Team;
  away: Team;
  status: MatchStatus;
  timeTS: number;
}

interface MatchCardProps {
  match: Match;
}

export default function MatchCard({ match }: MatchCardProps) {
  const getStatusBadge = () => {
    if (match.status.ongoing) {
      return (
        <Badge variant="destructive" className="text-xs animate-pulse">
          <Play className="w-3 h-3 mr-1" />
          {match.status.liveTime?.short || "LIVE"}
        </Badge>
      );
    }
    
    if (match.status.finished) {
      return (
        <Badge className="text-xs bg-chart-1 text-chart-1-foreground">
          <CheckCircle className="w-3 h-3 mr-1" />
          {match.status.reason?.short || "FT"}
        </Badge>
      );
    }

    if (match.status.started && !match.status.finished) {
      return (
        <Badge variant="secondary" className="text-xs">
          <Pause className="w-3 h-3 mr-1" />
          {match.status.liveTime?.short || "HT"}
        </Badge>
      );
    }

    return (
      <Badge variant="outline" className="text-xs">
        <Clock className="w-3 h-3 mr-1" />
        {format(new Date(match.timeTS), "HH:mm")}
      </Badge>
    );
  };

  const getScoreDisplay = () => {
    if (match.status.scoreStr) {
      return match.status.scoreStr;
    }
    
    if (typeof match.home.score === 'number' && typeof match.away.score === 'number') {
      return `${match.home.score} - ${match.away.score}`;
    }
    
    return "- : -";
  };

  return (
    <Card 
      className="p-4 hover-elevate transition-all duration-200"
      data-testid={`match-card-${match.id}`}
    >
      <div className="flex items-center justify-end mb-3">
        {getStatusBadge()}
      </div>

      <div className="grid grid-cols-5 gap-4 items-center">
        <div className="col-span-2 flex items-center gap-2">
          <Avatar className="w-8 h-8 rounded-none">
            <AvatarImage 
              src={`https://images.fotmob.com/image_resources/logo/teamlogo/${match.home.id}.png`}
              alt={match.home.name}
            />
            <AvatarFallback className="text-xs font-semibold bg-secondary">
              {match.home.name.substring(0, 3).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {match.home.name}
            </p>
          </div>
        </div>

        <div className="col-span-1 text-center">
          <p className="text-lg font-bold font-mono text-foreground">
            {getScoreDisplay()}
          </p>
        </div>

        <div className="col-span-2 flex items-center gap-2 justify-end">
          <div className="flex-1 min-w-0 text-right">
            <p className="text-sm font-medium text-foreground truncate">
              {match.away.name}
            </p>
          </div>
          <Avatar className="w-8 h-8 rounded-none">
            <AvatarImage 
              src={`https://images.fotmob.com/image_resources/logo/teamlogo/${match.away.id}.png`}
              alt={match.away.name}
            />
            <AvatarFallback className="text-xs font-semibold bg-secondary">
              {match.away.name.substring(0, 3).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </Card>
  );
}