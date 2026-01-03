import { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  MapPin, 
  DollarSign, 
  Clock,
  X,
  Edit2,
  ChevronDown,
  ChevronUp,
  List,
  Grid3x3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import Header from '../components/Header';

const GlobalCalendar = () => {
  const navigate = useNavigate();
  const { trips } = useTrips();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [expandedTrips, setExpandedTrips] = useState({});
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'timeline'

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  // Helper to format date as YYYY-MM-DD without timezone issues
  const formatDateString = (year, month, day) => {
    const y = year.toString();
    const m = (month + 1).toString().padStart(2, '0');
    const d = day.toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // Helper to check if a date is within a trip's range and get activities
  const getTripsForDate = (day) => {
    const checkDate = new Date(year, currentDate.getMonth(), day);
    checkDate.setHours(0, 0, 0, 0);
    const dateString = formatDateString(year, currentDate.getMonth(), day);

    return trips.filter(trip => {
      if (!trip.startDate || !trip.endDate) return false;
      const start = new Date(trip.startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(trip.endDate);
      end.setHours(0, 0, 0, 0);
      return checkDate >= start && checkDate <= end;
    }).map(trip => {
      // Get activities for this specific date from stops
      const activitiesForDate = [];
      if (trip.stops && Array.isArray(trip.stops)) {
        trip.stops.forEach(stop => {
          if (stop.activities && Array.isArray(stop.activities)) {
            stop.activities.forEach(activity => {
              if (activity.date === dateString) {
                activitiesForDate.push({
                  ...activity,
                  stopName: stop.city?.name || stop.cityName || stop.city_name
                });
              }
            });
          }
        });
      }
      return { ...trip, activitiesForDate };
    });
  };

  const toggleTripExpansion = (tripId) => {
    setExpandedTrips(prev => ({
      ...prev,
      [tripId]: !prev[tripId]
    }));
  };

  const handleDayClick = (day) => {
    const clickedDate = new Date(year, currentDate.getMonth(), day);
    const dateString = formatDateString(year, currentDate.getMonth(), day);
    const dayTrips = getTripsForDate(day);
    
    if (dayTrips.length > 0) {
      setSelectedDay({
        date: clickedDate,
        dateString,
        trips: dayTrips
      });
    }
  };

  const closeModal = () => {
    setSelectedDay(null);
    setExpandedTrips({});
  };

  const days = [];
  // Add empty cells for padding
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-32 bg-gray-800/50 border border-gray-700/50"></div>);
  }

  // Add actual days
  for (let day = 1; day <= daysInMonth; day++) {
    const dayTrips = getTripsForDate(day);
    const isToday = new Date().toDateString() === new Date(year, currentDate.getMonth(), day).toDateString();

    days.push(
      <div 
        key={day} 
        onClick={() => handleDayClick(day)}
        className={`h-32 border border-gray-700 p-2 relative group transition-colors cursor-pointer ${
          isToday ? 'bg-gray-800/50 hover:bg-gray-800/70' : 'bg-gray-900 hover:bg-gray-800/60'
        } ${dayTrips.length > 0 ? 'hover:border-blue-500/50' : ''}`}
      >
        <div className={`flex justify-between items-start mb-1`}>
          <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${
            isToday ? 'bg-blue-600 text-white' : 'text-gray-400'
          }`}>
            {day}
          </span>
          {dayTrips.some(t => t.activitiesForDate.length > 0) && (
            <span className="text-xs bg-orange-600/30 text-orange-300 px-1.5 py-0.5 rounded-full border border-orange-500/30">
              {dayTrips.reduce((sum, t) => sum + t.activitiesForDate.length, 0)}
            </span>
          )}
        </div>
        
        <div className="space-y-1 overflow-y-auto max-h-[calc(100%-2rem)] custom-scrollbar pointer-events-none">
          {dayTrips.map(trip => {
            // Determine if this is the start, middle, or end of the trip for styling
            const tripStart = new Date(trip.startDate);
            tripStart.setHours(0,0,0,0);
            const tripEnd = new Date(trip.endDate);
            tripEnd.setHours(0,0,0,0);
            const currentDayDate = new Date(year, currentDate.getMonth(), day);
            
            const isStart = tripStart.getTime() === currentDayDate.getTime();
            const isEnd = tripEnd.getTime() === currentDayDate.getTime();
            
            return (
              <div 
                key={trip.id}
                className={`
                  text-xs px-2 py-1 rounded truncate transition-all
                  ${isStart ? 'rounded-l-md ml-0' : '-ml-3 rounded-l-none'}
                  ${isEnd ? 'rounded-r-md mr-0' : '-mr-3 rounded-r-none'}
                  bg-blue-600/20 text-blue-200 border border-blue-500/30
                `}
                title={`${trip.name} (${new Date(trip.startDate).toLocaleDateString()} - ${new Date(trip.endDate).toLocaleDateString()})`}
              >
                {isStart || day === 1 ? trip.name : '\u00A0'}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Get all trips sorted by date for timeline view
  const getAllTripsTimeline = () => {
    return [...trips]
      .filter(trip => trip.startDate && trip.endDate)
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-600/20 rounded-xl">
              <CalendarIcon className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Global Calendar</h1>
              <p className="text-gray-400">View all your trips in one place</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* View Toggle */}
            <div className="flex bg-gray-800 p-1 rounded-lg border border-gray-700">
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-2 rounded-md transition-colors flex items-center space-x-2 ${
                  viewMode === 'calendar' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Grid3x3 className="w-4 h-4" />
                <span className="text-sm">Calendar</span>
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-3 py-2 rounded-md transition-colors flex items-center space-x-2 ${
                  viewMode === 'timeline' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <List className="w-4 h-4" />
                <span className="text-sm">Timeline</span>
              </button>
            </div>

            {/* Month Navigation */}
            {viewMode === 'calendar' && (
              <div className="flex items-center space-x-4 bg-gray-800 p-1 rounded-lg border border-gray-700">
                <button 
                  onClick={prevMonth}
                  className="p-2 hover:bg-gray-700 rounded-md transition-colors text-gray-300 hover:text-white"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-lg font-semibold min-w-[140px] text-center">
                  {monthName} {year}
                </span>
                <button 
                  onClick={nextMonth}
                  className="p-2 hover:bg-gray-700 rounded-md transition-colors text-gray-300 hover:text-white"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {viewMode === 'calendar' ? (
          <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl overflow-hidden">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 border-b border-gray-700 bg-gray-800/50">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="py-3 text-center text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 bg-gray-900">
              {days}
            </div>
          </div>
        ) : (
          /* Timeline View */
          <div className="space-y-6">
            {getAllTripsTimeline().map((trip) => (
              <div key={trip.id} className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg overflow-hidden">
                <div 
                  className="p-6 cursor-pointer hover:bg-gray-800/80 transition-colors"
                  onClick={() => toggleTripExpansion(trip.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-white">{trip.name}</h3>
                        <span className="px-2 py-1 bg-blue-600/20 text-blue-300 text-xs rounded-full border border-blue-500/30">
                          {Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24)) + 1} days
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{trip.destination || 'Multiple destinations'}</span>
                        </span>
                        <span>
                          {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - {new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        {trip.stops && trip.stops.length > 0 && (
                          <span className="flex items-center space-x-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            <span>{trip.stops.length} stops</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                      {expandedTrips[trip.id] ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Daily View */}
                {expandedTrips[trip.id] && trip.stops && (
                  <div className="border-t border-gray-700 bg-gray-900/50">
                    {trip.stops.map((stop, stopIndex) => (
                      <div key={stopIndex} className="border-b border-gray-700/50 last:border-b-0">
                        <div className="p-4 bg-gray-800/30">
                          <div className="flex items-center space-x-2 mb-3">
                            <MapPin className="w-4 h-4 text-blue-400" />
                            <h4 className="font-semibold text-white">
                              {stop.city?.name || stop.cityName || stop.city_name || `Stop ${stopIndex + 1}`}
                            </h4>
                            <span className="text-xs text-gray-500">
                              {stop.arrivalDate && stop.departureDate && (
                                `${new Date(stop.arrivalDate).toLocaleDateString()} - ${new Date(stop.departureDate).toLocaleDateString()}`
                              )}
                            </span>
                          </div>

                          {stop.days && stop.days.length > 0 ? (
                            <div className="space-y-3">
                              {stop.days.map((day, dayIndex) => (
                                <div key={dayIndex} className="pl-6 border-l-2 border-blue-500/30">
                                  <div className="text-sm font-medium text-gray-400 mb-2">
                                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                  </div>
                                  {day.activities && day.activities.length > 0 ? (
                                    <div className="space-y-2">
                                      {day.activities.map((activity, actIndex) => (
                                        <div 
                                          key={actIndex}
                                          className="flex items-start space-x-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-blue-500/30 transition-colors group"
                                        >
                                          <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-1">
                                              <Clock className="w-3 h-3 text-gray-500" />
                                              <span className="text-xs text-gray-500">{activity.time || '9:00 AM'}</span>
                                              <span className="text-sm font-medium text-white">{activity.name}</span>
                                            </div>
                                            {activity.location && (
                                              <div className="flex items-center space-x-1 text-xs text-gray-500 ml-5">
                                                <MapPin className="w-3 h-3" />
                                                <span>{activity.location}</span>
                                              </div>
                                            )}
                                          </div>
                                          {activity.cost > 0 && (
                                            <div className="flex items-center space-x-1 text-xs text-green-400">
                                              <DollarSign className="w-3 h-3" />
                                              <span>{activity.cost}</span>
                                            </div>
                                          )}
                                          <button
                                            onClick={() => navigate(`/itinerary-builder/${trip.id}`)}
                                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-700 rounded transition-all"
                                          >
                                            <Edit2 className="w-3 h-3 text-gray-400" />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-sm text-gray-500 italic">No activities scheduled</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : stop.activities && stop.activities.length > 0 ? (
                            <div className="space-y-2 pl-6">
                              {stop.activities.map((activity, actIndex) => (
                                <div 
                                  key={actIndex}
                                  className="flex items-start space-x-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-blue-500/30 transition-colors group"
                                >
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <span className="text-sm font-medium text-white">{activity.name}</span>
                                    </div>
                                    {activity.location && (
                                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                                        <MapPin className="w-3 h-3" />
                                        <span>{activity.location}</span>
                                      </div>
                                    )}
                                  </div>
                                  {activity.cost > 0 && (
                                    <div className="flex items-center space-x-1 text-xs text-green-400">
                                      <DollarSign className="w-3 h-3" />
                                      <span>{activity.cost}</span>
                                    </div>
                                  )}
                                  <button
                                    onClick={() => navigate(`/itinerary-builder/${trip.id}`)}
                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-700 rounded transition-all"
                                  >
                                    <Edit2 className="w-3 h-3 text-gray-400" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 italic pl-6">No activities planned</p>
                          )}
                        </div>
                      </div>
                    ))}
                    <div className="p-4 bg-gray-800/20 flex justify-end">
                      <button
                        onClick={() => navigate(`/itinerary-builder/${trip.id}`)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center space-x-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span>Edit Itinerary</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {getAllTripsTimeline().length === 0 && (
              <div className="text-center py-16 bg-gray-800 rounded-xl border border-gray-700">
                <CalendarIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No trips scheduled</h3>
                <p className="text-gray-500">Create your first trip to see it here</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Day Detail Modal */}
      {selectedDay && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-700 flex items-center justify-between bg-gradient-to-r from-blue-600/10 to-purple-600/10">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {selectedDay.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  {selectedDay.trips.length} trip{selectedDay.trips.length !== 1 ? 's' : ''} on this day
                </p>
              </div>
              <button 
                onClick={closeModal}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] custom-scrollbar">
              <div className="space-y-6">
                {selectedDay.trips.map(trip => (
                  <div key={trip.id} className="bg-gray-900/50 rounded-xl border border-gray-700/50 overflow-hidden">
                    <div className="p-4 bg-gradient-to-r from-blue-600/5 to-purple-600/5 border-b border-gray-700/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-white">{trip.name}</h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-400 mt-1">
                            <MapPin className="w-4 h-4" />
                            <span>{trip.destination || 'Multiple destinations'}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => navigate(`/itinerary-builder/${trip.id}`)}
                          className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded-lg transition-colors text-sm font-medium"
                        >
                          View Trip
                        </button>
                      </div>
                    </div>

                    {trip.activitiesForDate.length > 0 ? (
                      <div className="p-4 space-y-3">
                        {trip.activitiesForDate
                          .sort((a, b) => (a.time || '9:00 AM').localeCompare(b.time || '9:00 AM'))
                          .map((activity, index) => (
                            <div 
                              key={index}
                              className="flex items-start space-x-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-blue-500/30 transition-colors"
                            >
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <Clock className="w-4 h-4 text-blue-400" />
                                  <span className="text-sm font-medium text-blue-300">{activity.time || '9:00 AM'}</span>
                                </div>
                                <h4 className="font-semibold text-white mb-1">{activity.name}</h4>
                                <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                                  {activity.stopName && (
                                    <span className="flex items-center space-x-1">
                                      <MapPin className="w-3 h-3" />
                                      <span>{activity.stopName}</span>
                                    </span>
                                  )}
                                  {activity.location && (
                                    <span>• {activity.location}</span>
                                  )}
                                  {activity.type && (
                                    <span className="px-2 py-0.5 bg-purple-600/20 text-purple-300 rounded-full border border-purple-500/30">
                                      {activity.type}
                                    </span>
                                  )}
                                </div>
                              </div>
                              {activity.cost > 0 && (
                                <div className="flex items-center space-x-1 text-green-400 font-semibold">
                                  <DollarSign className="w-4 h-4" />
                                  <span>{activity.cost}</span>
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-gray-500">
                        <p className="italic">No activities scheduled for this day</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalCalendar;
