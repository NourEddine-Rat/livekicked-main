import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock, Play, CheckCircle, Pause } from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";

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
  const isNotStarted = !match.status.started && !match.status.ongoing && !match.status.finished;
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
    if (isNotStarted) {
      return "Not started";
    }
    if (match.status.scoreStr) {
      return match.status.scoreStr;
    }
    
    if (typeof match.home.score === 'number' && typeof match.away.score === 'number') {
      return `${match.home.score} - ${match.away.score}`;
    }
    
    return "- : -";
  };

  const handleMatchClick = (e: React.MouseEvent) => {
    // Only navigate to match if clicking on card area, not team links
    if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.match-card-content')) {
      window.location.href = `/match/${match.id}`;
    }
  };

  return (
    <div 
      className="p-3 rounded-lg border border-transparent hover:border-border hover:bg-muted/30 transition-all duration-200 cursor-pointer match-card-content"
      data-testid={`match-card-${match.id}`}
      onClick={handleMatchClick}
    >
        <div className="flex items-center justify-end mb-2">
          {getStatusBadge()}
        </div>

        <div className="grid grid-cols-5 gap-2 sm:gap-4 items-center">
          <div className="col-span-2 flex items-center gap-1 sm:gap-2">
            <Link href={`/team/${match.home.id}`}>
              <div onClick={(e) => e.stopPropagation()} className="hover:opacity-75 transition-opacity">
                <Avatar className="w-6 h-6 sm:w-8 sm:h-8 rounded-none flex-shrink-0 cursor-pointer">
                  <AvatarImage 
                    src={`https://images.fotmob.com/image_resources/logo/teamlogo/${match.home.id}.png`}
                    alt={match.home.name}
                  />
                  <AvatarFallback className="text-xs font-semibold bg-secondary">
                    {match.home.name.substring(0, 3).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </Link>
            <div className="flex-1 min-w-0">
              <Link href={`/team/${match.home.id}`}>
                <p 
                  className="text-xs sm:text-sm font-medium text-foreground truncate cursor-pointer hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {match.home.name}
                </p>
              </Link>
            </div>
          </div>

          <div className="col-span-1 text-center">
            {isNotStarted ? (
              <Badge variant="secondary" className="text-[10px] sm:text-xs px-2 py-0.5">
                Not started
              </Badge>
            ) : (
              <p className="text-sm sm:text-lg font-bold font-mono text-foreground">
                {getScoreDisplay()}
              </p>
            )}
          </div>

          <div className="col-span-2 flex items-center gap-1 sm:gap-2 justify-end">
            <div className="flex-1 min-w-0 text-right">
              <Link href={`/team/${match.away.id}`}>
                <p 
                  className="text-xs sm:text-sm font-medium text-foreground truncate cursor-pointer hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {match.away.name}
                </p>
              </Link>
            </div>
            <Link href={`/team/${match.away.id}`}>
              <div onClick={(e) => e.stopPropagation()} className="hover:opacity-75 transition-opacity">
                <Avatar className="w-6 h-6 sm:w-8 sm:h-8 rounded-none flex-shrink-0 cursor-pointer">
                  <AvatarImage 
                    src={`https://images.fotmob.com/image_resources/logo/teamlogo/${match.away.id}.png`}
                    alt={match.away.name}
                  />
                  <AvatarFallback className="text-xs font-semibold bg-secondary">
                    {match.away.name.substring(0, 3).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </Link>
          </div>
        </div>
      </div>
  );
}