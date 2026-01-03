import { createContext, useContext, useState, useEffect } from 'react';

const TripContext = createContext();

export const useTrips = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrips must be used within a TripProvider');
  }
  return context;
};

export const TripProvider = ({ children }) => {
  const [trips, setTrips] = useState(() => {
    // Load from localStorage on init
    const saved = localStorage.getItem('globetrotter_trips');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentTrip, setCurrentTrip] = useState(null);

  // Save to localStorage whenever trips change
  useEffect(() => {
    localStorage.setItem('globetrotter_trips', JSON.stringify(trips));
  }, [trips]);

  // Create a new trip (from CreateTrip page)
  const createTrip = (tripData) => {
    // Convert selected activities to the format used in itinerary builder
    const suggestedActivities = (tripData.selectedActivities || []).map(act => ({
      id: act.id,
      name: act.title,
      type: act.type,
      cost: parseInt(act.cost.replace(/[^0-9]/g, '')) || 0,
      icon: act.type === 'Food' ? 'food' : act.type === 'Sightseeing' ? 'camera' : act.type === 'Adventure' ? 'mountain' : act.type === 'Culture' ? 'building' : act.type === 'Leisure' ? 'camera' : 'shopping',
      location: act.location,
    }));

    const newTrip = {
      id: Date.now(),
      name: tripData.tripName || 'Untitled Trip',
      startDate: tripData.startDate,
      endDate: tripData.endDate,
      destination: tripData.selectedPlace,
      coverImage: tripData.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
      budget: tripData.budget || 0,
      stops: [],
      suggestedActivities: suggestedActivities,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTrips([...trips, newTrip]);
    setCurrentTrip(newTrip);
    return newTrip;
  };

  // Update trip with itinerary data (from ItineraryBuilder)
  const updateTripItinerary = (tripId, stops) => {
    // Process stops to create day-wise structure for timeline
    const processedStops = stops.map(stop => {
      // Generate days between arrival and departure
      const days = [];
      if (stop.arrivalDate && stop.departureDate) {
        const start = new Date(stop.arrivalDate);
        const end = new Date(stop.departureDate);
        
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const currentDate = d.toISOString().split('T')[0];
          // Filter activities that are scheduled for this specific date
          const dayActivities = stop.activities
            .filter(act => act.date === currentDate || !act.date)
            .map(act => ({
              ...act,
              time: act.time || '9:00 AM',
            }))
            .sort((a, b) => {
              // Sort by time
              const timeA = a.time || '9:00 AM';
              const timeB = b.time || '9:00 AM';
              return timeA.localeCompare(timeB);
            });
          
          days.push({
            date: currentDate,
            activities: dayActivities
          });
        }
      }

      return {
        ...stop,
        days: days.length > 0 ? days : [{
          date: stop.arrivalDate || new Date().toISOString().split('T')[0],
          activities: stop.activities.map(act => ({ ...act, time: act.time || '9:00 AM' }))
        }]
      };
    });

    setTrips(trips.map(trip => 
      trip.id === tripId 
        ? { 
            ...trip, 
            stops: processedStops,
            updatedAt: new Date().toISOString()
          } 
        : trip
    ));

    // Update currentTrip if it's the one being edited
    if (currentTrip && currentTrip.id === tripId) {
      setCurrentTrip({ ...currentTrip, stops: processedStops });
    }
  };

  // Save complete itinerary as new trip (when building from scratch)
  const saveItinerary = (tripName, stops) => {
    // Calculate trip dates from stops
    const allDates = stops.flatMap(stop => [stop.arrivalDate, stop.departureDate]).filter(Boolean);
    const startDate = allDates.length > 0 ? allDates.sort()[0] : new Date().toISOString().split('T')[0];
    const endDate = allDates.length > 0 ? allDates.sort().pop() : startDate;

    // Process stops for timeline
    const processedStops = stops.map(stop => {
      const days = [];
      if (stop.arrivalDate && stop.departureDate) {
        const start = new Date(stop.arrivalDate);
        const end = new Date(stop.departureDate);
        
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const currentDate = d.toISOString().split('T')[0];
          // Filter activities that are scheduled for this specific date
          const dayActivities = stop.activities
            .filter(act => act.date === currentDate || !act.date)
            .map(act => ({
              ...act,
              time: act.time || '9:00 AM',
            }))
            .sort((a, b) => {
              const timeA = a.time || '9:00 AM';
              const timeB = b.time || '9:00 AM';
              return timeA.localeCompare(timeB);
            });
          
          days.push({
            date: currentDate,
            activities: dayActivities
          });
        }
      }

      return {
        ...stop,
        days: days.length > 0 ? days : [{
          date: stop.arrivalDate || new Date().toISOString().split('T')[0],
          activities: stop.activities.map(act => ({ ...act, time: act.time || '9:00 AM' }))
        }]
      };
    });

    const newTrip = {
      id: Date.now(),
      name: tripName || `Trip to ${stops[0]?.city?.name || 'Unknown'}`,
      startDate,
      endDate,
      coverImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
      stops: processedStops,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTrips([...trips, newTrip]);
    setCurrentTrip(newTrip);
    return newTrip;
  };

  // Get a trip by ID
  const getTrip = (tripId) => {
    return trips.find(trip => trip.id === parseInt(tripId));
  };

  // Delete a trip
  const deleteTrip = (tripId) => {
    setTrips(trips.filter(trip => trip.id !== tripId));
    if (currentTrip && currentTrip.id === tripId) {
      setCurrentTrip(null);
    }
  };

  // Update trip budget
  const updateTripBudget = (tripId, budget) => {
    setTrips(trips.map(trip => 
      trip.id === tripId 
        ? { ...trip, budget, updatedAt: new Date().toISOString() }
        : trip
    ));
    if (currentTrip && currentTrip.id === tripId) {
      setCurrentTrip({ ...currentTrip, budget });
    }
  };

  // Set current trip for editing
  const selectTrip = (tripId) => {
    const trip = trips.find(t => t.id === parseInt(tripId));
    setCurrentTrip(trip || null);
    return trip;
  };

  return (
    <TripContext.Provider value={{
      trips,
      currentTrip,
      setCurrentTrip,
      createTrip,
      updateTripItinerary,
      saveItinerary,
      getTrip,
      deleteTrip,
      selectTrip,
      updateTripBudget,
    }}>
      {children}
    </TripContext.Provider>
  );
};

export default TripContext;
