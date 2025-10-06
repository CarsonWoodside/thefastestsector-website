import { useState, useEffect } from 'react';

export const useLiveRaceStatus = () => {
  const [isLiveRace, setIsLiveRace] = useState(false);
  const [liveRaceData, setLiveRaceData] = useState(null);

  useEffect(() => {
    const checkLiveRaceStatus = async () => {
      try {
        // Get current F1 schedule
        const response = await fetch('https://ergast.com/api/f1/current.json');
        const data = await response.json();
        const races = data.MRData?.RaceTable?.Races || [];
        
        const now = new Date();
        const currentRace = races.find(race => {
          const raceDate = new Date(`${race.date}T${race.time || '14:00:00'}`);
          const raceEndTime = new Date(raceDate.getTime() + (2 * 60 * 60 * 1000)); // 2 hours after start
          
          return now >= raceDate && now <= raceEndTime;
        });

        if (currentRace) {
          setIsLiveRace(true);
          setLiveRaceData(currentRace);
        } else {
          setIsLiveRace(false);
          setLiveRaceData(null);
        }
      } catch (error) {
        console.error('Error checking live race status:', error);
        setIsLiveRace(false);
        setLiveRaceData(null);
      }
    };

    checkLiveRaceStatus();
    const interval = setInterval(checkLiveRaceStatus, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  return { isLiveRace, liveRaceData };
};
