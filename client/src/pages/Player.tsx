import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MapPin, 
  Users, 
  Calendar, 
  Trophy, 
  ExternalLink, 
  ArrowLeft, 
  Star, 
  Target, 
  Award, 
  TrendingUp, 
  Activity, 
  Clock, 
  Shield, 
  BarChart3, 
  Flag, 
  Building2, 
  User,
  Shirt,
  Footprints,
  DollarSign,
  Calendar as CalendarIcon,
  ArrowRight,
  ArrowLeft as ArrowLeftIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface PlayerData {
  id: number;
  name: string;
  birthDate: {
    utcTime: string;
    timezone: string;
  };
  contractEnd: {
    utcTime: string;
    timezone: string;
  } | null;
  isCoach: boolean;
  isCaptain: boolean;
  primaryTeam: {
    teamId: number;
    teamName: string;
    onLoan: boolean;
    teamColors: {
      color: string;
      colorAlternate: string;
      colorAway: string;
      colorAwayAlternate: string;
    };
  };
  positionDescription: {
    positions: Array<{
      strPos: {
        label: string;
        key: string;
      };
      strPosShort: {
        label: string;
        key: string;
      };
      occurences: number;
      position: string;
      isMainPosition: boolean;
      pitchPositionData: {
        right: number;
        top: number;
      } | null;
    }>;
    primaryPosition: {
      label: string;
      key: string;
    };
    nonPrimaryPositions: any[];
  };
  injuryInformation: {
    name: string;
    key: string;
    expectedReturn: {
      expectedReturnKey: string;
      expectedReturnDateParam: string | null;
      expectedReturnFallback: string;
    };
    lastUpdated: {
      utcTime: string;
      timezone: string | null;
    };
  } | null;
  internationalDuty: any;
  playerInformation: Array<{
    value: {
      numberValue?: number;
      key?: string | null;
      fallback: string | number;
      options?: {
        style?: string;
        unit?: string;
        unitDisplay?: string;
      };
      dateValue?: string;
    };
    title: string;
    translationKey: string;
    icon?: {
      type: string;
      id: string;
    };
    countryCode?: string;
  }>;
  mainLeague: {
    leagueId: number;
    leagueName: string;
    season: string;
    stats: Array<{
      title: string;
      localizedTitleId: string;
      value: number;
    }> | null;
  };
  trophies: {
    playerTrophies: Array<{
      ccode: string;
      teamId: number;
      teamName: string;
      tournaments: Array<{
        ccode: string;
        leagueId: number;
        leagueName: string;
        seasonsWon: string[];
        seasonsRunnerUp: string[];
      }>;
    }>;
    coachTrophies: Array<{
      ccode: string;
      teamId: number;
      teamName: string;
      tournaments: Array<{
        ccode: string;
        leagueId: number;
        leagueName: string;
        seasonsWon: string[];
        seasonsRunnerUp: string[];
      }>;
    }>;
  };
  recentMatches: Array<{
    teamId: number;
    teamName: string;
    opponentTeamId: number;
    opponentTeamName: string;
    isHomeTeam: boolean;
    id: number;
    matchDate: {
      utcTime: string;
    };
    matchPageUrl: string;
    leagueId: number;
    leagueName: string;
    stage: string | null;
    homeScore: number;
    awayScore: number;
    minutesPlayed: number;
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
    ratingProps: {
      rating: string | number;
      isTopRating: boolean;
    };
    playerOfTheMatch: boolean;
    onBench: boolean;
  }>;
  careerHistory: {
    showFootnote: boolean;
    careerItems: {
      senior: {
        teamEntries: Array<{
          participantId: number;
          teamId: number;
          team: string;
          teamGender: string;
          showTeamGender: boolean;
          transferType: {
            text: string;
            localizationKey: string;
          } | null;
          startDate: string;
          endDate: string | null;
          active: boolean;
          role: string | null;
          appearances: string;
          goals: string;
          assists: string;
          hasUncertainData: boolean;
        }>;
        seasonEntries: Array<{
          seasonName: string;
          appearances: string;
          goals: string;
          assists: string;
          rating: {
            rating: string | number | null;
          };
          tournamentStats: Array<{
            isFriendly: boolean;
            leagueId: number;
            leagueName: string;
            seasonName: string;
            tournamentId: number;
            goals: string;
            assists: string;
            appearances: string;
            rating: {
              rating: string | number | null;
            };
          }>;
          teamId: number;
          team: string;
          teamGender: string;
          showTeamGender: boolean;
          transferType: {
            text: string;
            localizationKey: string;
          } | null;
        }>;
      };
      coach?: {
        teamEntries: Array<{
          participantId: number;
          teamId: number;
          team: string;
          teamGender: string;
          showTeamGender: boolean;
          transferType: {
            text: string;
            localizationKey: string;
          } | null;
          startDate: string;
          endDate: string | null;
          active: boolean;
          role: string | null;
          appearances: string | null;
          goals: string | null;
          assists: string | null;
          hasUncertainData: boolean;
        }>;
        seasonEntries: any;
      };
      youth: any;
      "national team": any;
    };
    fullCareer: boolean;
  };
  traits: {
    key: string;
    title: string;
    items: Array<{
      key: string;
      title: string;
      value: number;
    }>;
  };
  meta: any;
  coachStats: {
    activeCareerEntry: {
      teamId: number;
      teamName: string;
      teamColors: {
        darkMode: string;
        lightMode: string;
        fontDarkMode: string;
        fontLightMode: string;
      };
      startDate: string | null;
      endDate: string | null;
      matches: number;
      wins: number;
      draws: number;
      losses: number;
    };
    historicalCareerEntries: Array<{
      teamId: number;
      teamName: string;
      teamColors: {
        darkMode: string;
        lightMode: string;
        fontDarkMode: string;
        fontLightMode: string;
      };
      startDate: {
        utcTime: string;
      };
      endDate: {
        utcTime: string;
      } | null;
      matches: number;
      wins: number;
      draws: number;
      losses: number;
      winPercentage: number;
      pointsPerGame: number;
    }>;
  } | null;
  statSeasons: any[];
  firstSeasonStats: {
    sectionOrder: string[];
    shotmap: any[];
    statsSection: {
      id: string;
      items: Array<{
        display: string;
        items: Array<{
          localizedTitleId: string;
          per90: number;
          percentileRank: number;
          percentileRankPer90: number;
          statFormat: string;
          statValue: string;
          title: string;
        }>;
        localizedTitleId: string;
        title: string;
        type: string;
      }>;
      localizedTitleId: string;
      title: string;
      type: string;
    };
    topStatCard: {
      display: string;
      id: string;
      items: Array<{
        localizedTitleId: string;
        per90: number;
        percentileRank: number;
        percentileRankPer90: number;
        statFormat: string;
        statValue: string;
        title: string;
      }>;
      type: string;
    };
    keeperShotmap: any;
  };
  status: string;
}

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

