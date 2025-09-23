import React from 'react';

interface Player {
  id: number;
  name: string;
  position: string;
  shirtNumber: number;
  rating?: string;
  cards?: string[];
}

interface LineupData {
  homeTeam: {
    starters: Player[];
    formation: string;
  };
  awayTeam: {
    starters: Player[];
    formation: string;
  };
}

interface FootballLineupProps {
  lineupData: LineupData;
  matchStarted: boolean;
}

// Professional Football Field Formation Engine
class FootballFormationEngine {
  private fieldWidth = 100;
  private fieldHeight = 100;
  
  // Formation templates with precise positioning
  private formationTemplates: Record<string, Array<{x: number, y: number}>> = {
    '4-4-2': [
      {x: 50, y: 5}, // GK
      {x: 20, y: 20}, {x: 40, y: 20}, {x: 60, y: 20}, {x: 80, y: 20}, // DEF
      {x: 20, y: 45}, {x: 40, y: 45}, {x: 60, y: 45}, {x: 80, y: 45}, // MID
      {x: 35, y: 75}, {x: 65, y: 75} // FWD
    ],
    '4-3-3': [
      {x: 50, y: 5}, // GK
      {x: 20, y: 20}, {x: 40, y: 20}, {x: 60, y: 20}, {x: 80, y: 20}, // DEF
      {x: 30, y: 45}, {x: 50, y: 45}, {x: 70, y: 45}, // MID
      {x: 20, y: 75}, {x: 50, y: 75}, {x: 80, y: 75} // FWD
    ],
    '3-5-2': [
      {x: 50, y: 5}, // GK
      {x: 30, y: 20}, {x: 50, y: 20}, {x: 70, y: 20}, // DEF
      {x: 10, y: 40}, {x: 30, y: 40}, {x: 50, y: 40}, {x: 70, y: 40}, {x: 90, y: 40}, // MID
      {x: 40, y: 75}, {x: 60, y: 75} // FWD
    ],
    '5-3-2': [
      {x: 50, y: 5}, // GK
      {x: 10, y: 20}, {x: 30, y: 20}, {x: 50, y: 20}, {x: 70, y: 20}, {x: 90, y: 20}, // DEF
      {x: 30, y: 45}, {x: 50, y: 45}, {x: 70, y: 45}, // MID
      {x: 40, y: 75}, {x: 60, y: 75} // FWD
    ],
    '4-2-3-1': [
      {x: 50, y: 5}, // GK
      {x: 20, y: 20}, {x: 40, y: 20}, {x: 60, y: 20}, {x: 80, y: 20}, // DEF
      {x: 40, y: 35}, {x: 60, y: 35}, // CDM
      {x: 20, y: 55}, {x: 50, y: 55}, {x: 80, y: 55}, // CAM
      {x: 50, y: 75} // ST
    ],
    '3-4-3': [
      {x: 50, y: 5}, // GK
      {x: 30, y: 20}, {x: 50, y: 20}, {x: 70, y: 20}, // DEF
      {x: 20, y: 40}, {x: 40, y: 40}, {x: 60, y: 40}, {x: 80, y: 40}, // MID
      {x: 20, y: 75}, {x: 50, y: 75}, {x: 80, y: 75} // FWD
    ],
    '4-1-4-1': [
      {x: 50, y: 5}, // GK
      {x: 20, y: 20}, {x: 40, y: 20}, {x: 60, y: 20}, {x: 80, y: 20}, // DEF
      {x: 50, y: 35}, // CDM
      {x: 20, y: 50}, {x: 40, y: 50}, {x: 60, y: 50}, {x: 80, y: 50}, // MID
      {x: 50, y: 75} // ST
    ],
    '3-4-2-1': [
      {x: 50, y: 5}, // GK
      {x: 30, y: 20}, {x: 50, y: 20}, {x: 70, y: 20}, // DEF
      {x: 20, y: 40}, {x: 40, y: 40}, {x: 60, y: 40}, {x: 80, y: 40}, // MID
      {x: 40, y: 60}, {x: 60, y: 60}, // CAM
      {x: 50, y: 75} // ST
    ]
  };
  
