import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Users, Calendar, Trophy, ExternalLink, ArrowLeft, Star, Target, Award, TrendingUp, Activity, Clock, Shield, BarChart3, Flag, Building2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

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
    primaryLeagueId?: number;
    primaryLeagueName?: string;
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
  QAData?: Array<{
    question: string;
    answer: string;
  }>;
  table?: any[];
  fixtures?: {
    allFixtures: {
      fixtures: Array<{
        id: number;
        pageUrl: string;
        opponent: {
          id: number;
          name: string;
          score: number;
        };
        home: {
          id: number;
          name: string;
          score: number;
        };
        away: {
          id: number;
          name: string;
          score: number;
        };
        displayTournament: boolean;
        result: number;
        notStarted: boolean;
        tournament: {
          name: string;
          leagueId: number;
        };
        status: {
          utcTime: string;
          finished: boolean;
          started: boolean;
          cancelled: boolean;
          awarded: boolean;
          scoreStr: string;
          reason: {
            short: string;
            shortKey: string;
            long: string;
            longKey: string;
          };
        };
      }>;
    };
  };
  squad?: {
    squad?: Array<{
      title: string;
      members: Array<{
        id: number;
        name: string;
        shirtNumber?: number;
        ccode?: string;
        cname?: string;
        role?: any;
        positionId?: number;
        injury?: any;
        injured?: boolean;
        rating?: number;
        goals?: number;
        assists?: number;
        rcards?: number;
        ycards?: number;
        height?: number;
        age?: number;
        dateOfBirth?: string;
        transferValue?: number;
        positionIds?: string;
        positionIdsDesc?: string;
      }>;
    }>;
  };
  stats?: {
    players?: Array<{
      header: string;
      participant: {
        id: number;
        name: string;
        rank: number;
        ccode: string;
        teamId: number;
        teamName: string;
        value: number;
        stat: {
          name: string;
          value: number;
          format: string;
          fractions: number;
        };
      };
      topThree?: Array<{
        id: number;
        name: string;
        rank: number;
        ccode: string;
        value: number;
        stat: {
          name: string;
          value: number;
        };
      }>;
    }>;
  };
  transfers?: {
    type: string;
    data: {
      "Players in": Array<{
      name: string;
      playerId: number;
        position: {
        label: string;
        key: string;
      };
      transferDate: string;
        transferText: Array<string | number>;
      fromClub: string;
        fromClubId: number;
      toClub: string;
        toClubId: number;
        fee: {
          feeText: string;
          localizedFeeText: string;
          value: number;
        };
        transferType: {
        text: string;
          localizationKey: string;
        };
        contractExtension: boolean;
        onLoan: boolean;
        fromDate: string;
        toDate: string;
        marketValue: number;
      }>;
      "Players out": Array<{
        name: string;
        playerId: number;
        position: {
          label: string;
          key: string;
        };
        transferDate: string;
        transferText: Array<string | number>;
        fromClub: string;
        fromClubId: number;
        toClub: string;
        toClubId: number;
        fee: {
          feeText: string;
          localizedFeeText: string;
          value: number;
        };
        transferType: {
          text: string;
          localizationKey: string;
        };
        contractExtension: boolean;
        onLoan: boolean;
        fromDate: string;
        toDate: string;
        marketValue: number;
      }>;
    };
  };
  overview?: any;
  history?: {
    trophyList: Array<{
      name: string[];
      tournamentTemplateId: string[];
      area: string[];
      ccode: string[];
      won: string[];
      runnerup: string[];
      season_won: string[];
      season_runnerup: string[];
    }>;
    historicalTableData: {
      divisions: Array<{
        divisionRank: number;
        name: string;
        templateId: number;
      }>;
      ranks: Array<{
        stageId: number;
        tournamentName: string;
        tournamentId: number;
        templateId: number;
        seasonName: string;
        position: number;
        numberOfTeams: number;
        stats: {
          points: number;
          wins: number;
          draws: number;
          loss: number;
        };
        tableLink: string;
        isConsecutive: boolean;
      }>;
      isValid: boolean;
    };
    teamColorMap: {
      color: string;
      colorAlternate: string;
      colorAway: string;
      colorAwayAlternate: string;
    };
    tables: {
      current: Array<{
        link: Array<{
          _: string;
          name: string[];
          ccode: string[];
          season: string[];
          stage_id: string[];
          tournament_id: string[];
          template_id: string[];
          league_id: string[];
        }>;
      }>;
    };
  };
  [key: string]: any;
}