const Player = () => {
  const [, params] = useRoute("/player/:id");
  const playerId = params?.id;

  const { data: playerData, isLoading, error } = useQuery<PlayerData>({
    queryKey: ["player", playerId],
    queryFn: async () => {
      const response = await fetch(`/api/player/${playerId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch player data");
      }
      return response.json();
    },
    enabled: !!playerId,
  });

  const navigateToTeam = (teamId: number) => {
    window.location.href = `/team/${teamId}`;
  };

  const navigateToMatch = (matchId: number) => {
    window.location.href = `/match/${matchId}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading player data...</p>
        </div>
      </div>
    );
  }

  if (error || !playerData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load player data</p>
          <Button onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const getPlayerInfo = (key: string) => {
    return playerData.playerInformation.find(info => info.translationKey === key)?.value?.fallback || 'N/A';
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'N/A';
    }
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `€${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `€${(value / 1000).toFixed(0)}K`;
    }
    return `€${value}`;
  };

  const getStatValue = (statName: string) => {
    if (playerData.isCoach || !playerData.mainLeague.stats) {
      return 0;
    }
    return playerData.mainLeague.stats.find(stat => stat.localizedTitleId === statName)?.value || 0;
  };

  const chartData = [
    { name: 'Goals', value: getStatValue('goals'), color: '#22c55e' },
    { name: 'Assists', value: getStatValue('assists'), color: '#3b82f6' },
    { name: 'Rating', value: getStatValue('rating'), color: '#f59e0b' },
  ];

  const seasonStats = playerData.firstSeasonStats?.statsSection?.items || [];
  const topStats = playerData.firstSeasonStats?.topStatCard?.items || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
                {/* Player Photo */}
                <div className="flex-shrink-0">
                  <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                    <AvatarImage 
                      src={`https://images.fotmob.com/image_resources/playerimages/${playerData.id}.png`}
                      alt={playerData.name}
                    />
                    <AvatarFallback className="text-2xl bg-gray-200 text-gray-700">
                      {playerData.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Player Info */}
                <div className="flex-1">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                    <div>
                      <h1 className="text-4xl font-bold text-gray-900 mb-2">{playerData.name}</h1>
                      <div className="flex items-center gap-4 mb-4">
                        <Badge variant="secondary" className="text-sm">
                          {playerData.positionDescription.primaryPosition.label}
                        </Badge>
                        {playerData.isCaptain && (
                          <Badge variant="outline" className="text-sm">
                            <Shield className="w-3 h-3 mr-1" />
                            Captain
                          </Badge>
                        )}
                        {playerData.primaryTeam.onLoan && (
                          <Badge variant="outline" className="text-sm">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            On Loan
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* Team Info */}
                    <div className="flex items-center gap-3">
                      <img 
                        src={`https://images.fotmob.com/image_resources/logo/teamlogo/${playerData.primaryTeam.teamId}.png`}
                        alt={playerData.primaryTeam.teamName}
                        className="w-8 h-8"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <div 
                        className="cursor-pointer hover:text-blue-600 transition-colors"
                        onClick={() => navigateToTeam(playerData.primaryTeam.teamId)}
                      >
                        <p className="font-medium text-gray-900">{playerData.primaryTeam.teamName}</p>
                        <p className="text-sm text-gray-600">{playerData.mainLeague.leagueName}</p>
                      </div>
                    </div>
                  </div>

                  {/* Player Details Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Age</p>
                        <p className="font-medium">{getPlayerInfo('age_sentencecase')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Height</p>
                        <p className="font-medium">{getPlayerInfo('height_sentencecase')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Footprints className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Foot</p>
                        <p className="font-medium">{getPlayerInfo('preferred_foot')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Market Value</p>
                        <p className="font-medium">{getPlayerInfo('transfer_value')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shirt className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Shirt</p>
                        <p className="font-medium">#{getPlayerInfo('shirt')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Flag className="w-4 h-4 text-gray-500" />
                      <div className="flex items-center gap-2">
                        <img 
                          src={getCountryFlag(getPlayerInfo('country_sentencecase') as string)}
                          alt={getPlayerInfo('country_sentencecase') as string}
                          className="w-4 h-3 rounded-sm"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <p className="font-medium">{getPlayerInfo('country_sentencecase')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Contract</p>
                        <p className="font-medium">
                          {playerData.contractEnd?.utcTime ? formatDate(playerData.contractEnd.utcTime) : 'N/A'}
                        </p>
                      </div>
                    </div>
                    {playerData.injuryInformation && (
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-red-500" />
                        <div>
                          <p className="text-xs text-red-500">Injury</p>
                          <p className="font-medium text-red-600">{playerData.injuryInformation.name}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="stats" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Stats
            </TabsTrigger>
            <TabsTrigger value="matches" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Recent Matches
            </TabsTrigger>
            <TabsTrigger value="career" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Career
            </TabsTrigger>
            <TabsTrigger value="trophies" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Trophies
            </TabsTrigger>
          </TabsList>

          {/* Stats Tab */}
          <TabsContent value="stats" className="space-y-6">
            {playerData.isCoach ? (
              /* Coach Stats */
              playerData.coachStats ? (
                <>
                  {/* Active Career Stats */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        Current Team Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {playerData.coachStats.activeCareerEntry.wins}
                          </div>
                          <div className="text-sm text-gray-600">Wins</div>
                        </div>
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                          <div className="text-2xl font-bold text-yellow-600">
                            {playerData.coachStats.activeCareerEntry.draws}
                          </div>
                          <div className="text-sm text-gray-600">Draws</div>
                        </div>
                        <div className="text-center p-4 bg-red-50 rounded-lg">
                          <div className="text-2xl font-bold text-red-600">
                            {playerData.coachStats.activeCareerEntry.losses}
                          </div>
                          <div className="text-sm text-gray-600">Losses</div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {playerData.coachStats.activeCareerEntry.matches}
                          </div>
                          <div className="text-sm text-gray-600">Matches</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Historical Career */}
                  {playerData.coachStats.historicalCareerEntries.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Career History</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {playerData.coachStats.historicalCareerEntries.map((entry, index) => (
                            <div key={index} className="border rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold">{entry.teamName}</h3>
                                <div className="text-sm text-gray-500">
                                  {formatDate(entry.startDate.utcTime)} - {entry.endDate ? formatDate(entry.endDate.utcTime) : 'Present'}
                                </div>
                              </div>
                              <div className="grid grid-cols-4 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-500">Matches:</span>
                                  <span className="ml-2 font-medium">{entry.matches}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Wins:</span>
                                  <span className="ml-2 font-medium text-green-600">{entry.wins}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Draws:</span>
                                  <span className="ml-2 font-medium text-yellow-600">{entry.draws}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Losses:</span>
                                  <span className="ml-2 font-medium text-red-600">{entry.losses}</span>
                                </div>
                              </div>
                              <div className="mt-2 text-sm">
                                <span className="text-gray-500">Win Rate:</span>
                                <span className="ml-2 font-medium">{entry.winPercentage.toFixed(1)}%</span>
                                <span className="ml-4 text-gray-500">Points per Game:</span>
                                <span className="ml-2 font-medium">{entry.pointsPerGame.toFixed(2)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">No coaching statistics available</p>
                  </CardContent>
                </Card>
              )
            ) : (
              /* Player Stats */
              <>
                {/* Season Performance Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Season Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#3b82f6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-6">
                      {chartData.map((stat, index) => (
                        <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold" style={{ color: stat.color }}>
                            {stat.value}
                          </div>
                          <div className="text-sm text-gray-600">{stat.name}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Stats */}
                {seasonStats.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Detailed Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {seasonStats.map((group, groupIndex) => (
                      <div key={groupIndex}>
                        <h3 className="text-lg font-semibold mb-4">{group.title}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {group.items.map((stat, statIndex) => (
                            <div key={statIndex} className="p-4 bg-gray-50 rounded-lg">
                              <div className="text-2xl font-bold text-gray-900">{stat.statValue}</div>
                              <div className="text-sm text-gray-600">{stat.title}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                Per 90: {stat.per90.toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
              </>
            )}
          </TabsContent>

          {/* Recent Matches Tab */}
          <TabsContent value="matches" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Recent Matches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Match</TableHead>
                      <TableHead>Competition</TableHead>
                      <TableHead>Minutes</TableHead>
                      <TableHead>Goals</TableHead>
                      <TableHead>Assists</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Cards</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {playerData.recentMatches.slice(0, 10).map((match) => (
                      <TableRow 
                        key={match.id}
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => navigateToMatch(match.id)}
                      >
                        <TableCell>
                          {formatDate(match.matchDate.utcTime)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <img 
                              src={`https://images.fotmob.com/image_resources/logo/teamlogo/${match.teamId}.png`}
                              alt={match.teamName}
                              className="w-6 h-6"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                            <span className="font-medium">{match.teamName}</span>
                            <span className="text-gray-500">vs</span>
                            <img 
                              src={`https://images.fotmob.com/image_resources/logo/teamlogo/${match.opponentTeamId}.png`}
                              alt={match.opponentTeamName}
                              className="w-6 h-6"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                            <span className="font-medium">{match.opponentTeamName}</span>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {match.homeScore} - {match.awayScore}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{match.leagueName}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {match.minutesPlayed}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            {match.goals}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {match.assists}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            {match.ratingProps.rating}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {match.yellowCards > 0 && (
                              <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                                {match.yellowCards}
                              </Badge>
                            )}
                            {match.redCards > 0 && (
                              <Badge variant="outline" className="bg-red-100 text-red-800">
                                {match.redCards}
                              </Badge>
                            )}
                            {match.yellowCards === 0 && match.redCards === 0 && (
                              <span className="text-gray-400">-</span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Career Tab */}
          <TabsContent value="career" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Career History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {playerData.isCoach ? (
                    /* Coach Career */
                    <>
                      {/* Coaching Career */}
                      {(playerData.careerHistory.careerItems as any).coach && (
                        <div>
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Building2 className="w-5 h-5" />
                            Coaching Career
                          </h3>
                          <div className="space-y-4">
                            {(playerData.careerHistory.careerItems as any).coach.teamEntries.map((entry: any, index: number) => (
                              <div key={index} className="p-4 border rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-3">
                                    <img 
                                      src={`https://images.fotmob.com/image_resources/logo/teamlogo/${entry.teamId}.png`}
                                      alt={entry.team}
                                      className="w-8 h-8"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                      }}
                                    />
                                    <div>
                                      <p className="font-medium">{entry.team}</p>
                                      <p className="text-sm text-gray-600">
                                        {formatDate(entry.startDate)} - {entry.endDate ? formatDate(entry.endDate) : 'Present'}
                                      </p>
                                    </div>
                                  </div>
                                  {entry.active && (
                                    <Badge variant="outline" className="bg-green-100 text-green-800">
                                      Current
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Playing Career */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <User className="w-5 h-5" />
                          Playing Career
                        </h3>
                        <div className="space-y-4">
                          {playerData.careerHistory.careerItems.senior.teamEntries.map((entry, index) => (
                            <div key={index} className="p-4 border rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                  <img 
                                    src={`https://images.fotmob.com/image_resources/logo/teamlogo/${entry.teamId}.png`}
                                    alt={entry.team}
                                    className="w-8 h-8"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                  <div>
                                    <p className="font-medium">{entry.team}</p>
                                    <p className="text-sm text-gray-600">
                                      {formatDate(entry.startDate)} - {entry.endDate ? formatDate(entry.endDate) : 'Present'}
                                    </p>
                                  </div>
                                </div>
                                {entry.transferType && (
                                  <Badge variant="outline">{entry.transferType.text}</Badge>
                                )}
                              </div>
                              <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-500">Appearances:</span>
                                  <span className="ml-2 font-medium">{entry.appearances}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Goals:</span>
                                  <span className="ml-2 font-medium">{entry.goals}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Assists:</span>
                                  <span className="ml-2 font-medium">{entry.assists}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Player Career */
                    <>
                      {/* Senior Career */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Senior Career</h3>
                        <div className="space-y-4">
                          {playerData.careerHistory.careerItems.senior.teamEntries.map((entry, index) => (
                            <div key={index} className="p-4 border rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                  <img 
                                    src={`https://images.fotmob.com/image_resources/logo/teamlogo/${entry.teamId}.png`}
                                    alt={entry.team}
                                    className="w-8 h-8"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                  <div>
                                    <p className="font-medium">{entry.team}</p>
                                    <p className="text-sm text-gray-600">
                                      {formatDate(entry.startDate)} - {entry.endDate ? formatDate(entry.endDate) : 'Present'}
                                    </p>
                                  </div>
                                </div>
                                {entry.transferType && (
                                  <Badge variant="outline">{entry.transferType.text}</Badge>
                                )}
                              </div>
                              <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-500">Appearances:</span>
                                  <span className="ml-2 font-medium">{entry.appearances}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Goals:</span>
                                  <span className="ml-2 font-medium">{entry.goals}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Assists:</span>
                                  <span className="ml-2 font-medium">{entry.assists}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Season Performance */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Season Performance</h3>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Season</TableHead>
                              <TableHead>Team</TableHead>
                              <TableHead>Appearances</TableHead>
                              <TableHead>Goals</TableHead>
                              <TableHead>Assists</TableHead>
                              <TableHead>Rating</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {playerData.careerHistory.careerItems.senior.seasonEntries.slice(0, 10).map((season, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{season.seasonName}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <img 
                                      src={`https://images.fotmob.com/image_resources/logo/teamlogo/${season.teamId}.png`}
                                      alt={season.team}
                                      className="w-6 h-6"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                      }}
                                    />
                                    <span>{season.team}</span>
                                  </div>
                                </TableCell>
                                <TableCell>{season.appearances}</TableCell>
                                <TableCell>{season.goals}</TableCell>
                                <TableCell>{season.assists}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3" />
                                    {season.rating.rating || '-'}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trophies Tab */}
          <TabsContent value="trophies" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Trophies & Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Player Trophies */}
                  {playerData.trophies.playerTrophies.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Player Trophies
                      </h3>
                      <div className="space-y-6">
                        {playerData.trophies.playerTrophies.map((trophyGroup, groupIndex) => (
                          <div key={groupIndex}>
                            <h4 className="text-md font-medium mb-3 flex items-center gap-2">
                              <img 
                                src={`https://images.fotmob.com/image_resources/logo/teamlogo/${trophyGroup.teamId}.png`}
                                alt={trophyGroup.teamName}
                                className="w-5 h-5"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                              {trophyGroup.teamName}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {trophyGroup.tournaments.map((tournament, tournamentIndex) => (
                                <div key={tournamentIndex} className="p-4 border rounded-lg">
                                  <div className="flex items-center justify-between mb-2">
                                    <h5 className="font-medium">{tournament.leagueName}</h5>
                                    <Badge variant="outline">{tournament.ccode}</Badge>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Trophy className="w-4 h-4 text-yellow-500" />
                                      <span className="text-sm">
                                        Won: {tournament.seasonsWon.length} times
                                      </span>
                                    </div>
                                    {tournament.seasonsRunnerUp.length > 0 && (
                                      <div className="flex items-center gap-2">
                                        <Award className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm">
                                          Runner-up: {tournament.seasonsRunnerUp.length} times
                                        </span>
                                      </div>
                                    )}
                                    {tournament.seasonsWon.length > 0 && (
                                      <div className="text-xs text-gray-600 mt-2">
                                        <p className="font-medium">Recent wins:</p>
                                        <p>{tournament.seasonsWon.slice(0, 3).join(', ')}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Coach Trophies */}
                  {playerData.trophies.coachTrophies.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        Coach Trophies
                      </h3>
                      <div className="space-y-6">
                        {playerData.trophies.coachTrophies.map((trophyGroup, groupIndex) => (
                          <div key={groupIndex}>
                            <h4 className="text-md font-medium mb-3 flex items-center gap-2">
                              <img 
                                src={`https://images.fotmob.com/image_resources/logo/teamlogo/${trophyGroup.teamId}.png`}
                                alt={trophyGroup.teamName}
                                className="w-5 h-5"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                              {trophyGroup.teamName}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {trophyGroup.tournaments.map((tournament, tournamentIndex) => (
                                <div key={tournamentIndex} className="p-4 border rounded-lg">
                                  <div className="flex items-center justify-between mb-2">
                                    <h5 className="font-medium">{tournament.leagueName}</h5>
                                    <Badge variant="outline">{tournament.ccode}</Badge>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Trophy className="w-4 h-4 text-yellow-500" />
                                      <span className="text-sm">
                                        Won: {tournament.seasonsWon.length} times
                                      </span>
                                    </div>
                                    {tournament.seasonsRunnerUp.length > 0 && (
                                      <div className="flex items-center gap-2">
                                        <Award className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm">
                                          Runner-up: {tournament.seasonsRunnerUp.length} times
                                        </span>
                                      </div>
                                    )}
                                    {tournament.seasonsWon.length > 0 && (
                                      <div className="text-xs text-gray-600 mt-2">
                                        <p className="font-medium">Recent wins:</p>
                                        <p>{tournament.seasonsWon.slice(0, 3).join(', ')}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No trophies message */}
                  {playerData.trophies.playerTrophies.length === 0 && playerData.trophies.coachTrophies.length === 0 && (
                    <div className="text-center py-8">
                      <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No trophies available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Player;
