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
            <Button variant="outline" className="gap-2" size="sm">
              <ExternalLink className="w-4 h-4" />
              Official Site
            </Button>
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
                  <div className="text-center py-12">
                    <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">League Table</h3>
                    <p className="text-muted-foreground mb-4">
                      League table information for {details?.name} will be displayed here.
                    </p>
                    <Badge variant="secondary" className="px-4 py-2">TABLE DATA</Badge>
                  </div>
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
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Match Fixtures</h3>
                    <p className="text-muted-foreground mb-4">
                      Upcoming fixtures and recent results for {details?.name} will be shown here.
                    </p>
                    <Badge variant="secondary" className="px-4 py-2">FIXTURES DATA</Badge>
                  </div>
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
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Team Squad</h3>
                    <p className="text-muted-foreground mb-4">
                      Complete squad information including players, positions, and stats.
                    </p>
                    <Badge variant="secondary" className="px-4 py-2">SQUAD DATA</Badge>
                  </div>
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
                  <div className="text-center py-12">
                    <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Team Statistics</h3>
                    <p className="text-muted-foreground mb-4">
                      Detailed performance statistics and analytics for {details?.name}.
                    </p>
                    <Badge variant="secondary" className="px-4 py-2">STATS DATA</Badge>
                  </div>
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