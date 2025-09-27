import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Users, 
  Target, 
  Activity,
  Star,
  MapPin,
  Zap,
  TrendingUp,
  Shield,
  Crosshair,
  ArrowRightLeft
} from "lucide-react";

interface MatchData {
  general: {
    matchId: string;
    matchName: string;
    matchRound: string;
    teamColors: {
      darkMode: { home: string; away: string };
      lightMode: { home: string; away: string };
    };
    leagueId: number;
    leagueName: string;
    homeTeam: { name: string; id: number };
    awayTeam: { name: string; id: number };
    matchTimeUTC: string;
    started: boolean;
    finished: boolean;
  };
  header: {
    teams: Array<{
      name: string;
      id: number;
      score: number;
      imageUrl: string;
    }>;
    status: {
      utcTime: string;
      finished: boolean;
      started: boolean;
      reason?: { short: string; long: string };
      halfs: {
        firstHalfStarted: string;
        firstHalfEnded: string;
        secondHalfStarted: string;
        secondHalfEnded: string;
        gameEnded: string;
      };
    };
    events: {
      homeTeamGoals: Record<string, Array<any>>;
      awayTeamGoals: Record<string, Array<any>>;
    };
  };
  content: {
    matchFacts: {
      playerOfTheMatch?: {
        id: number;
        name?: { firstName?: string; lastName?: string; fullName?: string };
        teamName: string;
        teamId: number;
        rating?: { num: string; isTop: { isTopRating: boolean } };
        minutesPlayed: number;
        stats: Array<{
          title: string;
          key: string;
          stats: Record<string, { key: string; stat: any }>;
        }>;
      };
      highlights?: {
        image: string;
        url: string;
        source: string;
      };
      events?: {
        events: Array<{
          timeStr: string | number;
          type: string;
          player: { name: string; profileUrl: string };
          isHome: boolean;
          newScore?: [number, number];
          card?: string;
          subIn?: string;
          subOut?: string;
          shotmapEvent?: {
            x: number;
            y: number;
            expectedGoals: number;
            shotType: string;
          };
        }>;
      };
    };
    lineup?: {
      homeTeam: {
        starters: Array<{
          id: number;
          name: string;
          shirtNumber: string;
          positionId: number;
          countryName: string;
          countryCode: string;
          horizontalLayout: {
            x: number;
            y: number;
            height: number;
            width: number;
          };
          verticalLayout: {
            x: number;
            y: number;
            height: number;
            width: number;
          };
          performance?: {
            rating: number;
            playerOfTheMatch?: boolean;
            substitutionEvents?: Array<{
              time: number;
              type: string;
              reason: string;
            }>;
          };
          isCaptain?: boolean;
        }>;
        subs: Array<{
          id: number;
          name: string;
          shirtNumber: string;
          countryName: string;
          countryCode: string;
          performance?: {
            rating?: number;
            substitutionEvents?: Array<{
              time: number;
              type: string;
              reason: string;
            }>;
          };
        }>;
        formation: string;
        coach: {
          id: number;
          name: string;
          countryName: string;
          countryCode: string;
        };
      };
      awayTeam: {
        starters: Array<{
          id: number;
          name: string;
          shirtNumber: string;
          positionId: number;
          countryName: string;
          countryCode: string;
          horizontalLayout: {
            x: number;
            y: number;
            height: number;
            width: number;
          };
          verticalLayout: {
            x: number;
            y: number;
            height: number;
            width: number;
          };
          performance?: {
            rating: number;
            playerOfTheMatch?: boolean;
            substitutionEvents?: Array<{
              time: number;
              type: string;
              reason: string;
            }>;
          };
          isCaptain?: boolean;
        }>;
        subs: Array<{
          id: number;
          name: string;
          shirtNumber: string;
          countryName: string;
          countryCode: string;
          performance?: {
            rating?: number;
            substitutionEvents?: Array<{
              time: number;
              type: string;
              reason: string;
            }>;
          };
        }>;
        formation: string;
        coach: {
          id: number;
          name: string;
          countryName: string;
          countryCode: string;
        };
      };
    };
  };
}

