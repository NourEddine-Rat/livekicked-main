import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ChevronRight, Trophy } from "lucide-react";

interface League {
  id: number;
  name: string;
  localizedName: string;
}

interface LeaguesResponse {
  popular?: League[];
  // Potential other shapes the API might return
  leagues?: League[];
  all?: League[] | Record<string, League[]>;
  countries?: Array<{ name: string; leagues: League[] }>;
}

export default function TopLeagues() {
  const { data: leagues, isLoading } = useQuery<LeaguesResponse>({
    queryKey: ['/api/leagues']
  });

  const displayLeagues: League[] = (() => {
    if (!leagues) return [];
    // 1) Explicit full list
    if (Array.isArray(leagues.leagues)) return leagues.leagues;
    // 2) 'all' could be an array or a map-of-arrays
    if (Array.isArray(leagues.all)) return leagues.all as League[];
    if (leagues.all && typeof leagues.all === 'object') {
      const groups = Object.values(leagues.all as Record<string, League[]>);
      return groups.flat();
    }
    // 3) Country-grouped leagues
    if (Array.isArray(leagues.countries)) {
      return leagues.countries.flatMap(c => c.leagues || []);
    }
    // 4) Fallback to popular (may be limited)
    return leagues.popular || [];
  })();

  // Prioritize popular leagues at the top while preserving a full list
  const orderedLeagues: League[] = (() => {
    if (!leagues?.popular || leagues.popular.length === 0) return displayLeagues;
    const popularOrder = new Map<number, number>();
    leagues.popular.forEach((l, idx) => popularOrder.set(l.id, idx));
    const popularFirst: League[] = [];
    const others: League[] = [];
    displayLeagues.forEach(l => {
      if (popularOrder.has(l.id)) popularFirst.push(l); else others.push(l);
    });
    // Keep popular in API's given order; sort others alphabetically for consistency
    popularFirst.sort((a, b) => (popularOrder.get(a.id)! - popularOrder.get(b.id)!));
    others.sort((a, b) => a.localizedName.localeCompare(b.localizedName));
    return [...popularFirst, ...others];
  })();

  if (isLoading) {
    return (
      <div className="space-y-3 px-2">
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Leagues</h2>
          <Badge variant="secondary" className="text-xs">—</Badge>
        </div>
        <Card className="overflow-hidden">
          <div className="divide-y">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="px-3 py-2 animate-pulse">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-muted rounded" />
                  <div className="h-3 bg-muted rounded w-24" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-3 px-2">
      <div className="flex items-center gap-2 mb-2">
        <Trophy className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">Leagues</h2>
        <Badge variant="secondary" className="text-xs">
          {orderedLeagues.length}
        </Badge>
      </div>

      <Card className="overflow-hidden">
        <div className="divide-y">
          {orderedLeagues.map((league) => (
            <Link key={league.id} href={`/league/${league.id}`} className="block group">
              <div 
                className="px-3 py-2 transition-colors group-hover:bg-muted/60"
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
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground opacity-70 group-hover:opacity-100" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}