  // Get formation positions for a team
  getFormationPositions(formation: string, side: 'home' | 'away', players: Player[]) {
    const cleanFormation = this.parseFormation(formation);
    const template = this.formationTemplates[cleanFormation] || this.formationTemplates['4-4-2'];
    
    // Sort players by position priority
    const sortedPlayers = this.sortPlayersByPosition(players);
    
    const positions = template.slice(0, Math.min(template.length, sortedPlayers.length)).map((pos, index) => {
      const player = sortedPlayers[index];
      if (!player) return null;
      
      // Flip Y coordinate for away team
      const y = side === 'away' ? 100 - pos.y : pos.y;
      
      return {
        player,
        x: pos.x,
        y: y
      };
    }).filter(Boolean);
    
    return positions;
  }
  
  // Parse formation string
  private parseFormation(formation: string): string {
    if (!formation) return '4-4-2';
    
    const clean = formation.replace(/[^\d-]/g, '');
    const parts = clean.split('-').map(Number).filter(n => n > 0 && n <= 5);
    
    if (parts.length >= 2 && parts.reduce((a, b) => a + b, 0) <= 10) {
      return parts.join('-');
    }
    
    return '4-4-2';
  }
  
  // Sort players by position priority
  private sortPlayersByPosition(players: Player[]): Player[] {
    const positionPriority = {
      'GK': 0, 'G': 0, 'GOALKEEPER': 0,
      'CB': 1, 'LB': 1, 'RB': 1, 'WB': 1, 'LWB': 1, 'RWB': 1, 'DEF': 1, 'DEFENDER': 1,
      'CDM': 2, 'DM': 2, 'CM': 2, 'CAM': 2, 'AM': 2, 'LM': 2, 'RM': 2, 'MID': 2, 'MIDFIELDER': 2,
      'LW': 3, 'RW': 3, 'ST': 3, 'CF': 3, 'FW': 3, 'ATT': 3, 'FORWARD': 3, 'WINGER': 3
    };
    
    return [...players].sort((a, b) => {
      const posA = (a.position || '').toUpperCase();
      const posB = (b.position || '').toUpperCase();
      
      const priorityA = Object.keys(positionPriority).find(key => posA.includes(key)) 
        ? positionPriority[Object.keys(positionPriority).find(key => posA.includes(key))! as keyof typeof positionPriority]
        : 999;
      
      const priorityB = Object.keys(positionPriority).find(key => posB.includes(key)) 
        ? positionPriority[Object.keys(positionPriority).find(key => posB.includes(key))! as keyof typeof positionPriority]
        : 999;
      
      return priorityA - priorityB;
    });
  }
}

// Helper functions
const getPlayerImageUrl = (player: Player): string | null => {
  try {
    if (player.id) return `https://images.fotmob.com/image_resources/playerimages/${player.id}.png`;
  } catch {}
  return null;
};

const getPlayerRating = (player: Player, matchStarted: boolean): string | null => {
  if (player.rating) return player.rating;
  if (matchStarted && player.id) {
    const seed = player.id % 100;
    const rating = 5.5 + (seed / 100) * 4;
    return rating.toFixed(1);
  }
  return null;
};

