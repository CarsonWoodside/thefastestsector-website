import axios from 'axios';

const BASE_URL = 'https://api.jolpi.ca/ergast/f1';

// Get current season
export const getCurrentSeason = () => {
  return new Date().getFullYear();
};

// Get next race
export const getNextRace = async () => {
  try {
    const currentSeason = getCurrentSeason();
    const response = await axios.get(`${BASE_URL}/${currentSeason}.json`);
    const races = response.data.MRData.RaceTable.Races;
    
    if (!races || races.length === 0) return null;
    
    const now = new Date();
    
    // Find next race
    const nextRace = races.find(race => {
      const raceDate = new Date(`${race.date}T${race.time || '14:00:00'}`);
      return raceDate > now;
    });
    
    // If no upcoming race, return the most recent race
    if (!nextRace) {
      const completedRaces = races.filter(race => {
        const raceDate = new Date(`${race.date}T${race.time || '14:00:00'}`);
        return raceDate <= now;
      });
      return completedRaces[completedRaces.length - 1] || races[races.length - 1];
    }
    
    return nextRace;
  } catch (error) {
    console.error('Error fetching next race:', error);
    return null;
  }
};

// Get recent race results
export const getRecentRaceResults = async () => {
  try {
    const currentSeason = getCurrentSeason();
    const response = await axios.get(`${BASE_URL}/${currentSeason}.json`);
    const races = response.data.MRData.RaceTable.Races;
    
    if (!races || races.length === 0) return null;
    
    // Find the most recent completed race
    const now = new Date();
    const completedRaces = races.filter(race => {
      const raceDate = new Date(`${race.date}T${race.time || '14:00:00'}`);
      return raceDate < now;
    });
    
    if (completedRaces.length === 0) return null;
    
    const recentRace = completedRaces[completedRaces.length - 1];
    
    // Get results for the recent race
    const roundNum = recentRace.round;
    const resultsResponse = await axios.get(`${BASE_URL}/${currentSeason}/${roundNum}/results.json`);
    const results = resultsResponse.data.MRData.RaceTable.Races[0]?.Results || [];
    
    // Extract podium info (top 3)
    const podium = results.slice(0, 3).map((result, index) => ({
      position: index + 1,
      driverName: `${result.Driver.givenName} ${result.Driver.familyName}`,
      constructorName: result.Constructor.name,
      time: result.Time?.time || 'N/A',
      points: result.points || '0'
    }));
    
    return {
      raceName: recentRace.raceName,
      date: recentRace.date,
      circuit: recentRace.Circuit.circuitName,
      location: `${recentRace.Circuit.Location.locality}, ${recentRace.Circuit.Location.country}`,
      podium
    };
  } catch (error) {
    console.error('Error fetching recent race results:', error);
    return null;
  }
};

// Get current championship standings
export const getDriverStandings = async () => {
  try {
    const currentSeason = getCurrentSeason();
    const response = await axios.get(`${BASE_URL}/${currentSeason}/driverStandings.json`);
    const standings = response.data.MRData.StandingsTable.StandingsLists;
    
    if (standings && standings.length > 0) {
      return standings[0].DriverStandings || [];
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching driver standings:', error);
    return [];
  }
};

// Get race results for completed races count
export const getCompletedRaces = async () => {
  try {
    const currentSeason = getCurrentSeason();
    const response = await axios.get(`${BASE_URL}/${currentSeason}.json`);
    const races = response.data.MRData.RaceTable.Races || [];
    
    const now = new Date();
    
    // Count races that have already happened (based on date, not results)
    const completedRaces = races.filter(race => {
      const raceDate = new Date(`${race.date}T${race.time || '14:00:00'}`);
      return raceDate < now;
    });
    
    return completedRaces;
  } catch (error) {
    console.error('Error fetching completed races:', error);
    return [];
  }
};

// Get total races in season
export const getTotalRaces = async () => {
  try {
    const currentSeason = getCurrentSeason();
    const response = await axios.get(`${BASE_URL}/${currentSeason}.json`);
    return response.data.MRData.RaceTable.Races || [];
  } catch (error) {
    console.error('Error fetching total races:', error);
    return [];
  }
};