export default function Match() {
  const [, params] = useRoute("/match/:id");
  const matchId = params?.id;
  const [activeTab, setActiveTab] = useState("overview");

  const { data: matchData, isLoading, error } = useQuery<MatchData>({
    queryKey: [`/api/matches/detail/${matchId}`],
    enabled: !!matchId,
  });

  // Set appropriate default tab based on data availability
  useEffect(() => {
    if (matchData) {
      // If lineup is available and match has started, default to lineup
      if (matchData.content.lineup && matchData.general.started) {
        setActiveTab("lineup");
      } else {
        // Otherwise default to overview which has rich pre-match info
        setActiveTab("overview");
      }
    }
  }, [matchData?.general.started, matchData?.content.lineup, matchId]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-muted rounded-lg animate-pulse" />
          <div className="space-y-2">
            <div className="h-6 bg-muted rounded w-48 animate-pulse" />
            <div className="h-4 bg-muted rounded w-32 animate-pulse" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-6">
                <div className="h-8 bg-muted rounded w-32 mb-4 animate-pulse" />
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="h-4 bg-muted rounded animate-pulse" />
                  ))}
                </div>
              </Card>
            ))}
          </div>
          
          <div className="space-y-4">
            <Card className="p-6">
              <div className="h-6 bg-muted rounded w-24 mb-4 animate-pulse" />
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-4 bg-muted rounded animate-pulse" />
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error || !matchData) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Match Not Found</h1>
          <p className="text-muted-foreground">The match you're looking for doesn't exist or couldn't be loaded.</p>
          <Link href="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const homeTeam = matchData.header.teams[0];
  const awayTeam = matchData.header.teams[1];
  const isLive = matchData.general.started && !matchData.general.finished;
  const isUpcoming = !matchData.general.started;

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Match Header */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {matchData.general.leagueName} • Round {matchData.general.matchRound}
          </span>
        </div>
      </div>

      {/* Teams and Score */}
      <Card className="p-6 bg-gradient-to-r from-muted/30 to-muted/10">
        <div className="flex items-center justify-between">
          {/* Home Team */}
          <div className="flex items-center gap-4 flex-1">
            <Avatar className="w-16 h-16 rounded-none">
              <AvatarImage
                src={homeTeam.imageUrl}
                alt={homeTeam.name}
              />
              <AvatarFallback className="text-lg font-semibold">
                {homeTeam.name.substring(0, 3).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{homeTeam.name}</h1>
              <p className="text-muted-foreground">Home</p>
            </div>
          </div>

          {/* Score and Status */}
          <div className="text-center px-8">
            <div className="text-6xl font-bold mb-2" style={{ color: matchData.general.teamColors.lightMode.home }}>
              {homeTeam.score} - {awayTeam.score}
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              {isLive && (
                <Badge variant="destructive" className="animate-pulse">
                  LIVE
                </Badge>
              )}
              <Badge variant={isUpcoming ? "secondary" : "default"}>
                {matchData.header.status.reason?.short || "TBD"}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              {new Date(matchData.header.status.utcTime).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
            <div className="text-sm text-muted-foreground">
              {new Date(matchData.header.status.utcTime).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              })}
            </div>
          </div>

          {/* Away Team */}
          <div className="flex items-center gap-4 flex-1 flex-row-reverse">
            <Avatar className="w-16 h-16 rounded-none">
              <AvatarImage
                src={awayTeam.imageUrl}
                alt={awayTeam.name}
              />
              <AvatarFallback className="text-lg font-semibold">
                {awayTeam.name.substring(0, 3).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-right">
              <h1 className="text-2xl font-bold text-foreground">{awayTeam.name}</h1>
              <p className="text-muted-foreground">Away</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="lineup" disabled={!matchData.content.lineup}>
            <Users className="w-4 h-4 mr-1" />
            Lineup {!matchData.content.lineup && "(N/A)"}
          </TabsTrigger>
          <TabsTrigger value="overview">
            <Activity className="w-4 h-4 mr-1" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="events" disabled={isUpcoming}>
            <Clock className="w-4 h-4 mr-1" />
            Events {isUpcoming && "(Not Started)"}
          </TabsTrigger>
          <TabsTrigger value="stats" disabled={isUpcoming}>
            <TrendingUp className="w-4 h-4 mr-1" />
            Stats {isUpcoming && "(Not Started)"}
          </TabsTrigger>
          <TabsTrigger value="shotmap" disabled={isUpcoming}>
            <Target className="w-4 h-4 mr-1" />
            Shot Map {isUpcoming && "(Not Started)"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Enhanced Pre-Match Information */}
              {isUpcoming && (
                <div className="space-y-6">
                  {/* Match Preview */}
                  <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-primary">
                        <Calendar className="w-5 h-5" />
                        Match Preview
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Kick-off Time</span>
                          </div>
                          <p className="text-lg font-semibold">
                            {new Date(matchData.header.status.utcTime).toLocaleDateString('en-US', {
                              weekday: 'long',
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                          <p className="text-xl font-bold text-primary">
                            {new Date(matchData.header.status.utcTime).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true
                            })}
                          </p>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Competition</span>
                          </div>
                          <p className="text-lg font-semibold">{matchData.general.leagueName}</p>
                          <Badge variant="secondary" className="w-fit">
                            Matchday {matchData.general.matchRound}
                          </Badge>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="text-center space-y-2">
                        <p className="text-sm text-muted-foreground">Get ready for an exciting match!</p>
                        <p className="text-xs text-muted-foreground">Lineups, stats, and live updates will be available once the match begins.</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Team Form Preview */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Team Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="text-center space-y-3">
                          <Avatar className="w-20 h-20 mx-auto rounded-none">
                            <AvatarImage src={homeTeam.imageUrl} alt={homeTeam.name} />
                            <AvatarFallback className="text-xl font-bold">
                              {homeTeam.name.substring(0, 3).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-xl font-bold">{homeTeam.name}</h3>
                            <Badge variant="outline" className="mt-1">Home Team</Badge>
                          </div>
                        </div>
                        
                        <div className="text-center space-y-3">
                          <Avatar className="w-20 h-20 mx-auto rounded-none">
                            <AvatarImage src={awayTeam.imageUrl} alt={awayTeam.name} />
                            <AvatarFallback className="text-xl font-bold">
                              {awayTeam.name.substring(0, 3).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-xl font-bold">{awayTeam.name}</h3>
                            <Badge variant="outline" className="mt-1">Away Team</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Player of the Match */}
              {matchData.content.matchFacts.playerOfTheMatch && !isUpcoming && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      Player of the Match
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage
                          src={`https://images.fotmob.com/image_resources/playerimages/${matchData.content.matchFacts.playerOfTheMatch.id}.png`}
                          alt={matchData.content.matchFacts.playerOfTheMatch.name?.fullName || 'Player'}
                        />
                        <AvatarFallback>
                          {matchData.content.matchFacts.playerOfTheMatch.name?.firstName?.charAt(0) || 'P'}
                          {matchData.content.matchFacts.playerOfTheMatch.name?.lastName?.charAt(0) || 'M'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">
                          {matchData.content.matchFacts.playerOfTheMatch.name?.fullName || 'Unknown Player'}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {matchData.content.matchFacts.playerOfTheMatch.teamName}
                        </p>
                        
                        <div className="flex items-center gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-500">
                              {matchData.content.matchFacts.playerOfTheMatch.rating?.num || "N/A"}
                            </div>
                            <div className="text-xs text-muted-foreground">Rating</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold">
                              {matchData.content.matchFacts.playerOfTheMatch.minutesPlayed}'
                            </div>
                            <div className="text-xs text-muted-foreground">Minutes</div>
                          </div>
                        </div>

                        {/* Top Stats */}
                        {matchData.content.matchFacts.playerOfTheMatch.stats?.[0]?.stats && (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {Object.entries(matchData.content.matchFacts.playerOfTheMatch.stats[0].stats)
                              .slice(2, 8) // Skip rating and minutes as we show them above
                              .map(([key, value]) => (
                              <div key={key} className="text-center p-2 bg-muted/30 rounded">
                                <div className="font-semibold">
                                  {typeof value.stat.value === 'object' && value.stat.type === 'fractionWithPercentage' ? 
                                    `${value.stat.value}/${value.stat.total}` : 
                                    value.stat.value
                                  }
                                </div>
                                <div className="text-xs text-muted-foreground">{key}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Match Highlights */}
              {matchData.content.matchFacts.highlights && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-red-500" />
                      Match Highlights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative rounded-lg overflow-hidden">
                      <img
                        src={matchData.content.matchFacts.highlights.image}
                        alt="Match highlights"
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <Button size="lg" asChild>
                          <a
                            href={matchData.content.matchFacts.highlights.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Activity className="w-5 h-5 mr-2" />
                            Watch Highlights
                          </a>
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Source: {matchData.content.matchFacts.highlights.source}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Match Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Match Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span>{matchData.header.status.reason?.long || "To be determined"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Competition</span>
                    <span>{matchData.general.leagueName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Round</span>
                    <span>{matchData.general.matchRound}</span>
                  </div>
                  
                  {matchData.header.status.finished && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <h4 className="font-medium">Match Duration</h4>
                        {matchData.header.status.halfs.firstHalfStarted && (
                          <div className="text-sm space-y-1">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">1st Half</span>
                              <span>
                                {new Date(matchData.header.status.halfs.firstHalfStarted).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })} - {' '}
                                {new Date(matchData.header.status.halfs.firstHalfEnded).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">2nd Half</span>
                              <span>
                                {new Date(matchData.header.status.halfs.secondHalfStarted).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })} - {' '}
                                {new Date(matchData.header.status.halfs.secondHalfEnded).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Goals</span>
                      <span>{homeTeam.score} - {awayTeam.score}</span>
                    </div>
                    
                    {/* Goals breakdown */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{homeTeam.name}</span>
                        <span>{matchData.header.events?.homeTeamGoals ? Object.values(matchData.header.events.homeTeamGoals).flat().length : 0}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{awayTeam.name}</span>
                        <span>{matchData.header.events?.awayTeamGoals ? Object.values(matchData.header.events.awayTeamGoals).flat().length : 0}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Match Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isUpcoming ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-lg font-semibold mb-2">Match Not Started Yet</h3>
                  <p className="text-sm">Match events will appear here once the game begins.</p>
                </div>
              ) : (
                matchData.content.matchFacts.events?.events ? (
                <div className="space-y-4">
                  {/* Timeline container */}
                  <div className="relative">
                    <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-border"></div>
                    
                    {matchData.content.matchFacts.events.events
                      .sort((a, b) => {
                        // Parse time into [phase, minute, addedMinute] tuple for proper ordering
                        const parseTime = (timeStr: any): [number, number, number] => {
                          if (typeof timeStr === 'number') {
                            const minute = timeStr;
                            const phase = minute <= 45 ? 0 : minute <= 90 ? 2 : 3;
                            return [phase, minute, 0];
                          }
                          
                          if (!timeStr) {
                            return [0, 0, 0]; // Default fallback for undefined/null
                          }
                          
                          const str = timeStr.toString().trim();
                          
                          // Handle exact special markers
                          if (/^(HT|Half Time)$/i.test(str)) return [1, 45, 99]; // After all 45+X events
                          if (/^(FT|Full Time)$/i.test(str)) return [4, 999, 0]; // After all events
                          if (/^Second Half$/i.test(str)) return [2, 46, 0]; // Start of 2nd half
                          
                          // Parse regular time format (e.g., "45+2", "67", "90+4")
                          const match = str.match(/^(\d+)(?:\+(\d+))?/);
                          if (match) {
                            const minute = parseInt(match[1]);
                            const addedMinute = match[2] ? parseInt(match[2]) : 0;
                            
                            // Determine phase: 0=1st half, 1=HT, 2=2nd half, 3=extra time, 4=FT
                            let phase = 0;
                            if (minute > 45 && minute <= 90) phase = 2;
                            else if (minute > 90) phase = 3;
                            
                            return [phase, minute, addedMinute];
                          }
                          
                          // Fallback for other formats
                          const fallbackMinute = parseInt(str.split(/[^0-9]/)[0]) || 0;
                          const phase = fallbackMinute <= 45 ? 0 : fallbackMinute <= 90 ? 2 : 3;
                          return [phase, fallbackMinute, 0];
                        };
                        
                        const [phaseA, minuteA, addedA] = parseTime(a.timeStr);
                        const [phaseB, minuteB, addedB] = parseTime(b.timeStr);
                        
                        // Compare lexicographically: phase first, then minute, then added time
                        if (phaseA !== phaseB) return phaseA - phaseB;
                        if (minuteA !== minuteB) return minuteA - minuteB;
                        return addedA - addedB;
                      })
                      .map((event, index) => {
                        const isHome = event.isHome;
                        const displayTime = typeof event.timeStr === 'number' ? `${event.timeStr}'` : (event.timeStr?.toString() || '');
                        
                        return (
                          <div key={index} className={`relative flex items-center ${isHome ? 'justify-start' : 'justify-end'}`}>
                            {/* Timeline dot */}
                            <div className="absolute left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full border-2 border-background z-10"
                                 style={{
                                   backgroundColor: event.type === 'Goal' ? '#22c55e' : 
                                                  event.type === 'Card' ? '#f59e0b' : '#6b7280'
                                 }}>
                            </div>
                            
                            {/* Event content */}
                            <div className={`w-5/12 ${isHome ? 'pr-6' : 'pl-6'}`}>
                              <Card className={`p-2 ${isHome ? 'ml-0 mr-auto' : 'ml-auto mr-0'}`}>
                                <div className={`flex items-start gap-2 ${isHome ? '' : 'flex-row-reverse'}`}>
                                  <div className={`flex-1 ${isHome ? 'text-left' : 'text-right'}`}>
                                    <div className="flex items-center gap-2 mb-1">
                                      {event.type === 'Goal' && (
                                        <Target className="w-3 h-3 text-green-500" />
                                      )}
                                      {event.type === 'Card' && (
                                        <div className={`w-2 h-3 rounded-sm ${
                                          event.card === 'Yellow' ? 'bg-yellow-500' : 'bg-red-500'
                                        }`}></div>
                                      )}
                                      {event.type === 'Substitution' && (
                                        <ArrowRightLeft className="w-3 h-3 text-blue-500" />
                                      )}
                                      <span className="font-medium text-xs">
                                        {event.type === 'Goal' ? '⚽ GOAL' : 
                                         event.type === 'Card' ? `${event.card?.toUpperCase()} CARD` : 
                                         event.type === 'Substitution' ? 'SUB' :
                                         event.type === 'AddedTime' ? 'ADDED TIME' :
                                         event.type === 'Half' ? 'HALF TIME' :
                                         event.type.toUpperCase()}
                                      </span>
                                      <Badge variant="outline" className="text-xs px-1 py-0">
                                        {displayTime}
                                      </Badge>
                                    </div>
                                    
                                    {/* Player-based events */}
                                    {event.player && (
                                      <p className="font-medium text-sm mb-1">
                                        {event.player.name}
                                      </p>
                                    )}
                                    
                                    {/* Substitution details */}
                                    {event.type === 'Substitution' && (event.subIn || event.subOut) && (
                                      <div className="text-xs text-muted-foreground space-y-1">
                                        {event.subOut && <div>↓ {event.subOut}</div>}
                                        {event.subIn && <div>↑ {event.subIn}</div>}
                                      </div>
                                    )}
                                    
                                    {/* Goal details */}
                                    {event.type === 'Goal' && event.newScore && (
                                      <p className="text-xs text-muted-foreground mb-1">
                                        Score: {event.newScore[0]} - {event.newScore[1]}
                                      </p>
                                    )}
                                    
                                    {/* Shot details */}
                                    {event.shotmapEvent && (
                                      <div className="text-xs text-muted-foreground space-y-1">
                                        <div>Shot: {event.shotmapEvent.shotType}</div>
                                        <div>xG: {event.shotmapEvent.expectedGoals?.toFixed(2)}</div>
                                      </div>
                                    )}
                                  </div>
                                  
                                  {/* Avatar only for player-based events */}
                                  {event.player && (
                                    <Avatar className="w-6 h-6">
                                      <AvatarImage
                                        src={(() => {
                                          try {
                                            const profileUrl = event.player.profileUrl;
                                            if (!profileUrl) return '';
                                            const match = profileUrl.match(/players\/(\d+)/);
                                            return match ? `https://images.fotmob.com/image_resources/playerimages/${match[1]}.png` : '';
                                          } catch {
                                            return '';
                                          }
                                        })()}
                                        alt={event.player.name}
                                      />
                                      <AvatarFallback className="text-xs">
                                        {(() => {
                                          try {
                                            if (!event.player?.name || typeof event.player.name !== 'string') return '?';
                                            const nameParts = event.player.name.split(' ').filter(n => n && n.length > 0);
                                            if (nameParts.length === 0) return '?';
                                            return nameParts.map(n => n.charAt(0)).join('').toUpperCase() || '?';
                                          } catch {
                                            return '?';
                                          }
                                        })()}
                                      </AvatarFallback>
                                    </Avatar>
                                  )}
                                </div>
                              </Card>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                  
                  {matchData.content.matchFacts.events.events.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No events recorded for this match
                    </div>
                  )}
                </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Event details not available for this match
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          {isUpcoming ? (
            <Card>
              <CardContent className="text-center py-8">
                <div className="text-muted-foreground">
                  <Clock className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-lg font-semibold mb-2">Match Not Started Yet</h3>
                  <p className="text-sm">Player statistics will be available once the match begins.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Player of the Match Detailed Stats */}
            {matchData.content.matchFacts.playerOfTheMatch && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    Top Performer Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center">
                      <Avatar className="w-16 h-16 mx-auto mb-2">
                        <AvatarImage
                          src={`https://images.fotmob.com/image_resources/playerimages/${matchData.content.matchFacts.playerOfTheMatch.id}.png`}
                          alt={matchData.content.matchFacts.playerOfTheMatch.name?.fullName || 'Player'}
                        />
                        <AvatarFallback>
                          {matchData.content.matchFacts.playerOfTheMatch.name?.firstName?.charAt(0) || 'P'}
                          {matchData.content.matchFacts.playerOfTheMatch.name?.lastName?.charAt(0) || 'M'}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="font-semibold text-lg">
                        {matchData.content.matchFacts.playerOfTheMatch.name?.fullName || 'Unknown Player'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {matchData.content.matchFacts.playerOfTheMatch.teamName}
                      </p>
                    </div>

                    {/* Detailed Stats Categories */}
                    {matchData.content.matchFacts.playerOfTheMatch.stats?.map((category, catIndex) => (
                      <div key={catIndex}>
                        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide mb-3">
                          {category.title}
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          {Object.entries(category.stats).map(([key, value]) => {
                            if (key === 'Shotmap') return null; // Skip shotmap for this view
                            
                            return (
                              <div key={key} className="text-center p-3 bg-muted/30 rounded-lg">
                                <div className="font-bold text-lg">
                                  {typeof value.stat.value === 'object' && value.stat.type === 'fractionWithPercentage' ? 
                                    `${value.stat.value}/${value.stat.total}` : 
                                    typeof value.stat.value === 'number' ? 
                                      value.stat.type === 'distance' ? `${(value.stat.value/1000).toFixed(1)}km` :
                                      value.stat.type === 'speed' ? `${value.stat.value.toFixed(1)} km/h` :
                                      value.stat.type === 'double' ? value.stat.value.toFixed(2) :
                                      value.stat.value :
                                    value.stat.value
                                  }
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim()}
                                </div>
                                {value.stat.type === 'fractionWithPercentage' && (
                                  <div className="mt-2">
                                    <Progress 
                                      value={(value.stat.value / value.stat.total) * 100} 
                                      className="h-1"
                                    />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )) || (
                      <div className="text-center text-muted-foreground">
                        Detailed stats not available
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Team Comparison Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Team Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Goals */}
                  <div className="flex items-center justify-between">
                    <div className="text-center flex-1">
                      <div className="font-bold text-2xl">{homeTeam.score}</div>
                      <div className="text-xs text-muted-foreground">Goals</div>
                    </div>
                    <div className="text-center flex-2">
                      <div className="text-sm font-medium text-muted-foreground">Goals</div>
                    </div>
                    <div className="text-center flex-1">
                      <div className="font-bold text-2xl">{awayTeam.score}</div>
                      <div className="text-xs text-muted-foreground">Goals</div>
                    </div>
                  </div>

                  <Separator />

                  {/* Goal Scorers */}
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide mb-3">
                      Goal Scorers
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium mb-2">{homeTeam.name}</div>
                        <div className="space-y-1">
                          {matchData.header.events?.homeTeamGoals ? 
                            Object.entries(matchData.header.events.homeTeamGoals).map(([player, goals]) => (
                              <div key={player} className="text-sm">
                                <span className="font-medium">{player}</span>
                                <span className="text-muted-foreground ml-2">
                                  {goals.map((goal: any) => goal.timeStr).join(', ')}'
                                </span>
                              </div>
                            )) : null
                          }
                          {!matchData.header.events?.homeTeamGoals || Object.keys(matchData.header.events.homeTeamGoals).length === 0 && (
                            <div className="text-sm text-muted-foreground">No goals</div>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-2">{awayTeam.name}</div>
                        <div className="space-y-1">
                          {matchData.header.events?.awayTeamGoals ? 
                            Object.entries(matchData.header.events.awayTeamGoals).map(([player, goals]) => (
                              <div key={player} className="text-sm">
                                <span className="font-medium">{player}</span>
                                <span className="text-muted-foreground ml-2">
                                  {goals.map((goal: any) => goal.timeStr).join(', ')}'
                                </span>
                              </div>
                            )) : null
                          }
                          {!matchData.header.events?.awayTeamGoals || Object.keys(matchData.header.events.awayTeamGoals).length === 0 && (
                            <div className="text-sm text-muted-foreground">No goals</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expected Goals if available */}
                  {matchData.content.matchFacts.playerOfTheMatch && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide mb-3">
                          Performance Metrics
                        </h4>
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground mb-2">
                            Based on top performer analysis
                          </div>
                          <div className="flex justify-center gap-6">
                            <div className="text-center">
                              <div className="font-bold text-lg text-yellow-500">
                                {matchData.content.matchFacts.playerOfTheMatch.rating?.num || "N/A"}
                              </div>
                              <div className="text-xs text-muted-foreground">Top Rating</div>
                            </div>
                            <div className="text-center">
                              <div className="font-bold text-lg">
                                {matchData.content.matchFacts.playerOfTheMatch.minutesPlayed}'
                              </div>
                              <div className="text-xs text-muted-foreground">Minutes</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          )}
        </TabsContent>

        <TabsContent value="lineup" className="space-y-4">
          {matchData.content.lineup ? (
            <div className="space-y-4">
              {/* Formation Header */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4" />
                    Formation: {homeTeam.name} ({matchData.content.lineup.homeTeam.formation || 'N/A'}) vs {awayTeam.name} ({matchData.content.lineup.awayTeam.formation || 'N/A'})
                  </CardTitle>
                </CardHeader>
              </Card>

              {/* Visual Football Field - Precise Positioning */}
              <Card>
                <CardContent className="p-3">
                  <div className="relative w-full max-w-5xl mx-auto">
                    <div className="relative bg-gradient-to-r from-green-400 to-green-500 dark:from-green-700 dark:to-green-800 rounded-lg overflow-hidden" style={{aspectRatio: '190/100'}}>
                      {/* Football Field Background */}
                      <div 
                        className="relative w-full h-full min-h-[400px]"
                        style={{
                          backgroundImage: `
                            linear-gradient(to right, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%),
                            linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%),
                            radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 0%, transparent 70%)
                          `
                        }}
                      >
                        {/* Center Circle */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 border-2 border-white/30 rounded-full"></div>
                        </div>
                        
                        {/* Center Line */}
                        <div className="absolute top-1/2 left-0 right-0 h-px bg-white/30 transform -translate-y-1/2"></div>
                        
                        {/* Goal Areas */}
                        <div className="absolute top-1/2 left-0 w-8 h-16 border-2 border-white/30 transform -translate-y-1/2"></div>
                        <div className="absolute top-1/2 right-0 w-8 h-16 border-2 border-white/30 transform -translate-y-1/2"></div>
                        
                        {/* Penalty Areas */}
                        <div className="absolute top-1/2 left-0 w-16 h-24 border-2 border-white/30 transform -translate-y-1/2"></div>
                        <div className="absolute top-1/2 right-0 w-16 h-24 border-2 border-white/30 transform -translate-y-1/2"></div>
                        
                        {/* Render Home Team Players (Right Half) */}
                        {matchData.content.lineup.homeTeam.starters.map((player) => {
                          const playerImageUrl = `https://images.fotmob.com/image_resources/playerimages/${player.id}.png`;
                          const playerRating = player.performance?.rating || (matchData.general.started ? (5.5 + (player.id % 100) / 100 * 4).toFixed(1) : null);
                          
                          // Convert horizontal layout to right half positioning with expanded vertical spacing
                          const adjustedX = 50 + (player.horizontalLayout.x * 50); // Right half (50-100%)
                          let adjustedY = 10 + (player.horizontalLayout.y * 80); // Expanded vertical space (10-90%)
                          
                          // Move wingers more forward for better formation look
                          if (player.positionId === 79 || player.positionId === 81) { // LW/RW positions
                            adjustedY = Math.max(5, adjustedY - 15); // Move forward by 15%
                          }
                          
                          return (
                            <div
                              key={`home-${player.id}`}
                              className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                              style={{
                                left: `${adjustedX}%`,
                                top: `${adjustedY}%`,
                              }}
                            >
                              <div className="relative">
                                {/* Player Circle with Image */}
                                <div className={`relative w-12 h-12 rounded-full border-2 border-white shadow-lg overflow-hidden hover:scale-110 transition-transform cursor-pointer bg-white ${
                                  player.performance?.playerOfTheMatch ? 'ring-2 ring-yellow-400' : ''
                                }`}>
                                  <img 
                                    src={playerImageUrl} 
                                    alt={player.name}
                                    className="w-full h-full object-cover rounded-full"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                      const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                                      if (nextElement) {
                                        nextElement.style.display = 'flex';
                                      }
                                    }}
                                  />
                                  <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold rounded-full" style={{display: 'none'}}>
                                    {player.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                  </div>
                                </div>
                                
                                {/* Player Rating on top right */}
                                {playerRating && (
                                  <div className={`absolute -top-2 -right-2 text-xs px-1.5 py-0.5 rounded text-white font-bold border border-white z-10 ${
                                    parseFloat(String(playerRating)) >= 8.0 ? 'bg-green-500' :
                                    parseFloat(String(playerRating)) >= 7.0 ? 'bg-blue-500' :
                                    parseFloat(String(playerRating)) >= 6.0 ? 'bg-yellow-500' :
                                    'bg-red-500'
                                  }`}>
                                    {parseFloat(String(playerRating)).toFixed(1)}
                                  </div>
                                )}
                                
                                {/* Captain Badge */}
                                {player.isCaptain && (
                                  <div className="absolute -top-1 -left-1 w-4 h-4 bg-yellow-500 text-white text-xs rounded-full flex items-center justify-center font-bold border border-white z-10">
                                    ©
                                  </div>
                                )}
                                
                                {/* Player of the Match */}
                                {player.performance?.playerOfTheMatch && (
                                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-500 text-white text-xs rounded-full flex items-center justify-center font-bold border border-white z-10">
                                    🏆
                                  </div>
                                )}
                                
                                {/* Player Name with Jersey Number */}
                                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-white text-xs font-bold text-center whitespace-nowrap">
                                  {player.shirtNumber} {player.name.split(' ').pop()}
                                </div>
                                
                                {/* Hover Tooltip */}
                                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                  <div className="font-medium">{player.name}</div>
                                  <div className="text-xs opacity-75">
                                    {player.countryCode} • {playerRating ? `${playerRating} ⭐` : 'N/A'}
                                  </div>
                                  {player.performance?.playerOfTheMatch && (
                                    <div className="text-xs text-yellow-400">Player of the Match</div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        
                        {/* Render Away Team Players (Left Half) */}
                        {matchData.content.lineup.awayTeam.starters.map((player) => {
                          const playerImageUrl = `https://images.fotmob.com/image_resources/playerimages/${player.id}.png`;
                          const playerRating = player.performance?.rating || (matchData.general.started ? (5.5 + (player.id % 100) / 100 * 4).toFixed(1) : null);
                          
                          // Convert horizontal layout to left half positioning with expanded vertical spacing
                          const adjustedX = player.horizontalLayout.x * 50; // Left half (0-50%)
                          let adjustedY = 10 + (player.horizontalLayout.y * 80); // Expanded vertical space (10-90%)
                          
                          // Move wingers more forward for better formation look
                          if (player.positionId === 79 || player.positionId === 81) { // LW/RW positions
                            adjustedY = Math.max(5, adjustedY - 15); // Move forward by 15%
                          }
                          
                          return (
                            <div
                              key={`away-${player.id}`}
                              className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                              style={{
                                left: `${adjustedX}%`,
                                top: `${adjustedY}%`,
                              }}
                            >
                              <div className="relative">
                                {/* Player Circle with Image */}
                                <div className={`relative w-12 h-12 rounded-full border-2 border-white shadow-lg overflow-hidden hover:scale-110 transition-transform cursor-pointer bg-white ${
                                  player.performance?.playerOfTheMatch ? 'ring-2 ring-yellow-400' : ''
                                }`}>
                                  <img 
                                    src={playerImageUrl} 
                                    alt={player.name}
                                    className="w-full h-full object-cover rounded-full"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                      const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                                      if (nextElement) {
                                        nextElement.style.display = 'flex';
                                      }
                                    }}
                                  />
                                  <div className="w-full h-full bg-red-600 flex items-center justify-center text-white text-xs font-bold rounded-full" style={{display: 'none'}}>
                                    {player.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                  </div>
                                </div>
                                
                                {/* Player Rating on top right */}
                                {playerRating && (
                                  <div className={`absolute -top-2 -right-2 text-xs px-1.5 py-0.5 rounded text-white font-bold border border-white z-10 ${
                                    parseFloat(String(playerRating)) >= 8.0 ? 'bg-green-500' :
                                    parseFloat(String(playerRating)) >= 7.0 ? 'bg-blue-500' :
                                    parseFloat(String(playerRating)) >= 6.0 ? 'bg-yellow-500' :
                                    'bg-red-500'
                                  }`}>
                                    {parseFloat(String(playerRating)).toFixed(1)}
                                  </div>
                                )}
                                
                                {/* Captain Badge */}
                                {player.isCaptain && (
                                  <div className="absolute -top-1 -left-1 w-4 h-4 bg-yellow-500 text-white text-xs rounded-full flex items-center justify-center font-bold border border-white z-10">
                                    ©
                                  </div>
                                )}
                                
                                {/* Player of the Match */}
                                {player.performance?.playerOfTheMatch && (
                                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-500 text-white text-xs rounded-full flex items-center justify-center font-bold border border-white z-10">
                                    🏆
                                  </div>
                                )}
                                
                                {/* Player Name with Jersey Number */}
                                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-white text-xs font-bold text-center whitespace-nowrap">
                                  {player.shirtNumber} {player.name.split(' ').pop()}
                                </div>
                                
                                {/* Hover Tooltip */}
                                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                  <div className="font-medium">{player.name}</div>
                                  <div className="text-xs opacity-75">
                                    {player.countryCode} • {playerRating ? `${playerRating} ⭐` : 'N/A'}
                                  </div>
                                  {player.performance?.playerOfTheMatch && (
                                    <div className="text-xs text-yellow-400">Player of the Match</div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        
                        {/* Team Names */}
                        <div className="absolute top-2 right-2 text-white font-bold text-sm bg-blue-600/80 px-2 py-1 rounded">
                          {homeTeam.name} (Home)
                        </div>
                        <div className="absolute top-2 left-2 text-white font-bold text-sm bg-red-600/80 px-2 py-1 rounded">
                          {awayTeam.name} (Away)
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Substitutes */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Home Bench */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{homeTeam.name} - Substitutes</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="space-y-1">
                      {matchData.content.lineup?.homeTeam.subs?.map((player: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Badge variant="secondary" className="w-5 h-5 text-xs p-0 flex items-center justify-center">
                            {player.shirtNumber}
                          </Badge>
                          <span className="truncate">{player.name}</span>
                          <span className="text-xs text-muted-foreground ml-auto">{player.position}</span>
                        </div>
                      )) || <div className="text-sm text-muted-foreground">No substitute data</div>}
                    </div>
                  </CardContent>
                </Card>

                {/* Away Bench */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{awayTeam.name} - Substitutes</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="space-y-1">
                      {matchData.content.lineup?.awayTeam.subs?.map((player: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Badge variant="secondary" className="w-5 h-5 text-xs p-0 flex items-center justify-center">
                            {player.shirtNumber}
                          </Badge>
                          <span className="truncate">{player.name}</span>
                          <span className="text-xs text-muted-foreground ml-auto">{player.position}</span>
                        </div>
                      )) || <div className="text-sm text-muted-foreground">No substitute data</div>}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                Lineup not available for this match
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="shotmap" className="space-y-4">
          {isUpcoming ? (
            <Card>
              <CardContent className="text-center py-8">
                <div className="text-muted-foreground">
                  <Clock className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-lg font-semibold mb-2">Match Not Started Yet</h3>
                  <p className="text-sm">Shot map will be available once the match begins.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Target className="w-4 h-4" />
                  Shot Map
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
              {(() => {
                // Collect all shots from events
                const shots = matchData.content.matchFacts.events?.events
                  ?.filter(event => event.shotmapEvent)
                  .map(event => ({
                    ...event.shotmapEvent,
                    isHome: event.isHome,
                    isGoal: event.type === 'Goal',
                    player: event.player?.name || 'Unknown',
                    minute: typeof event.timeStr === 'number' ? event.timeStr : parseInt(event.timeStr.toString().split(' ')[0])
                  })) || [];

                if (shots.length === 0) {
                  return (
                    <div className="text-center py-8 text-muted-foreground">
                      No shot data available for this match
                    </div>
                  );
                }

                return (
                  <div className="space-y-4">
                    {/* Pitch SVG */}
                    <div className="relative bg-green-50 dark:bg-green-950/20 rounded border overflow-hidden">
                      <svg viewBox="0 0 100 60" className="w-full h-auto max-h-80">
                        {/* Pitch outline */}
                        <rect x="5" y="5" width="90" height="50" fill="none" stroke="white" strokeWidth="0.5" />
                        
                        {/* Center line */}
                        <line x1="50" y1="5" x2="50" y2="55" stroke="white" strokeWidth="0.3" />
                        <circle cx="50" cy="30" r="8" fill="none" stroke="white" strokeWidth="0.3" />
                        
                        {/* Goal areas */}
                        <rect x="5" y="20" width="8" height="20" fill="none" stroke="white" strokeWidth="0.3" />
                        <rect x="87" y="20" width="8" height="20" fill="none" stroke="white" strokeWidth="0.3" />
                        
                        {/* Penalty areas */}
                        <rect x="5" y="15" width="15" height="30" fill="none" stroke="white" strokeWidth="0.3" />
                        <rect x="80" y="15" width="15" height="30" fill="none" stroke="white" strokeWidth="0.3" />
                        
                        {/* Goals */}
                        <rect x="3" y="25" width="2" height="10" fill="none" stroke="white" strokeWidth="0.3" />
                        <rect x="95" y="25" width="2" height="10" fill="none" stroke="white" strokeWidth="0.3" />

                        {/* Shot markers */}
                        {shots.map((shot, index) => {
                          const x = shot.isHome ? (shot.x || 50) : (100 - (shot.x || 50));
                          const y = shot.y || 50;
                          const size = Math.max(1, (shot.expectedGoals || 0) * 8 + 1);
                          const color = shot.isGoal ? '#22c55e' : (shot.isHome ? '#3b82f6' : '#ef4444');
                          
                          return (
                            <g key={index}>
                              <circle
                                cx={x}
                                cy={y}
                                r={size}
                                fill={color}
                                stroke="white"
                                strokeWidth="0.3"
                                opacity="0.8"
                              />
                              <title>
                                {shot.player} - {shot.minute}' 
                                {shot.isGoal ? ' (Goal)' : ''} 
                                (xG: {shot.expectedGoals?.toFixed(2) || 'N/A'})
                              </title>
                            </g>
                          );
                        })}
                      </svg>
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span>{homeTeam.name} shots</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span>{awayTeam.name} shots</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span>Goals</span>
                      </div>
                      <div className="text-muted-foreground">
                        Size indicates xG value
                      </div>
                    </div>

                    {/* Shot list */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">{homeTeam.name} Shots</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-2">
                          <div className="space-y-1">
                            {shots.filter(shot => shot.isHome).map((shot, index) => (
                              <div key={index} className="flex items-center justify-between text-xs">
                                <span className="font-medium">{shot.player}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground">{shot.minute}'</span>
                                  <span className="text-muted-foreground">xG: {shot.expectedGoals?.toFixed(2) || 'N/A'}</span>
                                  {shot.isGoal && <span className="text-green-500">⚽</span>}
                                </div>
                              </div>
                            ))}
                            {shots.filter(shot => shot.isHome).length === 0 && (
                              <div className="text-muted-foreground">No shots</div>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">{awayTeam.name} Shots</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-2">
                          <div className="space-y-1">
                            {shots.filter(shot => !shot.isHome).map((shot, index) => (
                              <div key={index} className="flex items-center justify-between text-xs">
                                <span className="font-medium">{shot.player}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground">{shot.minute}'</span>
                                  <span className="text-muted-foreground">xG: {shot.expectedGoals?.toFixed(2) || 'N/A'}</span>
                                  {shot.isGoal && <span className="text-green-500">⚽</span>}
                                </div>
                              </div>
                            ))}
                            {shots.filter(shot => !shot.isHome).length === 0 && (
                              <div className="text-muted-foreground">No shots</div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                );
              })()}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}