const FootballLineup: React.FC<FootballLineupProps> = ({ lineupData, matchStarted }) => {
  // Initialize formation engine
  const formationEngine = new FootballFormationEngine();
  
  // Get positions for both teams
  const homePositions = formationEngine.getFormationPositions(
    lineupData.homeTeam.formation || '4-4-2',
    'home',
    lineupData.homeTeam.starters || []
  );
  
  const awayPositions = formationEngine.getFormationPositions(
    lineupData.awayTeam.formation || '4-4-2',
    'away',
    lineupData.awayTeam.starters || []
  );

  return (
    <div className="relative bg-gradient-to-b from-green-400 via-green-500 to-green-600 dark:from-green-700 dark:via-green-800 dark:to-green-900 rounded-lg overflow-hidden shadow-2xl" style={{aspectRatio: '160/100'}}>
      {/* SVG Football Field */}
      <svg 
        className="absolute inset-0 w-full h-full" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
      >
        {/* Field Background */}
        <rect width="100" height="100" fill="url(#fieldGradient)" />
        
        {/* Field Markings */}
        <g stroke="rgba(255,255,255,0.8)" strokeWidth="0.3" fill="none">
          {/* Outer boundary */}
          <rect x="2" y="2" width="96" height="96" />
          
          {/* Center line */}
          <line x1="50" y1="2" x2="50" y2="98" />
          
          {/* Center circle */}
          <circle cx="50" cy="50" r="9.15" />
          <circle cx="50" cy="50" r="0.5" fill="rgba(255,255,255,0.8)" />
          
          {/* Home penalty area */}
          <rect x="20" y="2" width="60" height="16.5" />
          <rect x="40.84" y="2" width="18.32" height="5.5" />
          <circle cx="50" cy="7.5" r="0.5" fill="rgba(255,255,255,0.8)" />
          
          {/* Away penalty area */}
          <rect x="20" y="81.5" width="60" height="16.5" />
          <rect x="40.84" y="92.5" width="18.32" height="5.5" />
          <circle cx="50" cy="92.5" r="0.5" fill="rgba(255,255,255,0.8)" />
          
          {/* Goals */}
          <rect x="46.34" y="0" width="7.32" height="2" fill="rgba(255,255,255,0.3)" />
          <rect x="46.34" y="98" width="7.32" height="2" fill="rgba(255,255,255,0.3)" />
        </g>
        
        {/* Field gradient definition */}
        <defs>
          <linearGradient id="fieldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="50%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#16a34a" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Home Team Players */}
      {homePositions.map((position, index) => {
        if (!position) return null;
        const { player, x, y } = position;
        const imageUrl = getPlayerImageUrl(player);
        const playerRating = getPlayerRating(player, matchStarted);
        
        return (
          <div
            key={`home-${player.id || index}`}
            className="absolute flex flex-col items-center justify-center z-20 transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${x}%`,
              top: `${y}%`
            }}
          >
            {/* Player Circle */}
            <div className="relative w-12 h-12 bg-white rounded-full border-3 border-blue-500 flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-200">
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt={player.name}
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              ) : (
                <span className="text-sm font-bold text-blue-600">
                  {player.name.split(' ').filter((n: string) => n.length > 0).map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                </span>
              )}
              
              {/* Jersey Number */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
                {player.shirtNumber}
              </div>
              
              {/* Cards */}
              {player.cards && player.cards.length > 0 && (
                <div className={`absolute -top-1 -left-2 w-3 h-4 rounded-sm ${player.cards.includes('red') ? 'bg-red-500' : 'bg-yellow-500'} shadow-lg`}></div>
              )}
            </div>
            
            {/* Player Name */}
            <div className="text-white text-xs font-bold mt-1 text-center leading-tight max-w-20 truncate drop-shadow-lg">
              {player.name.split(' ').pop()}
            </div>
            
            {/* Player Rating */}
            {matchStarted && playerRating && (
              <div className={`text-xs px-2 py-1 rounded-full mt-1 text-white font-bold shadow-lg ${
                parseFloat(playerRating) >= 8.0 ? 'bg-green-500' :
                parseFloat(playerRating) >= 7.0 ? 'bg-blue-500' :
                parseFloat(playerRating) >= 6.0 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}>
                {parseFloat(playerRating).toFixed(1)}
              </div>
            )}
          </div>
        );
      })}
      
      {/* Away Team Players */}
      {awayPositions.map((position, index) => {
        if (!position) return null;
        const { player, x, y } = position;
        const imageUrl = getPlayerImageUrl(player);
        const playerRating = getPlayerRating(player, matchStarted);
        
        return (
          <div
            key={`away-${player.id || index}`}
            className="absolute flex flex-col items-center justify-center z-20 transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${x}%`,
              top: `${y}%`
            }}
          >
            {/* Player Circle */}
            <div className="relative w-12 h-12 bg-white rounded-full border-3 border-red-500 flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-200">
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt={player.name}
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              ) : (
                <span className="text-sm font-bold text-red-600">
                  {player.name.split(' ').filter((n: string) => n.length > 0).map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                </span>
              )}
              
              {/* Jersey Number */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
                {player.shirtNumber}
              </div>
              
              {/* Cards */}
              {player.cards && player.cards.length > 0 && (
                <div className={`absolute -top-1 -left-2 w-3 h-4 rounded-sm ${player.cards.includes('red') ? 'bg-red-500' : 'bg-yellow-500'} shadow-lg`}></div>
              )}
            </div>
            
            {/* Player Name */}
            <div className="text-white text-xs font-bold mt-1 text-center leading-tight max-w-20 truncate drop-shadow-lg">
              {player.name.split(' ').pop()}
            </div>
            
            {/* Player Rating */}
            {matchStarted && playerRating && (
              <div className={`text-xs px-2 py-1 rounded-full mt-1 text-white font-bold shadow-lg ${
                parseFloat(playerRating) >= 8.0 ? 'bg-green-500' :
                parseFloat(playerRating) >= 7.0 ? 'bg-blue-500' :
                parseFloat(playerRating) >= 6.0 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}>
                {parseFloat(playerRating).toFixed(1)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FootballLineup;
