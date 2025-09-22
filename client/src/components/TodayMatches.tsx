import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import MatchCard from "./MatchCard";
import MatchFilters from "./MatchFilters";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface PopularLeague {
  id: number;
  name: string;
  localizedName: string;
}

interface LeaguesResponse {
  popular: PopularLeague[];
}

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
  time: string;
  home: Team;
  away: Team;
  status: MatchStatus;
  timeTS: number;
}

interface League {
  id: number;
  name: string;
  ccode: string;
  matches: Match[];
}

interface MatchesResponse {
  leagues: League[];
}

interface ProcessedMatch extends Match {
  leagueName: string;
  leagueId: number;
}

export default function TodayMatches() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showLiveOnly, setShowLiveOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const dateString = format(selectedDate, 'yyyyMMdd');
  
  const { data: matchesData, isLoading: matchesLoading } = useQuery<MatchesResponse>({
    queryKey: ['/api/matches', dateString]
  });

  const { data: leaguesData, isLoading: leaguesLoading } = useQuery<LeaguesResponse>({
    queryKey: ['/api/leagues']
  });

  const processedMatches = useMemo(() => {
    if (!matchesData?.leagues) return [];
    
    const matches: ProcessedMatch[] = [];
    matchesData.leagues.forEach(league => {
      league.matches.forEach(match => {
        matches.push({
          ...match,
          leagueName: league.name,
          leagueId: league.id
        });
      });
    });
    
    return matches.sort((a, b) => a.timeTS - b.timeTS);
  }, [matchesData]);

  const filteredMatches = useMemo(() => {
    if (!showLiveOnly) return processedMatches;
    return processedMatches.filter(match => match.status.ongoing || (match.status.started && !match.status.finished));
  }, [processedMatches, showLiveOnly]);

  const liveMatchCount = processedMatches.filter(match => 
    match.status.ongoing || (match.status.started && !match.status.finished)
  ).length;

  // Filter matches based on search query
  const filteredMatchesBySearch = useMemo(() => {
    if (!searchQuery.trim()) return filteredMatches;
    
    const query = searchQuery.toLowerCase().trim();
    return filteredMatches.filter(match => 
      match.leagueName.toLowerCase().includes(query)
    );
  }, [filteredMatches, searchQuery]);

  const groupedMatches = useMemo(() => {
    // Group matches by league ID instead of name
    const groups: Record<number, ProcessedMatch[]> = {};
    filteredMatchesBySearch.forEach(match => {
      const leagueId = match.leagueId;
      if (!groups[leagueId]) {
        groups[leagueId] = [];
      }
      groups[leagueId].push(match);
    });
    
    // Create priority map from popular leagues API data
    const leaguePriority: Record<number, number> = {};
    leaguesData?.popular?.forEach((league, index) => {
      leaguePriority[league.id] = index + 1;
    });

    // Create league info map for display names
    const leagueInfo: Record<number, { name: string; localizedName: string }> = {};
    
    // Add popular leagues first
    leaguesData?.popular?.forEach(league => {
      leagueInfo[league.id] = {
        name: league.name,
        localizedName: league.localizedName
      };
    });
    
    // Add leagues from matches data
    if (matchesData?.leagues) {
      matchesData.leagues.forEach(league => {
        if (!leagueInfo[league.id]) {
          leagueInfo[league.id] = {
            name: league.name,
            localizedName: league.name // Use name as localizedName if not available
          };
        }
      });
    }

    // Sort groups by league priority
    const sortedGroups: Array<{
      leagueId: number;
      leagueName: string;
      localizedName: string;
      matches: ProcessedMatch[];
    }> = [];

    Object.entries(groups).forEach(([leagueIdStr, matches]) => {
      const leagueId = parseInt(leagueIdStr);
      const priority = leaguePriority[leagueId] || 999;
      const info = leagueInfo[leagueId] || { 
        name: matches[0]?.leagueName || 'Unknown League',
        localizedName: matches[0]?.leagueName || 'Unknown League'
      };
      
      sortedGroups.push({
        leagueId,
        leagueName: info.name,
        localizedName: info.localizedName,
        matches
      });
    });

    // Sort by priority, then by name
    sortedGroups.sort((a, b) => {
      const priorityA = leaguePriority[a.leagueId] || 999;
      const priorityB = leaguePriority[b.leagueId] || 999;
      
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      return a.localizedName.localeCompare(b.localizedName);
    });

    return sortedGroups;
  }, [filteredMatchesBySearch, leaguesData]);

  const isLoading = matchesLoading || leaguesLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="h-8 bg-muted rounded animate-pulse" />
          <div className="h-16 bg-muted rounded animate-pulse" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-4 animate-pulse">
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded w-1/4" />
                <div className="h-16 bg-muted rounded" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MatchFilters
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        showLiveOnly={showLiveOnly}
        onToggleLiveOnly={setShowLiveOnly}
        liveMatchCount={liveMatchCount}
      />

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search leagues..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-6">
        {/* Main League Groups */}
        {groupedMatches.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">
              {searchQuery.trim() 
                ? `No leagues found matching "${searchQuery}"`
                : showLiveOnly 
                  ? "No live matches found for this date." 
                  : "No matches found for this date."
              }
            </p>
          </Card>
        ) : (
          groupedMatches.map((leagueGroup) => (
            <Card key={leagueGroup.leagueId} className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8 rounded-none">
                      <AvatarImage 
                        src={`https://images.fotmob.com/image_resources/logo/leaguelogo/${leagueGroup.leagueId}.png`}
                        alt={leagueGroup.localizedName}
                      />
                      <AvatarFallback className="text-xs font-semibold bg-primary text-primary-foreground">
                        {leagueGroup.localizedName.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-lg font-semibold text-foreground">
                      {leagueGroup.localizedName}
                    </h3>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {leagueGroup.matches.length} {leagueGroup.matches.length === 1 ? 'match' : 'matches'}
                  </span>
                </div>
                <div className="space-y-4">
                  {leagueGroup.matches.map((match) => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}