import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Users, Calendar, Trophy, ExternalLink, Zap, ArrowLeft, Star, Target, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

interface TeamData {
  tabs: string[];
  allAvailableSeasons: string[];
  details: {
    id: number;
    type: string;
    name: string;
    latestSeason: string;
    shortName: string;
    country: string;
    faqJSONLD?: {
      mainEntity?: Array<{
        name: string;
        acceptedAnswer: {
          text: string;
        };
      }>;
    };
  };
  sportsTeamJSONLD?: {
    name: string;
    sport: string;
    gender: string;
    logo: string;
    url: string;
    athlete: any[];
    location?: {
      name: string;
      address: {
        addressCountry: string;
        addressLocality: string;
      };
      geo: {
        latitude: string;
        longitude: string;
      };
    };
    memberOf?: {
      name: string;
      url: string;
    };
  };
  breadcrumbJSONLD?: {
    itemListElement?: Array<{
      position: number;
      name: string;
      item: string;
    }>;
  };
  table?: any;
  fixtures?: any;
  squad?: any;
  stats?: any;
  transfers?: any;
  history?: any;
  overview?: any;
  topPlayers?: any;
  nextMatch?: any;
  lastMatch?: any;
  [key: string]: any;
}

async function fetchTeamData(teamId: string): Promise<TeamData> {
  const response = await fetch(`/api/teams/${teamId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch team data");
  }
  return response.json();
}

export default function Team() {
  const { id } = useParams();
  const [location, setLocation] = useLocation();

  const {
    data: teamData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["team", id],
    queryFn: () => fetchTeamData(id!),
    enabled: !!id,
  });

  const goBack = () => {
    window.history.back();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !teamData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Failed to load team data. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { details, sportsTeamJSONLD } = teamData;
  const stadium = sportsTeamJSONLD?.location;
  const league = sportsTeamJSONLD?.memberOf;

  // Extract FAQ information
  const nextMatch = details?.faqJSONLD?.mainEntity?.find(q => q.name.includes("next match"));
  const stadiumCapacity = details?.faqJSONLD?.mainEntity?.find(q => q.name.includes("capacity"));
  const stadiumOpened = details?.faqJSONLD?.mainEntity?.find(q => q.name.includes("opened"));

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Back Button */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={goBack} 
          className="gap-2 hover:bg-muted/50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-border shadow-lg">
                <AvatarImage 
                  src={`https://images.fotmob.com/image_resources/logo/teamlogo/${details?.id}.png`}
                  alt={`${details?.name} logo`}
                  className="object-contain p-2"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary/20 to-primary/5">
                  {details?.shortName?.substring(0, 2).toUpperCase() || details?.name?.substring(0, 2).toUpperCase() || 'TM'}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Star className="w-4 h-4 text-primary-foreground" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                {details?.name || 'Team'}
              </h1>
              <div className="flex items-center gap-4 mb-3">
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  {details?.country || 'N/A'}
                </Badge>
                <Badge variant="outline" className="text-sm px-3 py-1">
                  {details?.latestSeason || 'Current Season'}
                </Badge>
              </div>
              {league && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span className="font-medium">{league.name}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            {sportsTeamJSONLD?.url && (
              <Button 
                variant="outline" 
                className="gap-2" 
                size="sm"
                onClick={() => {
                  const url = sportsTeamJSONLD.url;
                  if (url && (url.startsWith('https://') || url.startsWith('http://'))) {
                    const newWindow = window.open(url, '_blank');
                    if (newWindow) newWindow.opener = null;
                  }
                }}
              >
                <ExternalLink className="w-4 h-4" />
                Official Site
              </Button>
            )}
            <Button variant="default" className="gap-2" size="sm">
              <Star className="w-4 h-4" />
              Follow
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-500/10">
                <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Stadium</p>
                <p className="text-lg font-bold">{stadium?.name || 'N/A'}</p>
                <p className="text-xs text-muted-foreground">
                  {stadium?.address?.addressLocality || ''}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-500/10">
                <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Capacity</p>
                <p className="text-lg font-bold">
                  {stadiumCapacity?.acceptedAnswer.text.match(/(\d+)/)?.[1] || "N/A"}
                </p>
                <p className="text-xs text-muted-foreground">seats</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-purple-500/10">
                <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Founded</p>
                <p className="text-lg font-bold">
                  {stadiumOpened?.acceptedAnswer.text.match(/(\d{4})/)?.[1] || "N/A"}
                </p>
                <p className="text-xs text-muted-foreground">stadium opened</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/20 dark:to-orange-900/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-orange-500/10">
                <Zap className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Next Match</p>
                <p className="text-sm font-bold">
                  {nextMatch ? (
                    nextMatch.acceptedAnswer.text.includes("against") ? 
                      nextMatch.acceptedAnswer.text.split("against ")[1]?.split(".")[0] 
                      : "TBD"
                  ) : "No upcoming"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {nextMatch && nextMatch.acceptedAnswer.text.includes("at") ? 
                    nextMatch.acceptedAnswer.text.split("at ")[1]?.split(" on")[0] 
                    : ""}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Main Content Tabs */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Team Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 h-12 bg-muted/30 rounded-none">
              {teamData.tabs.map((tab) => (
                <TabsTrigger 
                  key={tab} 
                  value={tab} 
                  className="capitalize text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {tab === 'overview' && <Star className="w-4 h-4 mr-1" />}
                  {tab === 'table' && <Trophy className="w-4 h-4 mr-1" />}
                  {tab === 'fixtures' && <Calendar className="w-4 h-4 mr-1" />}
                  {tab === 'squad' && <Users className="w-4 h-4 mr-1" />}
                  {tab === 'stats' && <Target className="w-4 h-4 mr-1" />}
                  <span className="hidden sm:inline">{tab}</span>
                  <span className="sm:hidden">{tab.charAt(0).toUpperCase()}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="overview" className="mt-0 p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Enhanced Team Details */}
                <Card className="border-0 bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-900/20 dark:to-slate-800/10">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Award className="w-5 h-5 text-primary" />
                      Team Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                        <p className="font-semibold text-lg">{details?.name || 'N/A'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Short Name</p>
                        <p className="font-semibold text-lg">{details?.shortName || 'N/A'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Country</p>
                        <p className="font-semibold text-lg">{details?.country || 'N/A'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Sport</p>
                        <p className="font-semibold text-lg capitalize">{sportsTeamJSONLD?.sport?.split("/")[0] || 'Football'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Enhanced Stadium Information */}
                <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      Stadium Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Stadium Name</p>
                        <p className="font-semibold text-lg">{stadium?.name || 'Not available'}</p>
                      </div>
                      {stadium?.address && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Location</p>
                          <p className="font-semibold">
                            {stadium.address.addressLocality}{stadium.address.addressCountry && `, ${stadium.address.addressCountry}`}
                          </p>
                        </div>
                      )}
                      {stadium?.geo && (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Latitude</p>
                            <p className="font-mono text-sm bg-muted/50 px-2 py-1 rounded">{stadium.geo.latitude}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Longitude</p>
                            <p className="font-mono text-sm bg-muted/50 px-2 py-1 rounded">{stadium.geo.longitude}</p>
                          </div>
                        </div>
                      )}
                      {stadium?.geo && (
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="w-full gap-2 mt-4 bg-blue-600 hover:bg-blue-700"
                          onClick={() => {
                            const url = `https://maps.google.com/maps?q=${stadium.geo.latitude},${stadium.geo.longitude}`;
                            window.open(url, '_blank');
                          }}
                        >
                          <MapPin className="w-4 h-4" />
                          View on Map
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Enhanced FAQ Section */}
              {details?.faqJSONLD?.mainEntity && details.faqJSONLD.mainEntity.length > 0 && (
                <Card className="mt-6 border-0 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Zap className="w-5 h-5 text-green-600" />
                      Frequently Asked Questions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {details.faqJSONLD.mainEntity.map((faq, index) => (
                        <div key={index} className="border-l-4 border-green-500 pl-4 py-2 bg-white/50 dark:bg-black/20 rounded-r">
                          <h4 className="font-semibold mb-2 text-green-800 dark:text-green-200">{faq.name}</h4>
                          <p className="text-muted-foreground leading-relaxed">{faq.acceptedAnswer.text}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Table Tab */}
            <TabsContent value="table" className="mt-0 p-6">
              <Card className="border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    League Table
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {Array.isArray(teamData.table) && teamData.table.length > 0 ? (
                    <div className="space-y-6">
                      {teamData.table.map((tableData: any, index: number) => (
                        <div key={index} className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">{tableData.data.leagueName}</h3>
                            <Badge variant="outline" className="text-xs">
                              {tableData.data.ccode}
                            </Badge>
                          </div>
                          
                          {/* Direct table display since some APIs have table directly in data */}
                          {tableData.data.table && (
                            <div key="main-table" className="space-y-3">
                              <h4 className="font-medium text-sm text-muted-foreground">
                                League Table
                              </h4>
                              
                              <div className="overflow-x-auto">
                                <Table>
                                  <TableHeader>
                                    <TableRow className="text-xs">
                                      <TableHead className="w-8">#</TableHead>
                                      <TableHead className="min-w-[200px]">Team</TableHead>
                                      <TableHead className="w-12 text-center">P</TableHead>
                                      <TableHead className="w-12 text-center">W</TableHead>
                                      <TableHead className="w-12 text-center">D</TableHead>
                                      <TableHead className="w-12 text-center">L</TableHead>
                                      <TableHead className="w-16 text-center">GF</TableHead>
                                      <TableHead className="w-16 text-center">GA</TableHead>
                                      <TableHead className="w-16 text-center">GD</TableHead>
                                      <TableHead className="w-12 text-center font-bold">Pts</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {Array.isArray(tableData.data.table?.all) && tableData.data.table.all.map((team: any, teamIndex: number) => (
                                      <TableRow 
                                        key={team.id} 
                                        className={`text-xs ${team.id === details?.id ? 'bg-primary/10 font-semibold border-l-4 border-l-primary' : ''} hover:bg-muted/50`}
                                      >
                                        <TableCell className="text-center">
                                          <div className="flex items-center gap-1">
                                            {team.qualColor && (
                                              <div 
                                                className="w-3 h-3 rounded-full" 
                                                style={{ backgroundColor: team.qualColor }}
                                              />
                                            )}
                                            {team.idx}
                                          </div>
                                        </TableCell>
                                        <TableCell>
                                          <div className="flex items-center gap-2">
                                            <Avatar className="w-6 h-6">
                                              <AvatarImage 
                                                src={`https://images.fotmob.com/image_resources/logo/teamlogo/${team.id}.png`}
                                                alt={`${team.name} logo`}
                                              />
                                              <AvatarFallback className="text-xs">
                                                {team.shortName?.substring(0, 2).toUpperCase()}
                                              </AvatarFallback>
                                            </Avatar>
                                            <span className={team.id === details?.id ? 'font-bold' : ''}>{team.name}</span>
                                          </div>
                                        </TableCell>
                                        <TableCell className="text-center">{team.played}</TableCell>
                                        <TableCell className="text-center">{team.wins}</TableCell>
                                        <TableCell className="text-center">{team.draws}</TableCell>
                                        <TableCell className="text-center">{team.losses}</TableCell>
                                        <TableCell className="text-center">{team.scoresStr?.split('-')?.[0] || '0'}</TableCell>
                                        <TableCell className="text-center">{team.scoresStr?.split('-')?.[1] || '0'}</TableCell>
                                        <TableCell className="text-center">
                                          <span className={(team.goalConDiff ?? 0) > 0 ? 'text-green-600 font-medium' : (team.goalConDiff ?? 0) < 0 ? 'text-red-600 font-medium' : ''}>
                                            {(team.goalConDiff ?? 0) > 0 ? '+' : ''}{team.goalConDiff ?? 0}
                                          </span>
                                        </TableCell>
                                        <TableCell className="text-center font-bold">{team.pts}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>

                              {/* Legend */}
                              {Array.isArray(tableData.data.legend) && tableData.data.legend.length > 0 && (
                                <div className="mt-4">
                                  <h5 className="text-sm font-medium mb-2">Legend</h5>
                                  <div className="flex flex-wrap gap-2">
                                    {tableData.data.legend?.map((legendItem: any, legendIndex: number) => (
                                      <div key={legendIndex} className="flex items-center gap-1 text-xs">
                                        <div 
                                          className="w-3 h-3 rounded-full" 
                                          style={{ backgroundColor: legendItem.color }}
                                        />
                                        <span>{legendItem.title}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                          
                          {/* Nested tables structure */}
                          {tableData.data.tables && tableData.data.tables.map((leagueTable: any, tableIndex: number) => (
                            <div key={tableIndex} className="space-y-3">
                              <h4 className="font-medium text-sm text-muted-foreground">
                                {leagueTable.leagueName}
                              </h4>
                              
                              <div className="overflow-x-auto">
                                <Table>
                                  <TableHeader>
                                    <TableRow className="text-xs">
                                      <TableHead className="w-8">#</TableHead>
                                      <TableHead className="min-w-[200px]">Team</TableHead>
                                      <TableHead className="w-12 text-center">P</TableHead>
                                      <TableHead className="w-12 text-center">W</TableHead>
                                      <TableHead className="w-12 text-center">D</TableHead>
                                      <TableHead className="w-12 text-center">L</TableHead>
                                      <TableHead className="w-16 text-center">GF</TableHead>
                                      <TableHead className="w-16 text-center">GA</TableHead>
                                      <TableHead className="w-16 text-center">GD</TableHead>
                                      <TableHead className="w-12 text-center font-bold">Pts</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {Array.isArray(leagueTable.table?.all) && leagueTable.table.all.map((team: any, teamIndex: number) => (
                                      <TableRow 
                                        key={team.id} 
                                        className={`text-xs ${team.id === details?.id ? 'bg-primary/10 font-semibold border-l-4 border-l-primary' : ''} hover:bg-muted/50`}
                                      >
                                        <TableCell className="text-center">
                                          <div className="flex items-center gap-1">
                                            {team.qualColor && (
                                              <div 
                                                className="w-3 h-3 rounded-full" 
                                                style={{ backgroundColor: team.qualColor }}
                                              />
                                            )}
                                            {team.idx}
                                          </div>
                                        </TableCell>
                                        <TableCell>
                                          <div className="flex items-center gap-2">
                                            <Avatar className="w-6 h-6">
                                              <AvatarImage 
                                                src={`https://images.fotmob.com/image_resources/logo/teamlogo/${team.id}.png`}
                                                alt={`${team.name} logo`}
                                              />
                                              <AvatarFallback className="text-xs">
                                                {team.shortName?.substring(0, 2).toUpperCase()}
                                              </AvatarFallback>
                                            </Avatar>
                                            <span className={team.id === details?.id ? 'font-bold' : ''}>{team.name}</span>
                                          </div>
                                        </TableCell>
                                        <TableCell className="text-center">{team.played}</TableCell>
                                        <TableCell className="text-center">{team.wins}</TableCell>
                                        <TableCell className="text-center">{team.draws}</TableCell>
                                        <TableCell className="text-center">{team.losses}</TableCell>
                                        <TableCell className="text-center">{team.scoresStr?.split('-')?.[0] || '0'}</TableCell>
                                        <TableCell className="text-center">{team.scoresStr?.split('-')?.[1] || '0'}</TableCell>
                                        <TableCell className="text-center">
                                          <span className={(team.goalConDiff ?? 0) > 0 ? 'text-green-600 font-medium' : (team.goalConDiff ?? 0) < 0 ? 'text-red-600 font-medium' : ''}>
                                            {(team.goalConDiff ?? 0) > 0 ? '+' : ''}{team.goalConDiff ?? 0}
                                          </span>
                                        </TableCell>
                                        <TableCell className="text-center font-bold">{team.pts}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>

                              {/* Legend */}
                              {Array.isArray(leagueTable.legend) && leagueTable.legend.length > 0 && (
                                <div className="mt-4">
                                  <h5 className="text-sm font-medium mb-2">Legend</h5>
                                  <div className="flex flex-wrap gap-2">
                                    {leagueTable.legend?.map((legendItem: any, legendIndex: number) => (
                                      <div key={legendIndex} className="flex items-center gap-1 text-xs">
                                        <div 
                                          className="w-3 h-3 rounded-full" 
                                          style={{ backgroundColor: legendItem.color }}
                                        />
                                        <span>{legendItem.title}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">League Table</h3>
                      <p className="text-muted-foreground mb-4">
                        No league table data available for {details?.name}.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Fixtures Tab */}
            <TabsContent value="fixtures" className="mt-0 p-6">
              <Card className="border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    Fixtures & Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {teamData.fixtures ? (
                    <div className="space-y-6">
                      {/* Next Match Highlight */}
                      {teamData.nextMatch && (
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-orange-500" />
                            Next Match
                          </h3>
                          <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-orange-100/30 dark:from-orange-950/20 dark:to-orange-900/10">
                            <CardContent className="pt-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-3">
                                    <Avatar className="w-8 h-8">
                                      <AvatarImage 
                                        src={`https://images.fotmob.com/image_resources/logo/teamlogo/${teamData.nextMatch.homeTeam?.id || details?.id}.png`}
                                        alt="Home team"
                                      />
                                      <AvatarFallback className="text-xs">H</AvatarFallback>
                                    </Avatar>
                                    <span className="font-semibold">{teamData.nextMatch.homeTeam?.name || details?.name}</span>
                                  </div>
                                  <span className="text-2xl font-bold text-muted-foreground">vs</span>
                                  <div className="flex items-center gap-3">
                                    <span className="font-semibold">{teamData.nextMatch.awayTeam?.name || 'TBD'}</span>
                                    <Avatar className="w-8 h-8">
                                      <AvatarImage 
                                        src={`https://images.fotmob.com/image_resources/logo/teamlogo/${teamData.nextMatch.awayTeam?.id}.png`}
                                        alt="Away team"
                                      />
                                      <AvatarFallback className="text-xs">A</AvatarFallback>
                                    </Avatar>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold">{teamData.nextMatch.date}</p>
                                  <p className="text-sm text-muted-foreground">{teamData.nextMatch.time}</p>
                                  <Badge variant="outline" className="mt-1">{teamData.nextMatch.competition}</Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      )}

                      {/* Last Match */}
                      {teamData.lastMatch && (
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-500" />
                            Last Match
                          </h3>
                          <Card className="border-l-4 border-l-blue-500">
                            <CardContent className="pt-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-3">
                                    <Avatar className="w-8 h-8">
                                      <AvatarImage 
                                        src={`https://images.fotmob.com/image_resources/logo/teamlogo/${teamData.lastMatch.homeTeam?.id}.png`}
                                        alt="Home team"
                                      />
                                      <AvatarFallback className="text-xs">H</AvatarFallback>
                                    </Avatar>
                                    <span className="font-semibold">{teamData.lastMatch.homeTeam?.name}</span>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-2xl font-bold">
                                      {teamData.lastMatch.score || teamData.lastMatch.homeScore || '0'} - {teamData.lastMatch.awayScore || '0'}
                                    </div>
                                    <Badge variant={teamData.lastMatch.result === 'W' ? 'default' : teamData.lastMatch.result === 'D' ? 'secondary' : 'destructive'} className="text-xs">
                                      {teamData.lastMatch.result || 'FT'}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="font-semibold">{teamData.lastMatch.awayTeam?.name}</span>
                                    <Avatar className="w-8 h-8">
                                      <AvatarImage 
                                        src={`https://images.fotmob.com/image_resources/logo/teamlogo/${teamData.lastMatch.awayTeam?.id}.png`}
                                        alt="Away team"
                                      />
                                      <AvatarFallback className="text-xs">A</AvatarFallback>
                                    </Avatar>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold">{teamData.lastMatch.date}</p>
                                  <Badge variant="outline" className="mt-1">{teamData.lastMatch.competition}</Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      )}

                      {/* Fixtures List */}
                      {Array.isArray(teamData.fixtures?.allFixtures) && teamData.fixtures.allFixtures.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold mb-4">All Fixtures</h3>
                          <div className="space-y-2">
                            {teamData.fixtures.allFixtures?.slice(0, 10).map((fixture: any, index: number) => (
                              <Card key={index} className="hover:bg-muted/50 transition-colors">
                                <CardContent className="py-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                      <div className="w-16 text-xs text-muted-foreground">
                                        {fixture.date ? format(new Date(fixture.date), 'MMM dd') : 'TBD'}
                                      </div>
                                      <div className="flex items-center gap-3 min-w-[300px]">
                                        <div className="flex items-center gap-2">
                                          <Avatar className="w-6 h-6">
                                            <AvatarImage 
                                              src={`https://images.fotmob.com/image_resources/logo/teamlogo/${fixture.home?.id}.png`}
                                              alt="Home team"
                                            />
                                            <AvatarFallback className="text-xs">H</AvatarFallback>
                                          </Avatar>
                                          <span className="text-sm font-medium">{fixture.home?.name}</span>
                                        </div>
                                        <div className="text-center mx-2">
                                          {fixture.status === 'finished' ? (
                                            <div className="text-sm font-bold">
                                              {fixture.home?.score} - {fixture.away?.score}
                                            </div>
                                          ) : (
                                            <div className="text-sm text-muted-foreground">vs</div>
                                          )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm font-medium">{fixture.away?.name}</span>
                                          <Avatar className="w-6 h-6">
                                            <AvatarImage 
                                              src={`https://images.fotmob.com/image_resources/logo/teamlogo/${fixture.away?.id}.png`}
                                              alt="Away team"
                                            />
                                            <AvatarFallback className="text-xs">A</AvatarFallback>
                                          </Avatar>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className="text-xs">
                                        {fixture.competition || 'League'}
                                      </Badge>
                                      {fixture.status && (
                                        <Badge 
                                          variant={fixture.status === 'finished' ? 'secondary' : 'default'} 
                                          className="text-xs"
                                        >
                                          {fixture.status === 'finished' ? 'FT' : fixture.time || fixture.status}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                          {(teamData.fixtures?.allFixtures?.length || 0) > 10 && (
                            <div className="text-center mt-4">
                              <Badge variant="secondary">
                                Showing 10 of {teamData.fixtures?.allFixtures?.length || 0} fixtures
                              </Badge>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Match Fixtures</h3>
                      <p className="text-muted-foreground mb-4">
                        No fixture data available for {details?.name} at the moment.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Squad Tab */}
            <TabsContent value="squad" className="mt-0 p-6">
              <Card className="border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-500" />
                    Squad
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(teamData.squad && (teamData.squad.players || teamData.squad.length > 0)) || (teamData.sportsTeamJSONLD?.athlete && teamData.sportsTeamJSONLD.athlete.length > 0) ? (
                    <div className="space-y-6">
                      {/* Squad Overview */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/10">
                          <CardContent className="pt-4 text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {teamData.squad?.players?.length || 
                               (Array.isArray(teamData.squad) ? teamData.squad.length : 0) || 
                               (teamData.sportsTeamJSONLD?.athlete?.length || 0)}
                            </div>
                            <p className="text-sm text-muted-foreground">Total Players</p>
                          </CardContent>
                        </Card>
                        <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10">
                          <CardContent className="pt-4 text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {(teamData.squad?.players || []).filter((p: any) => p.position?.includes('GK') || p.role?.includes('Goalkeeper')).length || 0}
                            </div>
                            <p className="text-sm text-muted-foreground">Goalkeepers</p>
                          </CardContent>
                        </Card>
                        <Card className="border-0 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/10">
                          <CardContent className="pt-4 text-center">
                            <div className="text-2xl font-bold text-purple-600">
                              {(teamData.squad?.players || []).filter((p: any) => p.position?.includes('DEF') || p.role?.includes('Defender')).length || 0}
                            </div>
                            <p className="text-sm text-muted-foreground">Defenders</p>
                          </CardContent>
                        </Card>
                        <Card className="border-0 bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/20 dark:to-orange-900/10">
                          <CardContent className="pt-4 text-center">
                            <div className="text-2xl font-bold text-orange-600">
                              {(teamData.squad?.players || []).filter((p: any) => p.position?.includes('MID') || p.position?.includes('FWD') || p.role?.includes('Midfielder') || p.role?.includes('Forward')).length || 0}
                            </div>
                            <p className="text-sm text-muted-foreground">Mid/Forwards</p>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Players List */}
                      {Array.isArray(teamData.squad?.players || teamData.squad) && (teamData.squad?.players || teamData.squad).length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Squad List</h3>
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-16">#</TableHead>
                                  <TableHead className="min-w-[200px]">Player</TableHead>
                                  <TableHead>Position</TableHead>
                                  <TableHead className="text-center">Age</TableHead>
                                  <TableHead className="text-center">Nat</TableHead>
                                  <TableHead className="text-center">Apps</TableHead>
                                  <TableHead className="text-center">Goals</TableHead>
                                  <TableHead className="text-center">Assists</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {(teamData.squad?.players || teamData.squad || []).map((player: any, index: number) => (
                                  <TableRow key={player.id || index} className="hover:bg-muted/50">
                                    <TableCell className="font-medium">
                                      {player.number || player.shirtNumber || index + 1}
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex items-center gap-3">
                                        <Avatar className="w-8 h-8">
                                          <AvatarImage 
                                            src={player.photo || `https://images.fotmob.com/image_resources/playerimages/${player.id}.png`}
                                            alt={`${player.name} photo`}
                                          />
                                          <AvatarFallback className="text-xs">
                                            {player.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || '??'}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <div className="font-semibold">{player.name}</div>
                                          {player.fullName && player.fullName !== player.name && (
                                            <div className="text-xs text-muted-foreground">{player.fullName}</div>
                                          )}
                                        </div>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <Badge variant="secondary" className="text-xs">
                                        {player.position || player.role || 'N/A'}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {player.age || 'N/A'}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      <div className="flex items-center justify-center gap-1">
                                        {player.country && (
                                          <img 
                                            src={`https://images.fotmob.com/image_resources/logo/teamlogo/${player.country.toLowerCase()}.png`}
                                            alt={player.country}
                                            className="w-4 h-3 object-cover rounded-sm"
                                            onError={(e) => {
                                              e.currentTarget.style.display = 'none';
                                            }}
                                          />
                                        )}
                                        <span className="text-xs">{player.nationality || player.country || 'N/A'}</span>
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {player.appearances || player.apps || player.matches || '-'}
                                    </TableCell>
                                    <TableCell className="text-center font-semibold text-green-600">
                                      {player.goals || 0}
                                    </TableCell>
                                    <TableCell className="text-center font-semibold text-blue-600">
                                      {player.assists || 0}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      )}

                      {/* Position Groups */}
                      {teamData.squad?.groups && typeof teamData.squad.groups === 'object' && (
                        <div className="mt-8">
                          <h3 className="text-lg font-semibold mb-4">Squad by Position</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Object.entries(teamData.squad?.groups || {}).map(([position, players]: [string, any]) => (
                              <Card key={position} className="border-0">
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-base capitalize">{position}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                  {(players as any[]).map((player: any, index: number) => (
                                    <div key={player.id || index} className="flex items-center gap-2 p-2 rounded hover:bg-muted/50">
                                      <Avatar className="w-6 h-6">
                                        <AvatarImage 
                                          src={player.photo || `https://images.fotmob.com/image_resources/playerimages/${player.id}.png`}
                                          alt={`${player.name} photo`}
                                        />
                                        <AvatarFallback className="text-xs">
                                          {player.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || '??'}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{player.name}</p>
                                        <p className="text-xs text-muted-foreground">#{player.number || '-'}</p>
                                      </div>
                                    </div>
                                  ))}
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Squad Information</h3>
                      <p className="text-muted-foreground mb-4">
                        Squad information for {details?.name} is not available in the current API response. 
                        This may be due to the off-season period, data privacy restrictions, or the team's squad data not being publicly accessible.
                      </p>
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <span>Available tabs:</span>
                        {teamData.tabs?.filter((tab: string) => tab !== 'squad').slice(0, 3).map((tab: string, index: number) => (
                          <Badge key={tab} variant="outline" className="text-xs capitalize">
                            {tab}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Stats Tab */}
            <TabsContent value="stats" className="mt-0 p-6">
              <Card className="border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-500" />
                    Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {teamData.stats || teamData.topPlayers ? (
                    <div className="space-y-8">
                      {/* Team Stats Overview */}
                      {teamData.stats && (
                        <div>
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-amber-500" />
                            Team Performance
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {teamData.stats.goals && (
                              <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/10">
                                <CardContent className="pt-4 text-center">
                                  <div className="text-2xl font-bold text-green-600">{teamData.stats.goals}</div>
                                  <p className="text-sm text-muted-foreground">Goals Scored</p>
                                </CardContent>
                              </Card>
                            )}
                            {teamData.stats.goalsAgainst && (
                              <Card className="border-0 bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/20 dark:to-red-900/10">
                                <CardContent className="pt-4 text-center">
                                  <div className="text-2xl font-bold text-red-600">{teamData.stats.goalsAgainst}</div>
                                  <p className="text-sm text-muted-foreground">Goals Against</p>
                                </CardContent>
                              </Card>
                            )}
                            {teamData.stats.matches && (
                              <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10">
                                <CardContent className="pt-4 text-center">
                                  <div className="text-2xl font-bold text-blue-600">{teamData.stats.matches}</div>
                                  <p className="text-sm text-muted-foreground">Matches Played</p>
                                </CardContent>
                              </Card>
                            )}
                            {teamData.stats.wins && (
                              <Card className="border-0 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/10">
                                <CardContent className="pt-4 text-center">
                                  <div className="text-2xl font-bold text-purple-600">{teamData.stats.wins}</div>
                                  <p className="text-sm text-muted-foreground">Wins</p>
                                </CardContent>
                              </Card>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Top Players */}
                      {Array.isArray(teamData.topPlayers) && teamData.topPlayers.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Star className="w-5 h-5 text-amber-500" />
                            Top Players
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {teamData.topPlayers?.slice(0, 6).map((player: any, index: number) => (
                              <Card key={player.id || index} className="border-0 hover:shadow-md transition-shadow">
                                <CardContent className="pt-4">
                                  <div className="flex items-center gap-3 mb-3">
                                    <Avatar className="w-10 h-10">
                                      <AvatarImage 
                                        src={player.photo || `https://images.fotmob.com/image_resources/playerimages/${player.id}.png`}
                                        alt={`${player.name} photo`}
                                      />
                                      <AvatarFallback className="text-sm">
                                        {player.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || '??'}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-semibold truncate">{player.name}</h4>
                                      <p className="text-sm text-muted-foreground">{player.position || 'Player'}</p>
                                    </div>
                                    <Badge variant="outline" className="text-xs">#{player.number || '-'}</Badge>
                                  </div>
                                  <div className="space-y-2">
                                    {player.goals !== undefined && (
                                      <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Goals</span>
                                        <span className="font-semibold text-green-600">{player.goals}</span>
                                      </div>
                                    )}
                                    {player.assists !== undefined && (
                                      <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Assists</span>
                                        <span className="font-semibold text-blue-600">{player.assists}</span>
                                      </div>
                                    )}
                                    {player.rating && (
                                      <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Rating</span>
                                        <span className="font-semibold text-purple-600">{player.rating}</span>
                                      </div>
                                    )}
                                    {player.appearances && (
                                      <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Apps</span>
                                        <span className="font-semibold">{player.appearances}</span>
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Additional Stats */}
                      {teamData.stats && typeof teamData.stats === 'object' && Object.keys(teamData.stats).length > 4 && (
                        <div>
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Target className="w-5 h-5 text-purple-500" />
                            Detailed Statistics
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="border-0">
                              <CardContent className="pt-4">
                                <h4 className="font-semibold mb-3">Attacking Stats</h4>
                                <div className="space-y-2">
                                  {teamData.stats.shotsOnTarget && (
                                    <div className="flex justify-between">
                                      <span className="text-sm">Shots on Target</span>
                                      <span className="font-medium">{teamData.stats.shotsOnTarget}</span>
                                    </div>
                                  )}
                                  {teamData.stats.shots && (
                                    <div className="flex justify-between">
                                      <span className="text-sm">Total Shots</span>
                                      <span className="font-medium">{teamData.stats.shots}</span>
                                    </div>
                                  )}
                                  {teamData.stats.possession && (
                                    <div className="flex justify-between">
                                      <span className="text-sm">Possession</span>
                                      <span className="font-medium">{teamData.stats.possession}%</span>
                                    </div>
                                  )}
                                  {teamData.stats.passes && (
                                    <div className="flex justify-between">
                                      <span className="text-sm">Pass Accuracy</span>
                                      <span className="font-medium">{teamData.stats.passes}%</span>
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                            <Card className="border-0">
                              <CardContent className="pt-4">
                                <h4 className="font-semibold mb-3">Defensive Stats</h4>
                                <div className="space-y-2">
                                  {teamData.stats.cleanSheets && (
                                    <div className="flex justify-between">
                                      <span className="text-sm">Clean Sheets</span>
                                      <span className="font-medium">{teamData.stats.cleanSheets}</span>
                                    </div>
                                  )}
                                  {teamData.stats.tackles && (
                                    <div className="flex justify-between">
                                      <span className="text-sm">Tackles</span>
                                      <span className="font-medium">{teamData.stats.tackles}</span>
                                    </div>
                                  )}
                                  {teamData.stats.interceptions && (
                                    <div className="flex justify-between">
                                      <span className="text-sm">Interceptions</span>
                                      <span className="font-medium">{teamData.stats.interceptions}</span>
                                    </div>
                                  )}
                                  {teamData.stats.fouls && (
                                    <div className="flex justify-between">
                                      <span className="text-sm">Fouls</span>
                                      <span className="font-medium">{teamData.stats.fouls}</span>
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Team Statistics</h3>
                      <p className="text-muted-foreground mb-4">
                        No statistical data available for {details?.name} at the moment.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Other tabs */}
            {teamData.tabs.filter(tab => !['overview', 'table', 'fixtures', 'squad', 'stats'].includes(tab)).map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-0 p-6">
                <Card className="border-0">
                  <CardHeader>
                    <CardTitle className="capitalize flex items-center gap-2">
                      <Award className="w-5 h-5 text-orange-500" />
                      {tab}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2 capitalize">{tab} Information</h3>
                      <p className="text-muted-foreground mb-4">
                        {tab} data for {details?.name} will be displayed here.
                      </p>
                      <Badge variant="secondary" className="px-4 py-2 uppercase">{tab} DATA</Badge>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}