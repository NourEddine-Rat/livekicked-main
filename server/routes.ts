import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Proxy for league standings API (must come before /api/leagues to avoid route conflict)
  app.get('/api/leagues/:leagueId', async (req, res) => {
    console.log('League API route hit for:', req.params.leagueId, 'season:', req.query.season);
    try {
      const { leagueId } = req.params;
      const { season } = req.query;
      
      // Build URL with season parameter if provided
      let apiUrl = `https://api.livekicked.info/api/leagues/${leagueId}/`;
      if (season) {
        apiUrl += `?season=${encodeURIComponent(season as string)}`;
      }
      
      const response = await fetch(apiUrl, {
        headers: {
          'Accept': 'application/json; charset=utf-8',
          'User-Agent': 'FootballLive-App',
          'Referer': 'https://api.livekicked.info',
          'Origin': 'https://api.livekicked.info',
        }
      });

      if (!response.ok) {
        console.error(`League API error for ${leagueId} season ${season}: ${response.status} ${response.statusText}`);
        return res.status(response.status).json({ 
          error: `Failed to fetch league data: ${response.statusText}` 
        });
      }

      const data = await response.json();
      console.log('League data fetched successfully, has table:', !!data.table, 'season:', season || 'current');
      res.json(data);
    } catch (error) {
      console.error('Error fetching league data:', error);
      res.status(500).json({ error: 'Internal server error fetching league data' });
    }
  });

  // Proxy for leagues API (public, no auth needed)
  app.get('/api/leagues', async (req, res) => {
    try {
      const response = await fetch('https://api.livekicked.info/api/leagues', {
        headers: {
          'Accept': 'application/json; charset=utf-8',
          'User-Agent': 'FootballLive-App',
        }
      });

      if (!response.ok) {
        console.error(`Leagues API error: ${response.status} ${response.statusText}`);
        return res.status(response.status).json({ 
          error: `Failed to fetch leagues: ${response.statusText}` 
        });
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error fetching leagues:', error);
      res.status(500).json({ error: 'Internal server error fetching leagues' });
    }
  });

  // Proxy for live matches API (real-time data) - must come before /api/matches/:date
  app.get('/api/matches/live', async (req, res) => {
    console.log('Live matches API route hit');
    try {
      const response = await fetch('https://api.livekicked.info/api/matches/live', {
        headers: {
          'Accept': 'application/json; charset=utf-8',
          'User-Agent': 'FootballLive-App',
          'Referer': 'https://api.livekicked.info',
          'Origin': 'https://api.livekicked.info',
        }
      });

      if (!response.ok) {
        console.error(`Live matches API error: ${response.status} ${response.statusText}`);
        return res.status(response.status).json({ 
          error: `Failed to fetch live matches: ${response.statusText}`,
          leagues: [] // Return empty structure to avoid frontend errors
        });
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error fetching live matches:', error);
      res.status(500).json({ 
        error: 'Internal server error fetching live matches',
        leagues: [] 
      });
    }
  });

  // Proxy for individual match API - MUST come before the date route to avoid conflicts
  app.get('/api/matches/detail/:matchId', async (req, res) => {
    console.log('Match detail API route hit for:', req.params.matchId);
    try {
      const { matchId } = req.params;
      
      // Validate match ID (should be numeric)
      if (!matchId || !/^\d+$/.test(matchId)) {
        return res.status(400).json({ error: 'Invalid match ID format' });
      }
      
      // Check if match ID is reasonable length (prevent excessively long IDs)
      if (matchId.length > 10) {
        return res.status(400).json({ error: 'Invalid match ID length' });
      }
      
      const response = await fetch(`https://api.livekicked.info/api/matches/${matchId}`, {
        headers: {
          'Accept': 'application/json; charset=utf-8',
          'User-Agent': 'FootballLive-App',
          'Referer': 'https://api.livekicked.info',
          'Origin': 'https://api.livekicked.info',
        }
      });

      if (!response.ok) {
        console.error(`Match detail API error for ${matchId}: ${response.status} ${response.statusText}`);
        return res.status(response.status).json({ 
          error: `Failed to fetch match data: ${response.statusText}` 
        });
      }

      const data = await response.json();
      console.log('Match data fetched successfully for:', matchId);
      res.json(data);
    } catch (error) {
      console.error('Error fetching match data:', error);
      res.status(500).json({ error: 'Internal server error fetching match data' });
    }
  });

  // Proxy for matches API (requires auth/special headers)
  app.get('/api/matches/:date', async (req, res) => {
    try {
      const { date } = req.params;
      
      // Validate date format (YYYYMMDD)
      if (!/^\d{8}$/.test(date)) {
        return res.status(400).json({ error: 'Invalid date format. Use YYYYMMDD' });
      }

      const response = await fetch(`https://api.livekicked.info/api/matches/date/${date}`, {
        headers: {
          'Accept': 'application/json; charset=utf-8',
          'User-Agent': 'FootballLive-App',
          'Referer': 'https://api.livekicked.info',
          'Origin': 'https://api.livekicked.info',
        }
      });

      if (!response.ok) {
        console.error(`Matches API error for ${date}: ${response.status} ${response.statusText}`);
        const wwwAuth = response.headers.get('WWW-Authenticate');
        if (wwwAuth) {
          console.error('Auth required:', wwwAuth);
        }
        
        return res.status(response.status).json({ 
          error: `Failed to fetch matches for ${date}: ${response.statusText}`,
          leagues: [] // Return empty structure to avoid frontend errors
        });
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error fetching matches:', error);
      res.status(500).json({ 
        error: 'Internal server error fetching matches',
        leagues: [] 
      });
    }
  });

  // Proxy for news API
  app.get('/api/news', async (req, res) => {
    console.log('News API route hit');
    try {
      const response = await fetch('https://api.livekicked.info/api/news', {
        headers: {
          'Accept': 'application/json; charset=utf-8',
          'User-Agent': 'FootballLive-App',
          'Referer': 'ttps://api.livekicked.infottps://www.livescore.com',
          'Origin': 'https://api.livekicked.info',
        }
      });

      if (!response.ok) {
        console.error(`News API error: ${response.status} ${response.statusText}`);
        return res.status(response.status).json({ 
          error: `Failed to fetch news: ${response.statusText}` 
        });
      }

      const data = await response.json();
      console.log('News data fetched successfully, length:', data.length);
      res.json(data);
    } catch (error) {
      console.error('Error fetching news:', error);
      res.status(500).json({ error: 'Internal server error fetching news' });
    }
  });


  const httpServer = createServer(app);

  return httpServer;
}
