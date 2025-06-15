import { useState, useEffect } from 'react';

export const useLiveRaceStatus = () => {
  const [isRaceActive, setIsRaceActive] = useState(false);
  const [activeRace, setActiveRace] = useState(null);

  useEffect(() => {
    const checkRaceStatus = async () => {
      try {
        // Fetch the entire current season schedule
        const response = await fetch('https://ergast.com/api/f1/current.json');
        const data = await response.json();
        const races = data.MRData.RaceTable.Races;
        
        const now = new Date();
        
        // Find if any race is currently active
        const currentlyActiveRace = races.find(race => {
          if (!race.time) return false;
          
          const raceStartTime = new Date(`${race.date}T${race.time}`);
          const raceEndTime = new Date(raceStartTime.getTime() + 2 * 60 * 60 * 1000); // 2-hour window

          return now >= raceStartTime && now <= raceEndTime;
        });

        if (currentlyActiveRace) {
          setIsRaceActive(true);
          setActiveRace(currentlyActiveRace);
        } else {
          setIsRaceActive(false);
          setActiveRace(null);
        }
      } catch (error) {
        console.error('Failed to fetch race schedule:', error);
        setIsRaceActive(false);
      }
    };

    checkRaceStatus();
    // Check every minute
    const interval = setInterval(checkRaceStatus, 60000);

    return () => clearInterval(interval);
  }, []);

  return { isRaceActive, activeRace };
};
