import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  Calendar, 
  List, 
  MapPin, 
  Clock, 
  DollarSign,
  Utensils,
  Camera,
  Mountain,
  Building,
  ShoppingBag,
  Plane,
  Hotel,
  Coffee,
  Edit,
  Share2,
  ArrowLeft
} from 'lucide-react';
import Header from '../components/Header';
import { useTrips } from '../context/TripContext';

// Mock trip data - in real app, this would come from API/state
const mockTripData = {
  id: 1,
  name: 'European Adventure',
  startDate: '2026-02-15',
  endDate: '2026-02-25',
  stops: [
    {
      id: 1,
      city: { name: 'Paris', country: 'France' },
      arrivalDate: '2026-02-15',
      departureDate: '2026-02-18',
      days: [
        {
          date: '2026-02-15',
          activities: [
            { id: 1, name: 'Arrive at CDG Airport', time: '10:00 AM', type: 'Transport', cost: 0, icon: 'plane' },
            { id: 2, name: 'Check-in Hotel Le Marais', time: '2:00 PM', type: 'Accommodation', cost: 150, icon: 'hotel' },
            { id: 3, name: 'Evening Walk at Seine', time: '6:00 PM', type: 'Sightseeing', cost: 0, icon: 'camera' },
          ]
        },
        {
          date: '2026-02-16',
          activities: [
            { id: 4, name: 'Breakfast at Café de Flore', time: '9:00 AM', type: 'Food', cost: 25, icon: 'coffee' },
            { id: 5, name: 'Eiffel Tower Visit', time: '11:00 AM', type: 'Sightseeing', cost: 30, icon: 'camera' },
            { id: 6, name: 'Lunch at Local Bistro', time: '1:30 PM', type: 'Food', cost: 40, icon: 'food' },
            { id: 7, name: 'Louvre Museum', time: '3:00 PM', type: 'Culture', cost: 20, icon: 'building' },
          ]
        },
        {
          date: '2026-02-17',
          activities: [
            { id: 8, name: 'Montmartre Walking Tour', time: '10:00 AM', type: 'Sightseeing', cost: 35, icon: 'camera' },
            { id: 9, name: 'Shopping at Champs-Élysées', time: '2:00 PM', type: 'Shopping', cost: 100, icon: 'shopping' },
            { id: 10, name: 'Fine Dining Experience', time: '8:00 PM', type: 'Food', cost: 120, icon: 'food' },
          ]
        },
        {
          date: '2026-02-18',
          activities: [
            { id: 11, name: 'Check-out & Travel to Rome', time: '10:00 AM', type: 'Transport', cost: 150, icon: 'plane' },
          ]
        },
      ]
    },
    {
      id: 2,
      city: { name: 'Rome', country: 'Italy' },
      arrivalDate: '2026-02-18',
      departureDate: '2026-02-22',
      days: [
        {
          date: '2026-02-18',
          activities: [
            { id: 12, name: 'Arrive in Rome', time: '2:00 PM', type: 'Transport', cost: 0, icon: 'plane' },
            { id: 13, name: 'Check-in Hotel Roma', time: '4:00 PM', type: 'Accommodation', cost: 120, icon: 'hotel' },
            { id: 14, name: 'Trastevere Evening Walk', time: '7:00 PM', type: 'Sightseeing', cost: 0, icon: 'camera' },
          ]
        },
        {
          date: '2026-02-19',
          activities: [
            { id: 15, name: 'Colosseum Tour', time: '9:00 AM', type: 'Sightseeing', cost: 45, icon: 'building' },
            { id: 16, name: 'Roman Forum', time: '12:00 PM', type: 'Sightseeing', cost: 0, icon: 'building' },
            { id: 17, name: 'Authentic Italian Lunch', time: '1:30 PM', type: 'Food', cost: 35, icon: 'food' },
            { id: 18, name: 'Trevi Fountain & Spanish Steps', time: '4:00 PM', type: 'Sightseeing', cost: 0, icon: 'camera' },
          ]
        },
        {
          date: '2026-02-20',
          activities: [
            { id: 19, name: 'Vatican City Tour', time: '8:00 AM', type: 'Culture', cost: 60, icon: 'building' },
            { id: 20, name: 'St. Peters Basilica', time: '12:00 PM', type: 'Culture', cost: 0, icon: 'building' },
            { id: 21, name: 'Gelato Tasting Tour', time: '3:00 PM', type: 'Food', cost: 25, icon: 'food' },
          ]
        },
        {
          date: '2026-02-21',
          activities: [
            { id: 22, name: 'Day Trip to Pompeii', time: '7:00 AM', type: 'Adventure', cost: 80, icon: 'mountain' },
            { id: 23, name: 'Return to Rome', time: '6:00 PM', type: 'Transport', cost: 0, icon: 'plane' },
          ]
        },
        {
          date: '2026-02-22',
          activities: [
            { id: 24, name: 'Check-out & Travel to Barcelona', time: '9:00 AM', type: 'Transport', cost: 120, icon: 'plane' },
          ]
        },
      ]
    },
    {
      id: 3,
      city: { name: 'Barcelona', country: 'Spain' },
      arrivalDate: '2026-02-22',
      departureDate: '2026-02-25',
      days: [
        {
          date: '2026-02-22',
          activities: [
            { id: 25, name: 'Arrive in Barcelona', time: '1:00 PM', type: 'Transport', cost: 0, icon: 'plane' },
            { id: 26, name: 'Check-in Hotel Barcelona', time: '3:00 PM', type: 'Accommodation', cost: 130, icon: 'hotel' },
            { id: 27, name: 'La Rambla Evening Stroll', time: '7:00 PM', type: 'Sightseeing', cost: 0, icon: 'camera' },
          ]
        },
        {
          date: '2026-02-23',
          activities: [
            { id: 28, name: 'Sagrada Familia', time: '9:00 AM', type: 'Sightseeing', cost: 35, icon: 'building' },
            { id: 29, name: 'Park Güell', time: '1:00 PM', type: 'Sightseeing', cost: 15, icon: 'camera' },
            { id: 30, name: 'Tapas Tour', time: '7:00 PM', type: 'Food', cost: 50, icon: 'food' },
          ]
        },
        {
          date: '2026-02-24',
          activities: [
            { id: 31, name: 'Beach Day at Barceloneta', time: '10:00 AM', type: 'Leisure', cost: 0, icon: 'camera' },
            { id: 32, name: 'Gothic Quarter Exploration', time: '3:00 PM', type: 'Sightseeing', cost: 0, icon: 'building' },
            { id: 33, name: 'Farewell Dinner', time: '8:00 PM', type: 'Food', cost: 80, icon: 'food' },
          ]
        },
        {
          date: '2026-02-25',
          activities: [
            { id: 34, name: 'Departure from Barcelona', time: '11:00 AM', type: 'Transport', cost: 0, icon: 'plane' },
          ]
        },
      ]
    },
  ]
};

