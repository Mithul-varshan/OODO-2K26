import { createContext, useContext, useState, useEffect } from 'react';

const TripContext = createContext();

const API_BASE_URL = 'http://localhost:5000/api';

export const useTrips = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrips must be used within a TripProvider');
  }
  return context;
};

export const TripProvider = ({ children }) => {
  const [trips, setTrips] = useState([]);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load trips from backend on mount
  useEffect(() => {
    fetchTrips();
  }, []);

  // Load trips from backend on mount
  useEffect(() => {
    fetchTrips();
  }, []);

  // Fetch all trips from backend
  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/trips`);
      if (!response.ok) throw new Error('Failed to fetch trips');
      const data = await response.json();
      
      // Transform backend data to match frontend format
      const transformedTrips = data.map(trip => {
        const transformed = transformTripFromBackend(trip);
        // Process stops for timeline view
        return {
          ...transformed,
          stops: processStopsForTimeline(transformed.stops)
        };
      });
      setTrips(transformedTrips);
      setError(null);
    } catch (err) {
      console.error('Error fetching trips:', err);
      setError(err.message);
      // Fallback to localStorage if backend is unavailable
      const saved = localStorage.getItem('globetrotter_trips');
      if (saved) {
        setTrips(JSON.parse(saved));
      }
    } finally {
      setLoading(false);
    }
  };

  // Transform trip from backend format to frontend format
  const transformTripFromBackend = (trip) => {
    return {
      id: trip.id,
      name: trip.name,
      startDate: trip.start_date,
      endDate: trip.end_date,
      destination: trip.destination,
      coverImage: trip.cover_image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
      budget: parseFloat(trip.budget) || 0,
      stops: (trip.stops || []).map(stop => ({
        id: stop.id,
        city: {
          name: stop.city_name,
          country: stop.city_country,
          latitude: stop.city_lat,
          longitude: stop.city_lng
        },
        cityName: stop.city_name,
        arrivalDate: stop.arrival_date,
        departureDate: stop.departure_date,
        notes: stop.notes,
        activities: (stop.activities || []).map(activity => ({
          id: activity.id,
          name: activity.name,
          type: activity.type,
          cost: parseFloat(activity.cost) || 0,
          icon: activity.icon,
          location: activity.location,
          date: activity.date,
          time: activity.time,
          notes: activity.notes,
          isCustom: activity.is_custom
        }))
      })),
      selectedActivities: trip.selectedActivities || [],
      suggestedActivities: trip.selectedActivities || [],
      createdAt: trip.created_at,
      updatedAt: trip.updated_at
    };
  };

  // Process stops to create day-wise structure for timeline view
  const processStopsForTimeline = (stops) => {
    return stops.map(stop => {
      const days = [];
      if (stop.arrivalDate && stop.departureDate) {
        const start = new Date(stop.arrivalDate + 'T12:00:00Z');
        const end = new Date(stop.departureDate + 'T12:00:00Z');
        
        for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
          const currentDate = d.toISOString().split('T')[0];
          const dayActivities = (stop.activities || [])
            .filter(act => {
              if (!act.date) return false;
              return act.date === currentDate;
            })
            .map(act => ({ ...act, time: act.time || '9:00 AM' }))
            .sort((a, b) => (a.time || '9:00 AM').localeCompare(b.time || '9:00 AM'));
          
          days.push({ date: currentDate, activities: dayActivities });
        }
      }

      return { 
        ...stop, 
        days: days.length > 0 
          ? days 
          : [{ 
              date: stop.arrivalDate, 
              activities: (stop.activities || []).map(act => ({ ...act, time: act.time || '9:00 AM' })) 
            }] 
      };
    });
  };

  // Create a new trip (from CreateTrip page)
  const createTrip = async (tripData) => {
    try {
      // Convert selected activities to the format used in itinerary builder
      const suggestedActivities = (tripData.selectedActivities || []).map(act => ({
        title: act.title,
        name: act.title,
        type: act.type,
        cost: act.cost,
        icon: act.type === 'Food' ? 'food' : act.type === 'Sightseeing' ? 'camera' : act.type === 'Adventure' ? 'mountain' : act.type === 'Culture' ? 'building' : act.type === 'Leisure' ? 'camera' : 'shopping',
        location: act.location,
        image: act.image
      }));

      const payload = {
        tripName: tripData.tripName || 'Untitled Trip',
        startDate: tripData.startDate,
        endDate: tripData.endDate,
        selectedPlace: tripData.selectedPlace,
        budget: parseFloat(tripData.budget) || 0,
        stops: [],
        selectedActivities: suggestedActivities
      };

      const response = await fetch(`${API_BASE_URL}/trips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to create trip');
      
      const createdTrip = await response.json();
      const transformedTrip = transformTripFromBackend(createdTrip);
      
      setTrips([...trips, transformedTrip]);
      setCurrentTrip(transformedTrip);
      
      // Also save to localStorage as backup
      localStorage.setItem('globetrotter_trips', JSON.stringify([...trips, transformedTrip]));
      
      return transformedTrip;
    } catch (err) {
      console.error('Error creating trip:', err);
      // Fallback to localStorage
      const newTrip = {
        id: Date.now(),
        name: tripData.tripName || 'Untitled Trip',
        startDate: tripData.startDate,
        endDate: tripData.endDate,
        destination: tripData.selectedPlace,
        coverImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
        budget: parseFloat(tripData.budget) || 0,
        stops: [],
        suggestedActivities: tripData.selectedActivities || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setTrips([...trips, newTrip]);
      setCurrentTrip(newTrip);
      localStorage.setItem('globetrotter_trips', JSON.stringify([...trips, newTrip]));
      return newTrip;
    }
  };

  // Update trip with itinerary data (from ItineraryBuilder)
  const updateTripItinerary = async (tripId, stops) => {
    try {
      // Get the trip to maintain other properties
      const trip = trips.find(t => t.id === tripId);
      if (!trip) throw new Error('Trip not found');

      const payload = {
        name: trip.name,
        startDate: trip.startDate,
        endDate: trip.endDate,
        budget: trip.budget,
        stops: stops
      };

      const response = await fetch(`${API_BASE_URL}/trips/${tripId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to update trip');
      
      const updatedTrip = await response.json();
      const transformedTrip = transformTripFromBackend(updatedTrip);

      // Process stops to create day-wise structure for timeline
      const processedStops = processStopsForTimeline(transformedTrip.stops);

      const finalTrip = { ...transformedTrip, stops: processedStops };

      setTrips(trips.map(t => t.id === tripId ? finalTrip : t));
      if (currentTrip && currentTrip.id === tripId) {
        setCurrentTrip(finalTrip);
      }

      // Backup to localStorage
      localStorage.setItem('globetrotter_trips', JSON.stringify(trips.map(t => t.id === tripId ? finalTrip : t)));
    } catch (err) {
      console.error('Error updating trip:', err);
      // Fallback to local update
      const processedStops = processStopsForTimeline(stops);

      setTrips(trips.map(trip => 
        trip.id === tripId 
          ? { ...trip, stops: processedStops, updatedAt: new Date().toISOString() } 
          : trip
      ));

      if (currentTrip && currentTrip.id === tripId) {
        setCurrentTrip({ ...currentTrip, stops: processedStops });
      }

      localStorage.setItem('globetrotter_trips', JSON.stringify(trips.map(trip => 
        trip.id === tripId ? { ...trip, stops: processedStops } : trip
      )));
    }
  };

  // Save complete itinerary as new trip (when building from scratch)
  const saveItinerary = async (tripName, stops) => {
    try {
      // Calculate trip dates from stops
      const allDates = stops.flatMap(stop => [stop.arrivalDate, stop.departureDate]).filter(Boolean);
      const startDate = allDates.length > 0 ? allDates.sort()[0] : new Date().toISOString().split('T')[0];
      const endDate = allDates.length > 0 ? allDates.sort().pop() : startDate;

      const payload = {
        tripName: tripName || `Trip to ${stops[0]?.city?.name || 'Unknown'}`,
        name: tripName || `Trip to ${stops[0]?.city?.name || 'Unknown'}`,
        startDate,
        endDate,
        selectedPlace: stops[0]?.city?.name || '',
        budget: 0,
        stops: stops
      };

      const response = await fetch(`${API_BASE_URL}/trips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to save itinerary');
      
      const createdTrip = await response.json();
      const transformedTrip = transformTripFromBackend(createdTrip);

      // Process stops for timeline
      const processedStops = processStopsForTimeline(transformedTrip.stops);

      const finalTrip = { ...transformedTrip, stops: processedStops };

      setTrips([...trips, finalTrip]);
      setCurrentTrip(finalTrip);
      
      // Backup to localStorage
      localStorage.setItem('globetrotter_trips', JSON.stringify([...trips, finalTrip]));
      
      return finalTrip;
    } catch (err) {
      console.error('Error saving itinerary:', err);
      // Fallback to localStorage
      const allDates = stops.flatMap(stop => [stop.arrivalDate, stop.departureDate]).filter(Boolean);
      const startDate = allDates.length > 0 ? allDates.sort()[0] : new Date().toISOString().split('T')[0];
      const endDate = allDates.length > 0 ? allDates.sort().pop() : startDate;

      const processedStops = processStopsForTimeline(stops);

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
      localStorage.setItem('globetrotter_trips', JSON.stringify([...trips, newTrip]));
      return newTrip;
    }
  };

  // Get a trip by ID
  const getTrip = (tripId) => {
    return trips.find(trip => trip.id === parseInt(tripId));
  };

  // Delete a trip
  const deleteTrip = async (tripId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/trips/${tripId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete trip');

      setTrips(trips.filter(trip => trip.id !== tripId));
      if (currentTrip && currentTrip.id === tripId) {
        setCurrentTrip(null);
      }

      // Update localStorage
      localStorage.setItem('globetrotter_trips', JSON.stringify(trips.filter(trip => trip.id !== tripId)));
    } catch (err) {
      console.error('Error deleting trip:', err);
      // Fallback to local delete
      setTrips(trips.filter(trip => trip.id !== tripId));
      if (currentTrip && currentTrip.id === tripId) {
        setCurrentTrip(null);
      }
      localStorage.setItem('globetrotter_trips', JSON.stringify(trips.filter(trip => trip.id !== tripId)));
    }
  };

  // Update trip budget
  const updateTripBudget = async (tripId, budget) => {
    try {
      const response = await fetch(`${API_BASE_URL}/trips/${tripId}/budget`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ budget })
      });

      if (!response.ok) throw new Error('Failed to update budget');

      const updatedTrip = await response.json();

      setTrips(trips.map(trip => 
        trip.id === tripId 
          ? { ...trip, budget: parseFloat(budget), updatedAt: new Date().toISOString() }
          : trip
      ));
      
      if (currentTrip && currentTrip.id === tripId) {
        setCurrentTrip({ ...currentTrip, budget: parseFloat(budget) });
      }

      // Update localStorage
      localStorage.setItem('globetrotter_trips', JSON.stringify(trips.map(trip => 
        trip.id === tripId ? { ...trip, budget: parseFloat(budget) } : trip
      )));
    } catch (err) {
      console.error('Error updating budget:', err);
      // Fallback to local update
      setTrips(trips.map(trip => 
        trip.id === tripId 
          ? { ...trip, budget: parseFloat(budget), updatedAt: new Date().toISOString() }
          : trip
      ));
      if (currentTrip && currentTrip.id === tripId) {
        setCurrentTrip({ ...currentTrip, budget: parseFloat(budget) });
      }
      localStorage.setItem('globetrotter_trips', JSON.stringify(trips.map(trip => 
        trip.id === tripId ? { ...trip, budget: parseFloat(budget) } : trip
      )));
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
      loading,
      error,
      setCurrentTrip,
      createTrip,
      updateTripItinerary,
      saveItinerary,
      getTrip,
      deleteTrip,
      selectTrip,
      updateTripBudget,
      fetchTrips,
    }}>
      {children}
    </TripContext.Provider>
  );
};

export default TripContext;
