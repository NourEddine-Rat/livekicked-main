import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

interface League {
  id: number;
  name: string;
  localizedName: string;
}

interface LeaguesResponse {
  popular: League[];
}

export default function TopLeagues() {
  const { data: leagues, isLoading } = useQuery<LeaguesResponse>({
    queryKey: ['/api/leagues']
  });

  const popularLeagues = leagues?.popular?.slice(0, 10) || [];

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-base font-semibold text-foreground">Top Leagues</h2>
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="p-3 animate-pulse">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-muted rounded-full" />
              <div className="h-3 bg-muted rounded w-20" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-base font-semibold text-foreground">Top Leagues</h2>
        <Badge variant="secondary" className="text-xs">
          {popularLeagues.length}
        </Badge>
      </div>
      
      <div className="space-y-2">
        {popularLeagues.map((league) => (
          <Link key={league.id} href={`/league/${league.id}`}>
            <Card 
              className="p-3 hover-elevate cursor-pointer transition-all duration-200"
              data-testid={`league-card-${league.id}`}
            >
              <div className="flex items-center gap-2">
                <Avatar className="w-6 h-6 rounded-none">
                  <AvatarImage 
                    src={`https://images.fotmob.com/image_resources/logo/leaguelogo/${league.id}.png`}
                    alt={league.name}
                  />
                  <AvatarFallback className="text-xs font-semibold bg-primary text-primary-foreground">
                    {league.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">
                    {league.localizedName}
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}