async function fetchTeamData(teamId: string): Promise<TeamData> {
  const response = await fetch(`/api/teams/${teamId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch team data");
  }
  return response.json();
}

// Helper function to get country flag
const getCountryFlag = (countryCode: string) => {
  if (!countryCode) return '';
  
  const codeMap: { [key: string]: string } = {
    'ENG': 'gb', 'SCO': 'gb', 'WAL': 'gb', 'NIR': 'gb',
    'ESP': 'es', 'FRA': 'fr', 'GER': 'de', 'ITA': 'it', 'POR': 'pt',
    'BRA': 'br', 'ARG': 'ar', 'NED': 'nl', 'BEL': 'be', 'SWE': 'se',
    'NOR': 'no', 'DEN': 'dk', 'USA': 'us', 'CAN': 'ca', 'JPN': 'jp',
    'URU': 'uy', 'UKR': 'ua', 'RUS': 'ru', 'POL': 'pl', 'CZE': 'cz',
    'CRO': 'hr', 'SER': 'rs', 'BOS': 'ba', 'MNE': 'me', 'MKD': 'mk',
    'ALB': 'al', 'BUL': 'bg', 'ROM': 'ro', 'HUN': 'hu', 'SVK': 'sk',
    'SLO': 'si', 'AUT': 'at', 'SUI': 'ch', 'GRE': 'gr', 'TUR': 'tr',
    'ISR': 'il', 'EGY': 'eg', 'MAR': 'ma', 'TUN': 'tn', 'ALG': 'dz',
    'LBY': 'ly', 'SUD': 'sd', 'ETH': 'et', 'KEN': 'ke', 'GHA': 'gh',
    'NGA': 'ng', 'SEN': 'sn', 'MLI': 'ml', 'BFA': 'bf', 'CIV': 'ci',
    'CMR': 'cm', 'COD': 'cd', 'UGA': 'ug', 'TAN': 'tz', 'ZAM': 'zm',
    'ZIM': 'zw', 'BOT': 'bw', 'NAM': 'na', 'ZAF': 'za', 'MAD': 'mg',
    'CHN': 'cn', 'KOR': 'kr', 'THA': 'th', 'VIE': 'vn', 'PHI': 'ph',
    'INA': 'id', 'MAS': 'my', 'SIN': 'sg', 'AUS': 'au', 'NZL': 'nz',
    'FIJ': 'fj', 'PNG': 'pg', 'SOL': 'sb', 'VAN': 'vu', 'TON': 'to',
    'SAM': 'ws', 'COK': 'ck', 'TAH': 'pf', 'NCL': 'nc', 'MEX': 'mx',
    'GUA': 'gt', 'HON': 'hn', 'SLV': 'sv', 'NIC': 'ni', 'CRC': 'cr',
    'PAN': 'pa', 'CUB': 'cu', 'JAM': 'jm', 'HAI': 'ht', 'DOM': 'do',
    'PUR': 'pr', 'TRI': 'tt', 'BAR': 'bb', 'VIN': 'vc', 'GRN': 'gd',
    'LCA': 'lc', 'DMA': 'dm', 'ANT': 'ag', 'SKN': 'kn', 'COL': 'co',
    'VEN': 've', 'GUY': 'gy', 'SUR': 'sr', 'ECU': 'ec', 'PER': 'pe',
    'BOL': 'bo', 'CHI': 'cl', 'PAR': 'py',
    // Handle full country names
    'England': 'gb', 'Spain': 'es', 'France': 'fr', 'Germany': 'de',
    'Italy': 'it', 'Portugal': 'pt', 'Brazil': 'br', 'Argentina': 'ar',
    'Netherlands': 'nl', 'Belgium': 'be', 'Sweden': 'se', 'Norway': 'no',
    'Denmark': 'dk', 'United States': 'us', 'Canada': 'ca', 'Japan': 'jp',
    'Uruguay': 'uy', 'Ukraine': 'ua', 'Russia': 'ru', 'Poland': 'pl',
    'Czech Republic': 'cz', 'Croatia': 'hr', 'Serbia': 'rs', 'Bosnia': 'ba',
    'Montenegro': 'me', 'North Macedonia': 'mk', 'Albania': 'al',
    'Bulgaria': 'bg', 'Romania': 'ro', 'Hungary': 'hu', 'Slovakia': 'sk',
    'Slovenia': 'si', 'Austria': 'at', 'Switzerland': 'ch', 'Greece': 'gr',
    'Turkey': 'tr', 'Israel': 'il', 'Egypt': 'eg', 'Morocco': 'ma',
    'Tunisia': 'tn', 'Algeria': 'dz', 'Libya': 'ly', 'Sudan': 'sd',
    'Ethiopia': 'et', 'Kenya': 'ke', 'Ghana': 'gh', 'Nigeria': 'ng',
    'Senegal': 'sn', 'Mali': 'ml', 'Burkina Faso': 'bf', 'Ivory Coast': 'ci',
    'Cameroon': 'cm', 'Democratic Republic of Congo': 'cd', 'Uganda': 'ug',
    'Tanzania': 'tz', 'Zambia': 'zm', 'Zimbabwe': 'zw', 'Botswana': 'bw',
    'Namibia': 'na', 'South Africa': 'za', 'Madagascar': 'mg',
    'China': 'cn', 'South Korea': 'kr', 'Thailand': 'th', 'Vietnam': 'vn',
    'Philippines': 'ph', 'Indonesia': 'id', 'Malaysia': 'my', 'Singapore': 'sg',
    'Australia': 'au', 'New Zealand': 'nz', 'Fiji': 'fj', 'Papua New Guinea': 'pg',
    'Solomon Islands': 'sb', 'Vanuatu': 'vu', 'Tonga': 'to', 'Samoa': 'ws',
    'Cook Islands': 'ck', 'Tahiti': 'pf', 'New Caledonia': 'nc', 'Mexico': 'mx',
    'Guatemala': 'gt', 'Honduras': 'hn', 'El Salvador': 'sv', 'Nicaragua': 'ni',
    'Costa Rica': 'cr', 'Panama': 'pa', 'Cuba': 'cu', 'Jamaica': 'jm',
    'Haiti': 'ht', 'Dominican Republic': 'do', 'Puerto Rico': 'pr',
    'Trinidad and Tobago': 'tt', 'Barbados': 'bb', 'Saint Vincent': 'vc',
    'Grenada': 'gd', 'Saint Lucia': 'lc', 'Dominica': 'dm', 'Antigua': 'ag',
    'Saint Kitts': 'kn', 'Colombia': 'co', 'Venezuela': 've', 'Guyana': 'gy',
    'Suriname': 'sr', 'Ecuador': 'ec', 'Peru': 'pe', 'Bolivia': 'bo',
    'Chile': 'cl', 'Paraguay': 'py'
  };
  
  const flagCode = codeMap[countryCode] || (countryCode.length === 2 ? countryCode : countryCode.slice(0, 2));
  
  // Use IPRegistry CDN for high quality SVG flags
  return `https://cdn.ipregistry.co/flags/wikimedia/${flagCode.toLowerCase()}.svg`;
};

// Helper function to format currency
const formatCurrency = (value?: number) => {
  if (!value) return 'N/A';
  if (value >= 1000000) return `€${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `€${(value / 1000).toFixed(0)}K`;
  return `€${value}`;
};

// Professional color palette
const COLORS = {
  primary: '#1f2937',
  secondary: '#6b7280', 
  accent: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  neutral: '#f3f4f6'
};

export default function Team() {
  const [, params] = useRoute("/team/:id");
  const id = params?.id;

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

  const navigateToTeam = (teamId: number) => {
    window.location.href = `/team/${teamId}`;
  };

  const navigateToMatch = (matchId: number) => {
    window.location.href = `/match/${matchId}`;
  };

  const navigateToPlayer = (playerId: number) => {
    window.location.href = `/player/${playerId}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !teamData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md border-gray-200">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">Failed to load team data. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { details, sportsTeamJSONLD } = teamData;
  const stadium = sportsTeamJSONLD?.location;
  const league = sportsTeamJSONLD?.memberOf;

  // Extract stadium information from FAQ
  const stadiumInfo = details?.faqJSONLD?.mainEntity?.find(q => q.name.includes("stadium"));
  const capacityInfo = details?.faqJSONLD?.mainEntity?.find(q => q.name.includes("capacity"));
  const openedInfo = details?.faqJSONLD?.mainEntity?.find(q => q.name.includes("opened"));
  const nextMatchInfo = details?.faqJSONLD?.mainEntity?.find(q => q.name.includes("next match"));

  // Process squad data
  const squadGroups = teamData.squad?.squad || [];
  const allPlayers = squadGroups.flatMap(group => 
    group.members?.map(player => ({
      ...player,
      groupTitle: group.title,
      position: player.positionIdsDesc || player.role?.fallback || 'Unknown'
    })) || []
  );

  // Process table data
  const tablesArray = Array.isArray(teamData.table) ? teamData.table : [];
  const mainTable = tablesArray.find(t => t?.data?.leagueName?.includes('Premier League')) || tablesArray[0];
  
  // Process stats data
  const topScorer = teamData.stats?.players?.find(p => p.header.includes('scorer'));
  const topAssister = teamData.stats?.players?.find(p => p.header.includes('Assists'));
  const topStats = teamData.stats?.players?.slice(0, 5) || [];

  // Process transfers
  const playersIn = teamData.transfers?.data?.["Players in"] || [];
  const playersOut = teamData.transfers?.data?.["Players out"] || [];
  const allTransfers = [...playersIn, ...playersOut].sort((a, b) => 
    new Date(b.transferDate).getTime() - new Date(a.transferDate).getTime()
  );

  // Prepare chart data
  const performanceData = mainTable?.data?.table?.all ? 
    mainTable.data.table.all.find((t: any) => t.id === details.id) : null;

  const chartData = performanceData ? [
    { name: 'Wins', value: performanceData.wins, color: '#22c55e' },
    { name: 'Draws', value: performanceData.draws, color: '#6b7280' },
    { name: 'Losses', value: performanceData.losses, color: '#ef4444' }
  ] : [];

  // Filter stats by category for cleaner charts
  const goalStats = topStats.filter(stat => stat.header.toLowerCase().includes('scorer') || stat.header.toLowerCase().includes('goals'));
  const assistStats = topStats.filter(stat => stat.header.toLowerCase().includes('assist'));
  
  const statsChartData = (goalStats.length > 0 ? goalStats : topStats).slice(0, 5).map(stat => ({
    name: stat.participant.name.split(' ').pop(), // Last name only
    value: stat.participant.value,
    fullName: stat.participant.name,
    stat: stat.header
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={goBack} 
            className="gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

        {/* Minimalist Header Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <div className="flex items-start gap-6">
              <div className="relative">
                <Avatar className="w-20 h-20 border border-gray-200">
                  <AvatarImage 
                    src={`https://images.fotmob.com/image_resources/logo/teamlogo/${details?.id}.png`}
                    alt={`${details?.name} logo`}
                    className="object-contain p-2"
                  />
                  <AvatarFallback className="text-xl font-bold bg-gray-100 text-gray-700">
                    {details?.shortName?.substring(0, 2).toUpperCase() || 'TM'}
                  </AvatarFallback>
                </Avatar>
                {details?.country && (
                  <img 
                    src={getCountryFlag(details.country)} 
                    alt={details.country}
                    className="absolute -bottom-1 -right-1 w-8 h-6 rounded-sm border border-white shadow-sm"
                  />
                )}
              </div>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  {details?.name || 'Team'}
                </h1>
                
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Badge variant="outline" className="text-sm text-gray-700 border-gray-300">
                    {details?.country || 'N/A'}
                  </Badge>
                  <Badge variant="outline" className="text-sm text-gray-700 border-gray-300">
                    {details?.latestSeason || 'Current Season'}
                  </Badge>
                  {openedInfo?.acceptedAnswer.text.match(/(\d{4})/)?.[1] && (
                    <Badge variant="outline" className="text-sm text-gray-700 border-gray-300">
                      Est. {openedInfo.acceptedAnswer.text.match(/(\d{4})/)?.[1]}
                    </Badge>
                  )}
                </div>

                {/* Stadium & League Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  {stadium && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{stadium.name}</p>
                        <p>{stadium.address?.addressLocality}, {stadium.address?.addressCountry}</p>
                        {capacityInfo && (
                          <p>Capacity: {capacityInfo.acceptedAnswer.text.match(/(\d{1,3}(?:,?\d{3})*)/) ? capacityInfo.acceptedAnswer.text.match(/(\d{1,3}(?:,?\d{3})*)/)?.[1] : 'N/A'}</p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {league && (
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{league.name}</p>
                        {mainTable?.data?.table?.all && (
                          <p>Position: #{mainTable.data.table.all.find((t: any) => t.id === details.id)?.idx || 'N/A'}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Next Match Info */}
                {nextMatchInfo && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border-l-3 border-blue-400">
                    <p className="text-sm font-medium text-blue-900 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Next Match
                    </p>
                    <p className="text-sm text-blue-800 mt-1">
                      {nextMatchInfo.acceptedAnswer.text}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-3">
              {sportsTeamJSONLD?.url && (
                <Button 
                  variant="outline" 
                  className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50" 
                  size="sm"
                  onClick={() => window.open(sportsTeamJSONLD.url, '_blank')}
                >
                  <ExternalLink className="w-4 h-4" />
                  Official Site
                </Button>
              )}
              <Button className="gap-2 bg-gray-900 hover:bg-gray-800" size="sm">
                <Star className="w-4 h-4" />
                Follow
              </Button>
            </div>
          </div>
        </div>

        {/* Minimalist Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="text-center">
                <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{allPlayers.length}</p>
                <p className="text-sm text-gray-600">Squad Size</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="text-center">
                <Target className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{topScorer?.participant?.value || 0}</p>
                <p className="text-sm text-gray-600">Top Goals</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="text-center">
                <Activity className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{topAssister?.participant?.value || 0}</p>
                <p className="text-sm text-gray-600">Top Assists</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="text-center">
                <Trophy className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">
                  #{mainTable?.data?.table?.all?.find((t: any) => t.id === details.id)?.idx || 'N/A'}
                </p>
                <p className="text-sm text-gray-600">League Position</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Minimalist Tabs */}
        <Card className="border-gray-200">
          <CardContent className="p-0">
            <Tabs defaultValue="overview" className="w-full">
              <div className="border-b border-gray-200 bg-white">
                <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 h-12 bg-transparent rounded-none p-0">
                  {teamData.tabs.map((tab) => (
                    <TabsTrigger 
                      key={tab} 
                      value={tab} 
                      className="capitalize text-sm font-medium data-[state=active]:bg-gray-50 data-[state=active]:text-gray-900 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors rounded-none border-b-2 data-[state=active]:border-gray-900 data-[state=inactive]:border-transparent"
                    >
                      {tab === 'overview' && <Star className="w-4 h-4 mr-2" />}
                      {tab === 'table' && <BarChart3 className="w-4 h-4 mr-2" />}
                      {tab === 'fixtures' && <Calendar className="w-4 h-4 mr-2" />}
                      {tab === 'squad' && <Users className="w-4 h-4 mr-2" />}
                      {tab === 'stats' && <TrendingUp className="w-4 h-4 mr-2" />}
                      {tab === 'transfers' && <Activity className="w-4 h-4 mr-2" />}
                      {tab === 'history' && <Trophy className="w-4 h-4 mr-2" />}
                      <span className="hidden sm:inline">{tab}</span>
                      <span className="sm:hidden">{tab.charAt(0).toUpperCase()}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <TabsContent value="overview" className="mt-0 p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Performance Chart */}
                  <Card className="border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-lg text-gray-900">Season Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {chartData.length > 0 ? (
                        <div className="space-y-4">
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                              <XAxis 
                                dataKey="name" 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#6b7280' }}
                              />
                              <YAxis 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#6b7280' }}
                              />
                              <Tooltip 
                                contentStyle={{
                                  backgroundColor: '#ffffff',
                                  border: '1px solid #e5e7eb',
                                  borderRadius: '8px',
                                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                              />
                              <Bar 
                              dataKey="value"
                                radius={[4, 4, 0, 0]}
                                fill="#3b82f6"
                              />
                            </BarChart>
                        </ResponsiveContainer>
                          
                          {/* Performance Summary */}
                          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                            {chartData.map((item, index) => (
                              <div key={index} className="text-center">
                                <div className="text-2xl font-bold text-gray-900">{item.value}</div>
                                <div className="text-sm text-gray-600">{item.name}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="h-48 flex items-center justify-center text-gray-500">
                          No performance data available
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Top Players with Photos */}
                  <Card className="border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-lg text-gray-900">Top Performers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {topStats.slice(0, 3).map((stat, index) => (
                          <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
                            <Avatar className="w-12 h-12 border border-gray-200">
                              <AvatarImage 
                                src={`https://images.fotmob.com/image_resources/playerimages/${stat.participant.id}.png`}
                                alt={stat.participant.name}
                              />
                              <AvatarFallback className="text-sm bg-gray-200 text-gray-700">
                                {stat.participant.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p 
                                  className="font-medium text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
                                  onClick={() => navigateToPlayer(stat.participant.id)}
                                >
                                  {stat.participant.name}
                                </p>
                                {stat.participant.ccode && (
                                <img 
                                  src={getCountryFlag(stat.participant.ccode)} 
                                  alt={stat.participant.ccode}
                                    className="w-6 h-4 rounded-sm"
                                />
                                )}
                              </div>
                              <p className="text-sm text-gray-600">{stat.header}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-gray-900">{stat.participant.value}</p>
                              <p className="text-xs text-gray-500">Rank #{stat.participant.rank}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* FAQ Section */}
                {teamData.QAData && teamData.QAData.length > 0 && (
                  <Card className="mt-6 border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-lg text-gray-900">Team Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {teamData.QAData.map((faq, index) => (
                          <div key={index} className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-semibold mb-2 text-gray-900">{faq.question}</h4>
                            <p className="text-gray-700 text-sm">{faq.answer}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Professional Squad Table */}
              <TabsContent value="squad" className="mt-0 p-6">
                <Card className="border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900">Squad ({allPlayers.length} players)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-gray-200">
                            <TableHead className="w-16 text-gray-700">#</TableHead>
                            <TableHead className="text-gray-700">Player</TableHead>
                            <TableHead className="text-gray-700">Position</TableHead>
                            <TableHead className="text-gray-700">Age</TableHead>
                            <TableHead className="text-gray-700">Nationality</TableHead>
                            <TableHead className="text-gray-700">Value</TableHead>
                            <TableHead className="text-center text-gray-700">Stats</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {allPlayers.map((player, index) => (
                            <TableRow key={index} className="border-gray-100 hover:bg-gray-50">
                              <TableCell className="font-mono text-gray-600">
                                {player.shirtNumber || '-'}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="w-10 h-10 border border-gray-200">
                                    <AvatarImage 
                                      src={`https://images.fotmob.com/image_resources/playerimages/${player.id}.png`}
                                      alt={player.name}
                                    />
                                    <AvatarFallback className="text-xs bg-gray-100 text-gray-700">
                                      {player.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p 
                                      className="font-medium text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
                                      onClick={() => navigateToPlayer(player.id)}
                                    >
                                      {player.name}
                                    </p>
                                    {player.injured && (
                                      <Badge variant="destructive" className="text-xs mt-1">Injured</Badge>
                                    )}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-xs border-gray-300 text-gray-700">
                                  {player.position}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-gray-700">{player.age || '-'}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {player.ccode && (
                                    <img 
                                      src={getCountryFlag(player.ccode)} 
                                      alt={player.cname || player.ccode}
                                      className="w-6 h-4 rounded-sm object-cover"
                                      onError={(e) => {
                                        // Fallback to flagcdn if IPRegistry fails
                                        const target = e.target as HTMLImageElement;
                                        const countryCode = player.ccode?.toLowerCase();
                                        if (countryCode && !target.src.includes('flagcdn.com')) {
                                          target.src = `https://flagcdn.com/20x15/${countryCode}.png`;
                                        }
                                      }}
                                    />
                                  )}
                                  <span className="text-gray-700">{player.cname || player.ccode || '-'}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-gray-700">
                                {formatCurrency(player.transferValue)}
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2 text-xs">
                                  {player.goals !== undefined && (
                                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded border">
                                      G: {player.goals}
                                    </span>
                                  )}
                                  {player.assists !== undefined && (
                                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded border">
                                      A: {player.assists}
                                    </span>
                                  )}
                                  {player.rating && (
                                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded border">
                                      {player.rating.toFixed(1)}
                                    </span>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Stats with Charts */}
              <TabsContent value="stats" className="mt-0 p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Player Performance Chart */}
                  <Card className="border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-lg text-gray-900">Top Player Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {statsChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={statsChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                            <XAxis 
                              dataKey="name" 
                              tick={{ fill: '#6b7280', fontSize: 12 }}
                              axisLine={{ stroke: '#e5e7eb' }}
                            />
                            <YAxis 
                              tick={{ fill: '#6b7280', fontSize: 12 }}
                              axisLine={{ stroke: '#e5e7eb' }}
                            />
                            <Tooltip 
                              contentStyle={{
                                backgroundColor: 'white',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px'
                              }}
                              formatter={(value, name, props) => [
                                value,
                                props.payload?.fullName
                              ]}
                            />
                            <Bar dataKey="value" fill="#374151" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-72 flex items-center justify-center text-gray-500">
                          No performance data available
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Individual Player Stats */}
                  <Card className="border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-lg text-gray-900">Individual Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {topStats.map((stat, index) => (
                          <div key={index}>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <Avatar className="w-8 h-8 border border-gray-200">
                                  <AvatarImage 
                                    src={`https://images.fotmob.com/image_resources/playerimages/${stat.participant.id}.png`}
                                    alt={stat.participant.name}
                                  />
                                  <AvatarFallback className="text-xs bg-gray-100 text-gray-700">
                                    {stat.participant.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p 
                                    className="font-medium text-sm text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
                                    onClick={() => navigateToPlayer(stat.participant.id)}
                                  >
                                    {stat.participant.name}
                                  </p>
                                  <p className="text-xs text-gray-600">{stat.header}</p>
                                </div>
                                {stat.participant.ccode && (
                                <img 
                                  src={getCountryFlag(stat.participant.ccode)} 
                                  alt={stat.participant.ccode}
                                    className="w-6 h-4 rounded-sm"
                                />
                                )}
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-gray-900">{stat.participant.value}</p>
                                <p className="text-xs text-gray-500">#{stat.participant.rank}</p>
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gray-700 h-2 rounded-full" 
                                style={{ width: `${Math.min(100, (stat.participant.value / Math.max(...topStats.map(s => s.participant.value))) * 100)}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Table Tab */}
              <TabsContent value="table" className="mt-0 p-6">
                {tablesArray.map((tableData, index) => (
                  <Card key={index} className="mb-6 border-gray-200">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="text-gray-900">{tableData.data.leagueName}</span>
                        <Badge variant="outline" className="border-gray-300 text-gray-700">{tableData.data.ccode}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {tableData.data.table?.all && (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow className="border-gray-200">
                                <TableHead className="w-12 text-gray-700">#</TableHead>
                                <TableHead className="text-gray-700">Team</TableHead>
                                <TableHead className="text-center w-12 text-gray-700">P</TableHead>
                                <TableHead className="text-center w-12 text-gray-700">W</TableHead>
                                <TableHead className="text-center w-12 text-gray-700">D</TableHead>
                                <TableHead className="text-center w-12 text-gray-700">L</TableHead>
                                <TableHead className="text-center w-16 text-gray-700">GD</TableHead>
                                <TableHead className="text-center w-12 text-gray-700">Pts</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {tableData.data.table.all.map((team: any, teamIndex: number) => (
                                <TableRow 
                                  key={teamIndex} 
                                  className={`border-gray-100 ${team.id === details.id ? 'bg-blue-50 font-semibold' : 'hover:bg-gray-50'}`}
                                >
                                  <TableCell className="font-medium text-gray-900">
                                    <div className="flex items-center gap-2">
                                      {team.qualColor && (
                                        <div 
                                          className="w-2 h-2 rounded-full" 
                                          style={{ backgroundColor: team.qualColor }}
                                        />
                                      )}
                                      {team.idx}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div 
                                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors"
                                      onClick={() => navigateToTeam(team.id)}
                                    >
                                      <Avatar className="w-6 h-6 border border-gray-200">
                                        <AvatarImage 
                                          src={`https://images.fotmob.com/image_resources/logo/teamlogo/${team.id}.png`}
                                          alt={team.name}
                                        />
                                        <AvatarFallback className="text-xs bg-gray-100 text-gray-700">
                                          {team.shortName?.slice(0, 2) || team.name?.slice(0, 2)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span className="truncate text-gray-900 hover:text-blue-600 transition-colors">{team.name}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-center text-gray-700">{team.played}</TableCell>
                                  <TableCell className="text-center text-gray-700">{team.wins}</TableCell>
                                  <TableCell className="text-center text-gray-700">{team.draws}</TableCell>
                                  <TableCell className="text-center text-gray-700">{team.losses}</TableCell>
                                  <TableCell className={`text-center font-medium ${team.goalConDiff >= 0 ? 'text-gray-900' : 'text-gray-700'}`}>
                                    {team.goalConDiff >= 0 ? '+' : ''}{team.goalConDiff}
                                  </TableCell>
                                  <TableCell className="text-center font-bold text-gray-900">{team.pts}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                          
                          {/* Legend */}
                          {tableData.data.legend && (
                            <div className="mt-4 flex flex-wrap gap-3">
                              {tableData.data.legend.map((item: any, legendIndex: number) => (
                                <div key={legendIndex} className="flex items-center gap-2 text-xs text-gray-600">
                                  <div 
                                    className="w-3 h-3 rounded-full" 
                                    style={{ backgroundColor: item.color }}
                                  />
                                  <span>{item.title}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* Transfers Tab */}
              <TabsContent value="transfers" className="mt-0 p-6">
                <Card className="border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Transfer Activity
                      <div className="ml-auto flex gap-2">
                        {playersIn.length > 0 && (
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                            {playersIn.length} In
                          </Badge>
                        )}
                        {playersOut.length > 0 && (
                          <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                            {playersOut.length} Out
                          </Badge>
                        )}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {allTransfers.length > 0 ? (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-gray-200">
                              <TableHead className="w-[200px] font-semibold text-gray-700">Player</TableHead>
                              <TableHead className="w-[120px] font-semibold text-gray-700">Position</TableHead>
                              <TableHead className="w-[200px] font-semibold text-gray-700">From Club</TableHead>
                              <TableHead className="w-[50px] font-semibold text-gray-700"></TableHead>
                              <TableHead className="w-[200px] font-semibold text-gray-700">To Club</TableHead>
                              <TableHead className="w-[100px] font-semibold text-gray-700">Type</TableHead>
                              <TableHead className="w-[120px] font-semibold text-gray-700">Fee</TableHead>
                              <TableHead className="w-[120px] font-semibold text-gray-700">Market Value</TableHead>
                              <TableHead className="w-[100px] font-semibold text-gray-700">Date</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {allTransfers.map((transfer, index) => {
                              const isIncoming = playersIn.includes(transfer);
                              return (
                                <TableRow key={index} className="border-gray-100 hover:bg-gray-50 transition-colors">
                                  {/* Player Name */}
                                  <TableCell className="font-medium text-gray-900">
                                    <div className="flex items-center gap-3">
                                      <div className={`w-2 h-2 rounded-full ${isIncoming ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                      <span className="truncate">{transfer.name}</span>
                                    </div>
                                  </TableCell>

                                  {/* Position */}
                                  <TableCell>
                                    {transfer.position ? (
                                    <Badge variant="outline" className="text-xs border-gray-300 text-gray-700">
                                      {transfer.position.label}
                                    </Badge>
                                    ) : (
                                      <span className="text-gray-400 text-xs">-</span>
                                    )}
                                  </TableCell>

                                  {/* From Club */}
                                  <TableCell>
                                    <div 
                                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors"
                                      onClick={() => navigateToTeam(transfer.fromClubId)}
                                    >
                                      <Avatar className="w-6 h-6 rounded-sm">
                                        <AvatarImage 
                                          src={`https://images.fotmob.com/image_resources/logo/teamlogo/${transfer.fromClubId}.png`}
                                          alt={transfer.fromClub}
                                        />
                                        <AvatarFallback className="text-xs font-semibold bg-gray-100">
                                          {transfer.fromClub.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span className="text-sm text-gray-700 truncate hover:text-blue-600 transition-colors">{transfer.fromClub}</span>
                                </div>
                                  </TableCell>

                                  {/* Arrow */}
                                  <TableCell className="text-center">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isIncoming ? 'bg-green-100' : 'bg-red-100'}`}>
                                      <svg 
                                        className={`w-3 h-3 ${isIncoming ? 'text-green-600' : 'text-red-600'}`} 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                      >
                                        <path 
                                          strokeLinecap="round" 
                                          strokeLinejoin="round" 
                                          strokeWidth={2} 
                                          d={isIncoming ? "M13 7l5 5m0 0l-5 5m5-5H6" : "M11 17l-5-5m0 0l5-5m-5 5h12"} 
                                        />
                                      </svg>
                                    </div>
                                  </TableCell>

                                  {/* To Club */}
                                  <TableCell>
                                    <div 
                                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors"
                                      onClick={() => navigateToTeam(transfer.toClubId)}
                                    >
                                      <Avatar className="w-6 h-6 rounded-sm">
                                        <AvatarImage 
                                          src={`https://images.fotmob.com/image_resources/logo/teamlogo/${transfer.toClubId}.png`}
                                          alt={transfer.toClub}
                                        />
                                        <AvatarFallback className="text-xs font-semibold bg-gray-100">
                                          {transfer.toClub.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span className="text-sm text-gray-700 truncate hover:text-blue-600 transition-colors">{transfer.toClub}</span>
                                    </div>
                                  </TableCell>

                                  {/* Transfer Type */}
                                  <TableCell>
                                    {transfer.transferType ? (
                                      <Badge 
                                        variant={transfer.onLoan ? "secondary" : "default"}
                                        className={`text-xs ${transfer.onLoan ? 'bg-orange-100 text-orange-700 border-orange-200' : 'bg-blue-100 text-blue-700 border-blue-200'}`}
                                      >
                                      {transfer.transferType.text}
                                    </Badge>
                                    ) : (
                                      <span className="text-gray-400 text-xs">-</span>
                                    )}
                                  </TableCell>

                                  {/* Fee */}
                                  <TableCell className="text-right">
                                    <div className="font-medium text-gray-900">
                                      {transfer.fee && transfer.fee.value > 0 ? formatCurrency(transfer.fee.value) : 'Free'}
                                </div>
                                  </TableCell>

                                  {/* Market Value */}
                                  <TableCell className="text-right">
                                    <div className="text-sm text-gray-600">
                                      {transfer.marketValue ? formatCurrency(transfer.marketValue) : 'N/A'}
                              </div>
                                  </TableCell>

                                  {/* Date */}
                                  <TableCell>
                                    <div className="text-xs text-gray-500">
                                      {new Date(transfer.transferDate).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                      })}
                              </div>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <Activity className="w-16 h-16 mx-auto mb-4 opacity-30" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Transfer Activity</h3>
                        <p className="text-sm">No transfer data available for this team</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Fixtures Tab */}
              <TabsContent value="fixtures" className="mt-0 p-6">
                <Card className="border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Fixtures & Results
                      {teamData.fixtures?.allFixtures?.fixtures && (
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                          {teamData.fixtures.allFixtures.fixtures.length} matches
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {teamData.fixtures?.allFixtures?.fixtures && teamData.fixtures.allFixtures.fixtures.length > 0 ? (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-gray-200">
                              <TableHead className="w-[120px] font-semibold text-gray-700">Date</TableHead>
                              <TableHead className="w-[200px] font-semibold text-gray-700">Home Team</TableHead>
                              <TableHead className="w-[80px] font-semibold text-gray-700 text-center">Score</TableHead>
                              <TableHead className="w-[200px] font-semibold text-gray-700">Away Team</TableHead>
                              <TableHead className="w-[120px] font-semibold text-gray-700">Competition</TableHead>
                              <TableHead className="w-[80px] font-semibold text-gray-700">Status</TableHead>
                              <TableHead className="w-[60px] font-semibold text-gray-700">Result</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {teamData.fixtures.allFixtures.fixtures.map((fixture, index) => {
                              const isHomeTeam = fixture.home.id === details.id;
                              const teamScore = isHomeTeam ? fixture.home.score : fixture.away.score;
                              const opponentScore = isHomeTeam ? fixture.away.score : fixture.home.score;
                              const opponent = isHomeTeam ? fixture.away : fixture.home;
                              const opponentTeam = isHomeTeam ? fixture.away : fixture.home;
                              
                              let resultColor = 'text-gray-500';
                              let resultText = '-';
                              let resultBg = 'bg-gray-50';
                              
                              if (fixture.status?.finished) {
                                if (teamScore > opponentScore) {
                                  resultColor = 'text-green-600';
                                  resultText = 'W';
                                  resultBg = 'bg-green-50';
                                } else if (teamScore < opponentScore) {
                                  resultColor = 'text-red-600';
                                  resultText = 'L';
                                  resultBg = 'bg-red-50';
                                } else {
                                  resultColor = 'text-yellow-600';
                                  resultText = 'D';
                                  resultBg = 'bg-yellow-50';
                                }
                              } else if (fixture.status?.started) {
                                resultColor = 'text-blue-600';
                                resultText = 'LIVE';
                                resultBg = 'bg-blue-50';
                              }

                              return (
                                <TableRow 
                                  key={index} 
                                  className="border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                                  onClick={() => navigateToMatch(fixture.id)}
                                >
                                  {/* Date */}
                                  <TableCell>
                                    <div className="text-sm text-gray-600">
                                      {fixture.status?.utcTime ? new Date(fixture.status.utcTime).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric'
                                      }) : 'TBD'}
                              </div>
                                    <div className="text-xs text-gray-500">
                                      {fixture.status?.utcTime ? new Date(fixture.status.utcTime).toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      }) : ''}
                            </div>
                                  </TableCell>

                                  {/* Home Team */}
                                  <TableCell>
                                    <div 
                                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        navigateToTeam(fixture.home.id);
                                      }}
                                    >
                                      <Avatar className="w-6 h-6 rounded-sm">
                                        <AvatarImage 
                                          src={`https://images.fotmob.com/image_resources/logo/teamlogo/${fixture.home.id}.png`}
                                          alt={fixture.home.name}
                                        />
                                        <AvatarFallback className="text-xs font-semibold bg-gray-100">
                                          {fixture.home.name.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span className="text-sm text-gray-700 truncate hover:text-blue-600 transition-colors">
                                        {fixture.home.name}
                                      </span>
                          </div>
                                  </TableCell>

                                  {/* Score */}
                                  <TableCell className="text-center">
                                    <div className="font-bold text-gray-900">
                                      {fixture.status?.scoreStr || '-'}
                                    </div>
                                  </TableCell>

                                  {/* Away Team */}
                                  <TableCell>
                                    <div 
                                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        navigateToTeam(fixture.away.id);
                                      }}
                                    >
                                      <Avatar className="w-6 h-6 rounded-sm">
                                        <AvatarImage 
                                          src={`https://images.fotmob.com/image_resources/logo/teamlogo/${fixture.away.id}.png`}
                                          alt={fixture.away.name}
                                        />
                                        <AvatarFallback className="text-xs font-semibold bg-gray-100">
                                          {fixture.away.name.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span className="text-sm text-gray-700 truncate hover:text-blue-600 transition-colors">
                                        {fixture.away.name}
                                      </span>
                                    </div>
                                  </TableCell>

                                  {/* Competition */}
                                  <TableCell>
                                    <Badge variant="outline" className="text-xs border-gray-300 text-gray-700">
                                      {fixture.tournament?.name || 'Unknown'}
                                    </Badge>
                                  </TableCell>

                                  {/* Status */}
                                  <TableCell>
                                    <Badge 
                                      variant="outline" 
                                      className={`text-xs ${
                                        fixture.status?.finished 
                                          ? 'bg-gray-100 text-gray-700 border-gray-300' 
                                          : fixture.status?.started 
                                          ? 'bg-blue-100 text-blue-700 border-blue-300' 
                                          : 'bg-yellow-100 text-yellow-700 border-yellow-300'
                                      }`}
                                    >
                                      {fixture.status.reason?.short || 'TBD'}
                                    </Badge>
                                  </TableCell>

                                  {/* Result */}
                                  <TableCell>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${resultBg} ${resultColor}`}>
                                      {resultText}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <Calendar className="w-16 h-16 mx-auto mb-4 opacity-30" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Fixtures Available</h3>
                        <p className="text-sm">No fixture data available for this team</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* History Tab */}
              <TabsContent value="history" className="mt-0 p-6">
                <div className="space-y-6">
                  {/* Trophy List */}
                  {teamData.history?.trophyList && teamData.history.trophyList.length > 0 && (
                <Card className="border-gray-200">
                  <CardHeader>
                        <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                          <Trophy className="w-5 h-5" />
                          Trophy History
                          <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                            {teamData.history.trophyList.length} competitions
                          </Badge>
                        </CardTitle>
                  </CardHeader>
                  <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {teamData.history.trophyList.map((trophy, index) => {
                            const wonCount = parseInt(trophy.won[0]) || 0;
                            const runnerUpCount = parseInt(trophy.runnerup[0]) || 0;
                            const totalTrophies = wonCount + runnerUpCount;
                            
                            return (
                              <div key={index} className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 text-sm">{trophy.name[0]}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant="outline" className="text-xs border-gray-300 text-gray-700">
                                        {trophy.area[0]}
                                      </Badge>
                                      <Badge variant="outline" className="text-xs border-gray-300 text-gray-700">
                                        {trophy.ccode[0]}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-2xl font-bold text-yellow-600">{wonCount}</div>
                                    <div className="text-xs text-gray-600">Wins</div>
                                  </div>
                                </div>
                                
                                <div className="space-y-2">
                                  <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-600">Total Trophies:</span>
                                    <span className="font-medium text-gray-900">{totalTrophies}</span>
                                  </div>
                                  {runnerUpCount > 0 && (
                                    <div className="flex justify-between items-center text-xs">
                                      <span className="text-gray-600">Runner-up:</span>
                                      <span className="font-medium text-gray-700">{runnerUpCount}</span>
                                    </div>
                                  )}
                                </div>
                                
                                {trophy.season_won[0] && (
                                  <div className="mt-3 pt-3 border-t border-yellow-200">
                                    <div className="text-xs text-gray-600 mb-1">Recent Wins:</div>
                                    <div className="text-xs text-gray-700 line-clamp-2">
                                      {trophy.season_won[0].split(',').slice(0, 3).join(', ')}
                                      {trophy.season_won[0].split(',').length > 3 && '...'}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                    </div>
                  </CardContent>
                </Card>
                  )}

                  {/* Historical Table Data */}
                  {teamData.history?.historicalTableData?.ranks && teamData.history.historicalTableData.ranks.length > 0 && (
                    <Card className="border-gray-200">
                      <CardHeader>
                        <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                          <BarChart3 className="w-5 h-5" />
                          League History
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                            {teamData.history.historicalTableData.ranks.length} seasons
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow className="border-gray-200">
                                <TableHead className="w-[120px] font-semibold text-gray-700">Season</TableHead>
                                <TableHead className="w-[100px] font-semibold text-gray-700">Position</TableHead>
                                <TableHead className="w-[80px] font-semibold text-gray-700">Points</TableHead>
                                <TableHead className="w-[60px] font-semibold text-gray-700">W</TableHead>
                                <TableHead className="w-[60px] font-semibold text-gray-700">D</TableHead>
                                <TableHead className="w-[60px] font-semibold text-gray-700">L</TableHead>
                                <TableHead className="w-[100px] font-semibold text-gray-700">Teams</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {teamData.history.historicalTableData.ranks
                                .sort((a, b) => b.seasonName.localeCompare(a.seasonName))
                                .map((rank, index) => {
                                  const isChampion = rank.position === 1;
                                  const isTopThree = rank.position <= 3;
                                  
                                  return (
                                    <TableRow 
                                      key={index} 
                                      className={`border-gray-100 hover:bg-gray-50 transition-colors ${
                                        isChampion ? 'bg-yellow-50' : isTopThree ? 'bg-green-50' : ''
                                      }`}
                                    >
                                      <TableCell className="font-medium text-gray-900">
                                        {rank.seasonName}
                                      </TableCell>
                                      <TableCell>
                                        <div className="flex items-center gap-2">
                                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                            isChampion 
                                              ? 'bg-yellow-500 text-white' 
                                              : isTopThree 
                                              ? 'bg-green-500 text-white' 
                                              : 'bg-gray-200 text-gray-700'
                                          }`}>
                                            {rank.position}
                                          </div>
                                          {isChampion && (
                                            <Trophy className="w-3 h-3 text-yellow-600" />
                                          )}
                                        </div>
                                      </TableCell>
                                      <TableCell className="font-medium text-gray-900">
                                        {rank.stats.points}
                                      </TableCell>
                                      <TableCell className="text-gray-700">
                                        {rank.stats.wins}
                                      </TableCell>
                                      <TableCell className="text-gray-700">
                                        {rank.stats.draws}
                                      </TableCell>
                                      <TableCell className="text-gray-700">
                                        {rank.stats.loss}
                                      </TableCell>
                                      <TableCell className="text-gray-600 text-sm">
                                        {rank.numberOfTeams} teams
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* No History Data */}
                  {(!teamData.history?.trophyList || teamData.history.trophyList.length === 0) && 
                   (!teamData.history?.historicalTableData?.ranks || teamData.history.historicalTableData.ranks.length === 0) && (
                    <Card className="border-gray-200">
                      <CardContent>
                        <div className="text-center py-12 text-gray-500">
                          <Trophy className="w-16 h-16 mx-auto mb-4 opacity-30" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No History Available</h3>
                          <p className="text-sm">No historical data available for this team</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}