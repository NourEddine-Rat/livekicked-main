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

  // Classify competitions into League vs Cup for side-by-side tables
  const tablesArray = Array.isArray(teamData.table) ? teamData.table : [];
  const isCupCompetition = (name: string = "") => /cup|champions|europa|conference|super|uefa|copa|shield|trophy/i.test(name);
  const leagueTables = tablesArray.filter((t: any) => t?.data?.leagueName && !isCupCompetition(t.data.leagueName));
  const cupTables = tablesArray.filter((t: any) => t?.data?.leagueName && isCupCompetition(t.data.leagueName));

  // Build a unified squad list from various possible API shapes
  const squadList: any[] = (() => {
    // 1) squad.players array
    if (Array.isArray(teamData.squad?.players)) return teamData.squad.players as any[];
    // 2) squad as array
    if (Array.isArray(teamData.squad)) return teamData.squad as any[];
    // 3) sportsTeamJSONLD.athlete
    if (Array.isArray(teamData.sportsTeamJSONLD?.athlete)) return teamData.sportsTeamJSONLD.athlete as any[];
    // 4) Deep search for plausible player arrays anywhere in the payload
    const visited = new WeakSet<object>();
    const candidates: any[] = [];
    const isPlayerLike = (obj: any) => obj && typeof obj === 'object' && typeof obj.name === 'string' && (obj.role || obj.position || obj.positionName || typeof obj.id !== 'undefined');
    const walk = (node: any) => {
      if (!node || typeof node !== 'object') return;
      if (visited.has(node)) return;
      visited.add(node);
      if (Array.isArray(node)) {
        if (node.length > 0 && node.every(isPlayerLike)) {
          candidates.push(...node);
          return; // do not recurse into obvious player arrays further
        }
        node.forEach(walk);
        return;
      }
      Object.values(node).forEach(walk);
    };
    walk(teamData);
    return candidates;
  })();

  // Helpers to safely render possibly-object fields
  const toText = (value: any): string => {
    if (value == null) return '';
    if (typeof value === 'string' || typeof value === 'number') return String(value);
    if (typeof value === 'object') {
      if (typeof (value as any).label === 'string') return (value as any).label as string;
      if (typeof (value as any).name === 'string') return (value as any).name as string;
      if (typeof (value as any).key === 'string') return (value as any).key as string;
    }
    return '';
  };

  const normalizePlayer = (raw: any) => {
    if (!raw || typeof raw !== 'object') return null;
    const id = typeof raw.id === 'number' || typeof raw.id === 'string' ? raw.id : undefined;
    const name = toText(raw.name) || toText(raw.fullName) || '';
    const fullName = toText(raw.fullName) || '';
    const photo = raw.photo || raw.image || (id ? `https://images.fotmob.com/image_resources/playerimages/${id}.png` : '');
    const position = toText(raw.position) || toText(raw.role) || toText(raw.positionName) || 'N/A';
    const nationality = toText(raw.nationality) || toText(raw.country) || '';
    const number = raw.number || raw.shirtNumber || '';
    return { id, name: name || fullName || 'Unknown', fullName, photo, position, nationality, number };
  };

  const normalizedSquad = squadList
    .map(normalizePlayer)
    .filter((p): p is NonNullable<ReturnType<typeof normalizePlayer>> => !!p)
    .filter((p, idx, arr) => arr.findIndex(q => String(q.id || q.name) === String(p.id || p.name)) === idx);

  // Fixtures data from overviewFixtures
  const fixturesData = Array.isArray((teamData as any).overviewFixtures) ? (teamData as any).overviewFixtures : [];

  // Grouped squad structure: teamData.squad.squad[] with { title, members[] }
  const groupedSquad: Array<{ title: string; members: ReturnType<typeof normalizePlayer>[] }> = (() => {
    const groups = Array.isArray((teamData as any).squad?.squad) ? (teamData as any).squad.squad : [];
    if (!Array.isArray(groups) || groups.length === 0) return [];
    const titleToShortPos = (t: string) => {
      const s = t.toLowerCase();
      if (/keeper|goal/i.test(s)) return 'GK';
      if (/defen/i.test(s)) return 'DEF';
      if (/mid/i.test(s)) return 'MID';
      if (/attack|forw|strik/i.test(s)) return 'FWD';
      if (/coach|manager/i.test(s)) return 'Coach';
      return '';
    };
    const normGroups = groups.map((g: any) => {
      const title = String(g?.title || 'Squad');
      const members = Array.isArray(g?.members) ? g.members : [];
      const shortPos = titleToShortPos(title);
      const normMembers = members.map((m: any) => {
        const n = normalizePlayer(m);
        if (!n) return null;
        const roleObj = m?.role;
        const roleText = typeof roleObj === 'object' ? (roleObj.fallback || roleObj.key || '') : toText(roleObj);
        const ccode = toText(m?.ccode);
        const cname = toText(m?.cname);
        return {
          ...n,
          position: n.position === 'N/A' ? (shortPos || roleText || 'N/A') : n.position,
          nationality: n.nationality || cname || ccode,
          number: n.number,
        };
      }).filter(Boolean) as ReturnType<typeof normalizePlayer>[];
      return { title, members: normMembers };
    }).filter((g: any) => g.members && g.members.length > 0);
    return normGroups;
  })();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={goBack} 
            className="gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

        {/* Professional Header Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="w-20 h-20 border-2 border-gray-200 dark:border-gray-600 shadow-sm">
                  <AvatarImage 
                    src={`https://images.fotmob.com/image_resources/logo/teamlogo/${details?.id}.png`}
                    alt={`${details?.name} logo`}
                    className="object-contain p-2"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  <AvatarFallback className="text-xl font-bold bg-gray-100 dark:bg-gray-700">
                    {details?.shortName?.substring(0, 2).toUpperCase() || details?.name?.substring(0, 2).toUpperCase() || 'TM'}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {details?.name || 'Team'}
                </h1>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <Badge variant="secondary" className="text-sm">
                    {details?.country || 'N/A'}
                  </Badge>
                  <Badge variant="outline" className="text-sm">
                    {details?.latestSeason || 'Current Season'}
                  </Badge>
                  {stadiumOpened?.acceptedAnswer.text.match(/(\d{4})/)?.[1] && (
                    <Badge variant="outline" className="text-sm">
                      Founded {stadiumOpened.acceptedAnswer.text.match(/(\d{4})/)?.[1]}
                    </Badge>
                  )}
                </div>
                {league && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Trophy className="w-4 h-4" />
                    <span className="font-medium">{league.name}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-3">
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

        {/* Professional Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Squad Size</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{normalizedSquad.length || groupedSquad.reduce((acc, group) => acc + group.members.length, 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Trophy className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Competitions</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{tablesArray.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Upcoming</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{fixturesData.filter((f: any) => !f.status?.finished && !f.notStarted).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <Target className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Recent</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{fixturesData.filter((f: any) => f.status?.finished).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Professional Tabs Layout */}
        <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
          <CardContent className="p-0">
            <Tabs defaultValue="overview" className="w-full">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 h-12 bg-transparent rounded-none p-0">
                  {teamData.tabs.map((tab) => (
                    <TabsTrigger 
                      key={tab} 
                      value={tab} 
                      className="capitalize text-sm font-medium data-[state=active]:bg-gray-100 data-[state=active]:dark:bg-gray-700 data-[state=active]:text-gray-900 data-[state=active]:dark:text-white text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-none border-b-2 data-[state=active]:border-blue-500 data-[state=inactive]:border-transparent"
                    >
                      {tab === 'overview' && <Star className="w-4 h-4 mr-2" />}
                      {tab === 'table' && <Trophy className="w-4 h-4 mr-2" />}
                      {tab === 'fixtures' && <Calendar className="w-4 h-4 mr-2" />}
                      {tab === 'squad' && <Users className="w-4 h-4 mr-2" />}
                      {tab === 'stats' && <Target className="w-4 h-4 mr-2" />}
                      <span className="hidden sm:inline">{tab}</span>
                      <span className="sm:hidden">{tab.charAt(0).toUpperCase()}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <TabsContent value="overview" className="mt-0 p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Team Details */}
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Award className="w-5 h-5 text-blue-600" />
                        Team Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Full Name</p>
                          <p className="font-semibold text-lg">{details?.name || 'N/A'}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Short Name</p>
                          <p className="font-semibold text-lg">{details?.shortName || 'N/A'}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Country</p>
                          <p className="font-semibold text-lg">{details?.country || 'N/A'}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Sport</p>
                          <p className="font-semibold text-lg capitalize">{sportsTeamJSONLD?.sport?.split("/")[0] || 'Football'}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Performance Overview */}
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Target className="w-5 h-5 text-green-600" />
                        Performance Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Competitions</p>
                          <p className="font-semibold text-lg">{tablesArray.length}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Squad Members</p>
                          <p className="font-semibold text-lg">{normalizedSquad.length || groupedSquad.reduce((acc, group) => acc + group.members.length, 0)}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Upcoming Fixtures</p>
                          <p className="font-semibold text-lg">{fixturesData.filter((f: any) => !f.status?.finished && !f.notStarted).length}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Recent Matches</p>
                          <p className="font-semibold text-lg">{fixturesData.filter((f: any) => f.status?.finished).length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* FAQ Section */}
                {details?.faqJSONLD?.mainEntity && details.faqJSONLD.mainEntity.length > 0 && (
                  <Card className="mt-6 hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-600" />
                        Frequently Asked Questions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {details.faqJSONLD.mainEntity.map((faq, index) => (
                          <div key={index} className="border-l-4 border-yellow-400 pl-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-r">
                            <h4 className="font-semibold mb-2">{faq.name}</h4>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{faq.acceptedAnswer.text}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
            </TabsContent>

              {/* Table Tab */}
              <TabsContent value="table" className="mt-0 p-6">
                <Card className="hover:shadow-md transition-shadow">
                {/* <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    League Table
                  </CardTitle>
                </CardHeader> */}
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
                <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    Fixtures & Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {fixturesData.length > 0 ? (
                    <div className="space-y-6">
                      {/* Recent/Upcoming Matches */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Recent & Upcoming Matches</h3>
                        <div className="space-y-2">
                          {fixturesData.slice(0, 10).map((fixture: any, index: number) => {
                            const isHome = fixture.home?.id === details?.id;
                            const opponent = isHome ? fixture.away : fixture.home;
                            const teamScore = isHome ? fixture.home?.score : fixture.away?.score;
                            const opponentScore = isHome ? fixture.away?.score : fixture.home?.score;
                            const matchDate = new Date(fixture.status?.utcTime || '');
                            const isFinished = fixture.status?.finished;
                            const isNotStarted = fixture.notStarted || (!fixture.status?.started && !fixture.status?.finished);
                            
                            return (
                              <Card key={fixture.id || index} className="hover:bg-muted/50 transition-colors">
                                <CardContent className="py-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                      <div className="w-16 text-xs text-muted-foreground">
                                        {matchDate ? format(matchDate, 'MMM dd') : 'TBD'}
                                      </div>
                                      <div className="flex items-center gap-3 min-w-[300px]">
                                        <div className="flex items-center gap-2">
                                          <Avatar className="w-6 h-6">
                                            <AvatarImage 
                                              src={`https://images.fotmob.com/image_resources/logo/teamlogo/${details?.id}.png`}
                                              alt="Team"
                                            />
                                            <AvatarFallback className="text-xs">T</AvatarFallback>
                                          </Avatar>
                                          <span className="text-sm font-medium">{details?.name}</span>
                                        </div>
                                        <div className="text-center mx-2">
                                          {isFinished ? (
                                            <div className="text-sm font-bold">
                                              {teamScore} - {opponentScore}
                                            </div>
                                          ) : isNotStarted ? (
                                            <div className="text-sm text-muted-foreground">vs</div>
                                          ) : (
                                            <div className="text-sm font-bold text-orange-600">
                                              {fixture.status?.scoreStr || 'LIVE'}
                                            </div>
                                          )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm font-medium">{opponent?.name}</span>
                                          <Avatar className="w-6 h-6">
                                            <AvatarImage 
                                              src={`https://images.fotmob.com/image_resources/logo/teamlogo/${opponent?.id}.png`}
                                              alt="Opponent"
                                            />
                                            <AvatarFallback className="text-xs">O</AvatarFallback>
                                          </Avatar>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className="text-xs">
                                        {fixture.tournament?.name || 'League'}
                                      </Badge>
                                      {isFinished ? (
                                        <Badge variant="secondary" className="text-xs">
                                          {fixture.status?.reason?.short || 'FT'}
                                        </Badge>
                                      ) : isNotStarted ? (
                                        <Badge variant="outline" className="text-xs">
                                          {matchDate ? format(matchDate, 'HH:mm') : 'TBD'}
                                        </Badge>
                                      ) : (
                                        <Badge variant="destructive" className="text-xs">
                                          LIVE
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                        {fixturesData.length > 10 && (
                          <div className="text-center mt-4">
                            <Badge variant="secondary">
                              Showing 10 of {fixturesData.length} matches
                            </Badge>
                          </div>
                        )}
                      </div>
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
                <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-500" />
                    Squad
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {groupedSquad.length > 0 || normalizedSquad.length > 0 ? (
                    <div className="space-y-6">
                      {/* Combined Squad Display */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Squad</h3>
                        
                        {/* Grouped Squad Display */}
                        {groupedSquad.length > 0 ? (
                          <div className="space-y-6">
                            {groupedSquad.map((group) => (
                              <div key={group.title} className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 capitalize">{group.title}</h4>
                                  <Badge variant="outline" className="text-xs">{group.members.length} players</Badge>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                  {group.members.map((player) => {
                                    if (!player) return null;
                                    return (
                                      <div key={String(player.id || player.name)} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                        <Avatar className="w-10 h-10">
                                          <AvatarImage src={player.photo} alt={`${player.name} photo`} />
                                          <AvatarFallback className="text-xs">{(player.name || '').split(' ').map((n: string) => n[0]).join('').toUpperCase() || '??'}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-medium truncate">{player.name}</p>
                                          <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="secondary" className="text-xs">{player.position}</Badge>
                                            {player.number && (
                                              <span className="text-xs text-gray-500 dark:text-gray-400">#{player.number}</span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          /* Fallback to table view for normalized squad */
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-16">#</TableHead>
                                  <TableHead className="min-w-[200px]">Player</TableHead>
                                  <TableHead>Position</TableHead>
                                  <TableHead className="text-center">Age</TableHead>
                                  <TableHead className="text-center">Nationality</TableHead>
                                  <TableHead className="text-center">Apps</TableHead>
                                  <TableHead className="text-center">Goals</TableHead>
                                  <TableHead className="text-center">Assists</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {normalizedSquad.map((player: any, index: number) => (
                                  <TableRow key={player.id || player.name || index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <TableCell className="font-medium">{player.number || index + 1}</TableCell>
                                    <TableCell>
                                      <div className="flex items-center gap-3">
                                        <Avatar className="w-8 h-8">
                                          <AvatarImage src={player.photo} alt={`${player.name} photo`} />
                                          <AvatarFallback className="text-xs">{(player.name || '').split(' ').map((n: string) => n[0]).join('').toUpperCase() || '??'}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <div className="font-semibold">{player.name}</div>
                                          {player.fullName && player.fullName !== player.name && (
                                            <div className="text-xs text-gray-500 dark:text-gray-400">{player.fullName}</div>
                                          )}
                                        </div>
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <Badge variant="secondary" className="text-xs">{player.position}</Badge>
                                    </TableCell>
                                    <TableCell className="text-center">{toText((player as any).age) || 'N/A'}</TableCell>
                                    <TableCell className="text-center">
                                      <div className="flex items-center justify-center gap-1">
                                        {player.nationality && (
                                          <img src={`https://images.fotmob.com/image_resources/logo/teamlogo/${String(player.nationality).toLowerCase()}.png`} alt={player.nationality} className="w-4 h-3 object-cover rounded-sm" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                        )}
                                        <span className="text-xs">{player.nationality || 'N/A'}</span>
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-center">{toText((player as any).appearances) || toText((player as any).apps) || toText((player as any).matches) || '-'}</TableCell>
                                    <TableCell className="text-center font-semibold text-green-600">{Number((player as any).goals) || 0}</TableCell>
                                    <TableCell className="text-center font-semibold text-blue-600">{Number((player as any).assists) || 0}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Squad Information</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Squad information for {details?.name} is not available in the current API response. 
                        This may be due to the off-season period, data privacy restrictions, or the team's squad data not being publicly accessible.
                      </p>
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
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
                <Card className="hover:shadow-md transition-shadow">
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
                  <Card className="hover:shadow-md transition-shadow">
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
    </div>
  );
}