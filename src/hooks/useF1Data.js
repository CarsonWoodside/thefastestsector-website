import { useState, useEffect } from 'react';
import { getNextRace, getDriverStandings, getCompletedRaces, getTotalRaces, getCurrentSeason, getRecentRaceResults } from '../utils/f1Api';

export const useF1Data = () => {
  const [data, setData] = useState({
    nextRace: null,
    recentRaceResults: null,
    championshipLeader: null,
    completedRaces: 0,
    totalRaces: 0,
    season: getCurrentSeason(),
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchF1Data = async () => {
      try {
        setData(prev => ({ ...prev, loading: true }));

        const [nextRace, recentRaceResults, standings, completedRaces, totalRaces] = await Promise.all([
          getNextRace(),
          getRecentRaceResults(),
          getDriverStandings(),
          getCompletedRaces(),
          getTotalRaces()
        ]);

        setData({
          nextRace,
          recentRaceResults,
          championshipLeader: standings[0] || null,
          completedRaces: completedRaces.length,
          totalRaces: totalRaces.length,
          season: getCurrentSeason(),
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Full error:', error);
        setData(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to fetch F1 data'
        }));
      }
    };

    fetchF1Data();
  }, []);

  return data;
};