const getActivityIcon = (iconType) => {
  const iconClass = "w-4 h-4";
  switch (iconType) {
    case 'food': return <Utensils className={iconClass} />;
    case 'camera': return <Camera className={iconClass} />;
    case 'mountain': return <Mountain className={iconClass} />;
    case 'building': return <Building className={iconClass} />;
    case 'shopping': return <ShoppingBag className={iconClass} />;
    case 'plane': return <Plane className={iconClass} />;
    case 'hotel': return <Hotel className={iconClass} />;
    case 'coffee': return <Coffee className={iconClass} />;
    default: return <Camera className={iconClass} />;
  }
};

const getTypeColor = (type) => {
  switch (type) {
    case 'Transport': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    case 'Accommodation': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'Sightseeing': return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'Food': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    case 'Culture': return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
    case 'Shopping': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'Adventure': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'Leisure': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

const getDayNumber = (startDate, currentDate) => {
  const start = new Date(startDate);
  const current = new Date(currentDate);
  const diffTime = Math.abs(current - start);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1;
};

const TimelineView = () => {
  const navigate = useNavigate();
  const { tripId } = useParams();
  const { getTrip, trips } = useTrips();
  
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [selectedCity, setSelectedCity] = useState('all');
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    if (tripId) {
      const foundTrip = getTrip(tripId);
      setTrip(foundTrip);
    } else if (trips.length > 0) {
      // Show most recent trip if no ID provided
      setTrip(trips[trips.length - 1]);
    }
  }, [tripId, trips, getTrip]);

  // Show empty state if no trip
  if (!trip) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <MapPin className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">No Trip Found</h2>
          <p className="text-gray-400 mb-6">
            {trips.length === 0 
              ? "You haven't created any trips yet. Start by building an itinerary!"
              : "The trip you're looking for doesn't exist."}
          </p>
          <Link
            to="/itinerary-builder"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Build an Itinerary
          </Link>
        </main>
      </div>
    );
  }

  // Process stops to get all days
  const allDays = trip.stops?.flatMap(stop => 
    (stop.days || []).map(day => ({
      ...day,
      city: stop.city,
      stopId: stop.id
    }))
  ) || [];

  // Filter by city if selected
  const filteredDays = selectedCity === 'all' 
    ? allDays 
    : allDays.filter(day => day.city?.name === selectedCity);

  // Calculate totals
  const totalCost = allDays.reduce((total, day) => 
    total + (day.activities || []).reduce((sum, act) => sum + (act.cost || 0), 0), 0
  );

  const totalDays = allDays.length || 1;
  const totalActivities = allDays.reduce((sum, day) => sum + (day.activities?.length || 0), 0);

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Trip Header */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                {trip.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-400">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {trip.startDate && trip.endDate 
                    ? `${formatDate(trip.startDate)} - ${formatDate(trip.endDate)}`
                    : 'Dates not set'}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {trip.stops?.length || 0} cities
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Stats */}
              <div className="flex items-center gap-6 mr-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{totalDays}</p>
                  <p className="text-xs text-gray-400">Days</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{totalActivities}</p>
                  <p className="text-xs text-gray-400">Activities</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-400">${totalCost}</p>
                  <p className="text-xs text-gray-400">Total Cost</p>
                </div>
              </div>

              <Link
                to="/itinerary-builder"
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span className="hidden sm:inline">Edit</span>
              </Link>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          {/* City Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            <button
              onClick={() => setSelectedCity('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                selectedCity === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              All Cities
            </button>
            {(trip.stops || []).map(stop => (
              <button
                key={stop.id}
                onClick={() => setSelectedCity(stop.city?.name)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCity === stop.city?.name
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {stop.city?.name}
              </button>
            ))}
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">List</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === 'calendar'
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Calendar</span>
            </button>
          </div>
        </div>

        {/* Timeline Content */}
        {viewMode === 'list' ? (
          /* List View */
          <div className="space-y-6">
            {filteredDays.length === 0 ? (
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center">
                <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No days in this itinerary</h3>
                <p className="text-gray-400">Add stops with dates to see them here.</p>
              </div>
            ) : (
            filteredDays.map((day, dayIndex) => {
              const dayNumber = getDayNumber(trip.startDate || day.date, day.date);
              const isNewCity = dayIndex === 0 || filteredDays[dayIndex - 1]?.city?.name !== day.city?.name;
              const activities = day.activities || [];

              return (
                <div key={`${day.date}-${day.city?.name}-${dayIndex}`}>
                  {/* City Header */}
                  {isNewCity && day.city && (
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 rounded-lg">
                        <MapPin className="w-5 h-5 text-white" />
                        <span className="text-lg font-bold text-white">{day.city.name}</span>
                        <span className="text-blue-200 text-sm">{day.city.country}</span>
                      </div>
                      <div className="flex-1 h-px bg-gray-700"></div>
                    </div>
                  )}

                  {/* Day Card */}
                  <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                    {/* Day Header */}
                    <div className="bg-gray-750 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                          <span className="text-lg font-bold text-white">{dayNumber}</span>
                        </div>
                        <div>
                          <p className="text-white font-semibold">{formatDate(day.date)}</p>
                          <p className="text-sm text-gray-400">Day {dayNumber} in {day.city?.name || 'Unknown'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">{activities.length} activities</p>
                        <p className="text-green-400 font-medium">
                          ${activities.reduce((sum, a) => sum + (a.cost || 0), 0)}
                        </p>
                      </div>
                    </div>

                    {/* Activities */}
                    <div className="p-6">
                      {activities.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No activities planned for this day</p>
                      ) : (
                      <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-700"></div>

                        <div className="space-y-4">
                          {activities.map((activity, actIndex) => (
                            <div key={activity.id || actIndex} className="flex items-start gap-4 relative">
                              {/* Timeline Dot */}
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 ${getTypeColor(activity.type)} border`}>
                                {getActivityIcon(activity.icon)}
                              </div>

                              {/* Activity Content */}
                              <div className="flex-1 bg-gray-900 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors">
                                <div className="flex items-start justify-between gap-4">
                                  <div>
                                    <h4 className="text-white font-medium">{activity.name}</h4>
                                    <div className="flex items-center gap-3 mt-1">
                                      <span className="flex items-center gap-1 text-sm text-gray-400">
                                        <Clock className="w-3 h-3" />
                                        {activity.time || '9:00 AM'}
                                      </span>
                                      <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor(activity.type)}`}>
                                        {activity.type}
                                      </span>
                                    </div>
                                  </div>
                                  {activity.cost > 0 && (
                                    <span className="flex items-center gap-1 text-green-400 font-medium">
                                      <DollarSign className="w-4 h-4" />
                                      {activity.cost}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
            )}
          </div>
        ) : (
          /* Calendar View */
          <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
            <div className="grid grid-cols-7 border-b border-gray-700">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-3 text-center text-sm font-medium text-gray-400 border-r border-gray-700 last:border-r-0">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {/* Generate calendar grid */}
              {(() => {
                if (!trip.startDate || !trip.endDate) {
                  return (
                    <div className="col-span-7 p-8 text-center text-gray-500">
                      No dates set for this trip
                    </div>
                  );
                }

                const startDate = new Date(trip.startDate);
                const endDate = new Date(trip.endDate);
                const calendarStart = new Date(startDate);
                calendarStart.setDate(startDate.getDate() - startDate.getDay());

                const calendarEnd = new Date(endDate);
                calendarEnd.setDate(endDate.getDate() + (6 - endDate.getDay()));

                const days = [];
                const current = new Date(calendarStart);

                while (current <= calendarEnd) {
                  const dateStr = current.toISOString().split('T')[0];
                  const dayData = allDays.find(d => d.date === dateStr);
                  const isInTrip = current >= startDate && current <= endDate;

                  days.push(
                    <div
                      key={dateStr}
                      className={`min-h-28 p-2 border-r border-b border-gray-700 last:border-r-0 ${
                        isInTrip ? 'bg-gray-800' : 'bg-gray-900/50'
                      }`}
                    >
                      <p className={`text-sm mb-2 ${isInTrip ? 'text-white' : 'text-gray-600'}`}>
                        {current.getDate()}
                      </p>
                      {dayData && (
                        <div className="space-y-1">
                          <span className="inline-block text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full truncate max-w-full">
                            {dayData.city?.name}
                          </span>
                          <p className="text-xs text-gray-400">
                            {(dayData.activities || []).length} activities
                          </p>
                        </div>
                      )}
                    </div>
                  );

                  current.setDate(current.getDate() + 1);
                }

                return days;
              })()}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TimelineView;
