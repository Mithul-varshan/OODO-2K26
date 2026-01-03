import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { 
  Plus, 
  Trash2, 
  Calendar, 
  DollarSign, 
  MapPin, 
  ChevronUp, 
  ChevronDown,
  Search,
  X,
  Utensils,
  Camera,
  Mountain,
  Building,
  ShoppingBag,
  Eye,
  Save,
  Clock
} from 'lucide-react';
import Header from '../components/Header';
import { useTrips } from '../context/TripContext';

// Mock city data for search
const mockCities = [
  { id: 1, name: 'Paris', country: 'France', costIndex: '$$$' },
  { id: 2, name: 'Tokyo', country: 'Japan', costIndex: '$$$' },
  { id: 3, name: 'New York', country: 'USA', costIndex: '$$$$' },
  { id: 4, name: 'Bali', country: 'Indonesia', costIndex: '$$' },
  { id: 5, name: 'Rome', country: 'Italy', costIndex: '$$$' },
  { id: 6, name: 'Barcelona', country: 'Spain', costIndex: '$$$' },
  { id: 7, name: 'Bangkok', country: 'Thailand', costIndex: '$' },
  { id: 8, name: 'London', country: 'UK', costIndex: '$$$$' },
];

// Mock activities for each city
const mockActivities = [
  { id: 1, name: 'City Walking Tour', type: 'Sightseeing', cost: 25, icon: 'camera' },
  { id: 2, name: 'Local Food Experience', type: 'Food', cost: 40, icon: 'food' },
  { id: 3, name: 'Museum Visit', type: 'Culture', cost: 20, icon: 'building' },
  { id: 4, name: 'Adventure Hiking', type: 'Adventure', cost: 50, icon: 'mountain' },
  { id: 5, name: 'Shopping Tour', type: 'Shopping', cost: 0, icon: 'shopping' },
  { id: 6, name: 'Fine Dining', type: 'Food', cost: 80, icon: 'food' },
];

const getActivityIcon = (iconType) => {
  switch (iconType) {
    case 'food': return <Utensils className="w-4 h-4" />;
    case 'camera': return <Camera className="w-4 h-4" />;
    case 'mountain': return <Mountain className="w-4 h-4" />;
    case 'building': return <Building className="w-4 h-4" />;
    case 'shopping': return <ShoppingBag className="w-4 h-4" />;
    default: return <Camera className="w-4 h-4" />;
  }
};

const ItineraryBuilder = () => {
  const navigate = useNavigate();
  const { tripId } = useParams();
  const [searchParams] = useSearchParams();
  const { saveItinerary, currentTrip, updateTripItinerary, getTrip, selectTrip } = useTrips();
  
  const [tripName, setTripName] = useState('');
  const [stops, setStops] = useState([]);
  const [showCitySearch, setShowCitySearch] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [showActivityModal, setShowActivityModal] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [editingTripId, setEditingTripId] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [activitySchedule, setActivitySchedule] = useState({ date: '', time: '' });
  const [tripSuggestedActivities, setTripSuggestedActivities] = useState([]);

  // Load trip data when tripId changes or currentTrip is set
  useEffect(() => {
    if (tripId) {
      const trip = getTrip(tripId);
      if (trip) {
        setTripName(trip.name || '');
        setStops(trip.stops || []);
        setEditingTripId(trip.id);
        setTripSuggestedActivities(trip.suggestedActivities || []);
        selectTrip(tripId);
      }
    } else if (currentTrip) {
      setTripName(currentTrip.name || '');
      setStops(currentTrip.stops || []);
      setEditingTripId(currentTrip.id);
      setTripSuggestedActivities(currentTrip.suggestedActivities || []);
    }
  }, [tripId, currentTrip?.id]);

  // Combine mock activities with trip suggested activities
  const allActivities = [
    ...tripSuggestedActivities.map(a => ({ ...a, suggested: true })),
    ...mockActivities.filter(m => !tripSuggestedActivities.some(s => s.name === m.name)),
  ];

  // Filter cities based on search
  const filteredCities = mockCities.filter(
    (city) =>
      city.name.toLowerCase().includes(citySearchQuery.toLowerCase()) ||
      city.country.toLowerCase().includes(citySearchQuery.toLowerCase())
  );

  const addStop = (city) => {
    const newStop = {
      id: Date.now(),
      city: city,
      arrivalDate: '',
      departureDate: '',
      budget: '',
      activities: [],
      notes: '',
    };
    setStops([...stops, newStop]);
    setShowCitySearch(false);
    setCitySearchQuery('');
  };

  const removeStop = (id) => {
    setStops(stops.filter((stop) => stop.id !== id));
  };

  const updateStop = (id, field, value) => {
    setStops(
      stops.map((stop) =>
        stop.id === id ? { ...stop, [field]: value } : stop
      )
    );
  };

  const moveStop = (index, direction) => {
    const newStops = [...stops];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < stops.length) {
      [newStops[index], newStops[newIndex]] = [newStops[newIndex], newStops[index]];
      setStops(newStops);
    }
  };

  const addActivityToStop = (stopId, activity, schedule = {}) => {
    const activityWithSchedule = {
      ...activity,
      assignedId: Date.now(),
      date: schedule.date || '',
      time: schedule.time || '9:00 AM',
    };
    setStops(
      stops.map((stop) =>
        stop.id === stopId
          ? { ...stop, activities: [...stop.activities, activityWithSchedule] }
          : stop
      )
    );
    setShowActivityModal(null);
    setSelectedActivity(null);
    setActivitySchedule({ date: '', time: '' });
  };

  const handleActivitySelect = (activity) => {
    setSelectedActivity(activity);
    // Default to the stop's arrival date if available
    const stop = stops.find(s => s.id === showActivityModal);
    setActivitySchedule({
      date: stop?.arrivalDate || '',
      time: '9:00 AM'
    });
  };

  const confirmAddActivity = () => {
    if (selectedActivity && showActivityModal) {
      addActivityToStop(showActivityModal, selectedActivity, activitySchedule);
    }
  };

  const cancelActivitySelection = () => {
    setSelectedActivity(null);
    setActivitySchedule({ date: '', time: '' });
  };

  const removeActivityFromStop = (stopId, assignedId) => {
    setStops(
      stops.map((stop) =>
        stop.id === stopId
          ? { ...stop, activities: stop.activities.filter((a) => a.assignedId !== assignedId) }
          : stop
      )
    );
  };

  const calculateTotalBudget = () => {
    return stops.reduce((total, stop) => {
      const stopBudget = parseFloat(stop.budget) || 0;
      const activitiesCost = stop.activities.reduce((sum, a) => sum + a.cost, 0);
      return total + stopBudget + activitiesCost;
    }, 0);
  };

  const handleSave = () => {
    if (stops.length === 0) {
      alert('Please add at least one stop to your itinerary');
      return;
    }
    setShowSaveModal(true);
  };

  const confirmSave = () => {
    const name = tripName.trim() || `Trip to ${stops[0]?.city?.name || 'Unknown'}`;
    
    if (editingTripId) {
      // Update existing trip
      updateTripItinerary(editingTripId, stops);
      navigate(`/timeline/${editingTripId}`);
    } else {
      // Save new trip
      const newTrip = saveItinerary(name, stops);
      navigate(`/timeline/${newTrip.id}`);
    }
  };

  const handlePreview = () => {
    if (stops.length === 0) {
      alert('Please add at least one stop to preview');
      return;
    }
    // Save temporarily and preview
    const name = tripName.trim() || `Trip to ${stops[0]?.city?.name || 'Unknown'}`;
    const newTrip = saveItinerary(name, stops);
    navigate(`/timeline/${newTrip.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Build Itinerary
            </h1>
            <p className="text-gray-400 mt-1">Add cities and plan activities for each stop</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-400">Total Budget</p>
              <p className="text-xl font-bold text-green-400">${calculateTotalBudget().toFixed(2)}</p>
            </div>
            <button
              onClick={handlePreview}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Preview</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
          </div>
        </div>

        {/* Stops Container */}
        <div className="space-y-6">
          {stops.length === 0 ? (
            <div className="bg-gray-800 border border-gray-700 border-dashed rounded-xl p-12 text-center">
              <MapPin className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No stops added yet</h3>
              <p className="text-gray-400 mb-6">Start building your itinerary by adding your first destination</p>
              <button
                onClick={() => setShowCitySearch(true)}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Add First Stop</span>
              </button>
            </div>
          ) : (
            stops.map((stop, index) => (
              <div
                key={stop.id}
                className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:border-gray-600 transition-colors"
              >
                {/* Stop Header */}
                <div className="bg-gray-750 border-b border-gray-700 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Reorder Buttons */}
                      <div className="flex flex-col">
                        <button
                          onClick={() => moveStop(index, 'up')}
                          disabled={index === 0}
                          className="p-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => moveStop(index, 'down')}
                          disabled={index === stops.length - 1}
                          className="p-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* Stop Number & City */}
                      <div className="flex items-center space-x-3">
                        <span className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </span>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{stop.city.name}</h3>
                          <p className="text-sm text-gray-400">{stop.city.country} • Cost Index: {stop.city.costIndex}</p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => removeStop(stop.id)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Stop Content */}
                <div className="p-6">
                  {/* Dates and Budget Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    {/* Arrival Date */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Arrival Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="date"
                          value={stop.arrivalDate}
                          onChange={(e) => updateStop(stop.id, 'arrivalDate', e.target.value)}
                          className="w-full pl-10 pr-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition-all [color-scheme:dark]"
                        />
                      </div>
                    </div>

                    {/* Departure Date */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Departure Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="date"
                          value={stop.departureDate}
                          onChange={(e) => updateStop(stop.id, 'departureDate', e.target.value)}
                          className="w-full pl-10 pr-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition-all [color-scheme:dark]"
                        />
                      </div>
                    </div>

                    {/* Budget */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Accommodation Budget</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="number"
                          placeholder="0.00"
                          value={stop.budget}
                          onChange={(e) => updateStop(stop.id, 'budget', e.target.value)}
                          className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="mb-6">
                    <label className="block text-sm text-gray-400 mb-2">Notes</label>
                    <textarea
                      placeholder="Add notes about this stop (hotel details, travel info, etc.)"
                      value={stop.notes}
                      onChange={(e) => updateStop(stop.id, 'notes', e.target.value)}
                      rows={2}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none text-sm"
                    />
                  </div>

                  {/* Activities Section */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm text-gray-400">Activities</label>
                      <button
                        onClick={() => setShowActivityModal(stop.id)}
                        className="flex items-center space-x-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Activity</span>
                      </button>
                    </div>

                    {stop.activities.length === 0 ? (
                      <div className="bg-gray-900 border border-gray-700 border-dashed rounded-lg p-4 text-center">
                        <p className="text-sm text-gray-500">No activities added. Click "Add Activity" to get started.</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {stop.activities
                          .sort((a, b) => {
                            // Sort by date first, then by time
                            if (a.date && b.date && a.date !== b.date) {
                              return new Date(a.date) - new Date(b.date);
                            }
                            return 0;
                          })
                          .map((activity) => (
                          <div
                            key={activity.assignedId}
                            className="flex items-center justify-between bg-gray-900 border border-gray-600 rounded-lg px-3 py-2"
                          >
                            <div className="flex items-center space-x-3">
                              <span className="text-blue-400">{getActivityIcon(activity.icon)}</span>
                              <div>
                                <span className="text-sm text-white">{activity.name}</span>
                                <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                                  {activity.date && (
                                    <span className="flex items-center gap-1">
                                      <Calendar className="w-3 h-3" />
                                      {new Date(activity.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </span>
                                  )}
                                  {activity.time && (
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {activity.time}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-green-400">${activity.cost}</span>
                              <button
                                onClick={() => removeActivityFromStop(stop.id, activity.assignedId)}
                                className="text-gray-400 hover:text-red-400 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Stop Button */}
        {stops.length > 0 && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setShowCitySearch(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-800 border border-gray-600 hover:border-blue-500 text-white rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/10"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add Stop</span>
            </button>
          </div>
        )}

        {/* City Search Modal */}
        {showCitySearch && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-xl w-full max-w-md">
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-white">Select a City</h3>
                <button
                  onClick={() => {
                    setShowCitySearch(false);
                    setCitySearchQuery('');
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-4">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search cities..."
                    value={citySearchQuery}
                    onChange={(e) => setCitySearchQuery(e.target.value)}
                    autoFocus
                    className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>

                <div className="max-h-64 overflow-y-auto space-y-2">
                  {filteredCities.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => addStop(city)}
                      className="w-full flex items-center justify-between p-3 bg-gray-900 hover:bg-gray-700 border border-gray-700 hover:border-blue-500 rounded-lg transition-all text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="text-white font-medium">{city.name}</p>
                          <p className="text-sm text-gray-400">{city.country}</p>
                        </div>
                      </div>
                      <span className="text-sm text-green-400">{city.costIndex}</span>
                    </button>
                  ))}

                  {filteredCities.length === 0 && (
                    <p className="text-center text-gray-500 py-4">No cities found</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Activity Selection Modal */}
        {showActivityModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-xl w-full max-w-md">
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-white">
                  {selectedActivity ? 'Schedule Activity' : 'Select Activity'}
                </h3>
                <button
                  onClick={() => {
                    setShowActivityModal(null);
                    setSelectedActivity(null);
                    setActivitySchedule({ date: '', time: '' });
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {!selectedActivity ? (
                // Step 1: Select Activity
                <div className="p-4 max-h-80 overflow-y-auto space-y-2">
                  {/* Show suggested activities first if any */}
                  {tripSuggestedActivities.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-blue-400 font-medium mb-2 uppercase tracking-wide">
                        ★ Your Selected Activities
                      </p>
                      {tripSuggestedActivities.map((activity) => (
                        <button
                          key={`suggested-${activity.id}`}
                          onClick={() => handleActivitySelect(activity)}
                          className="w-full flex items-center justify-between p-3 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/50 hover:border-blue-500 rounded-lg transition-all text-left mb-2"
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-blue-400">{getActivityIcon(activity.icon)}</span>
                            <div>
                              <p className="text-white font-medium">{activity.name}</p>
                              <p className="text-sm text-gray-400">{activity.type} • {activity.location}</p>
                            </div>
                          </div>
                          <span className="text-sm text-green-400">${activity.cost}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Show all other activities */}
                  <p className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wide">
                    All Activities
                  </p>
                  {mockActivities.map((activity) => (
                    <button
                      key={activity.id}
                      onClick={() => handleActivitySelect(activity)}
                      className="w-full flex items-center justify-between p-3 bg-gray-900 hover:bg-gray-700 border border-gray-700 hover:border-blue-500 rounded-lg transition-all text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-blue-400">{getActivityIcon(activity.icon)}</span>
                        <div>
                          <p className="text-white font-medium">{activity.name}</p>
                          <p className="text-sm text-gray-400">{activity.type}</p>
                        </div>
                      </div>
                      <span className="text-sm text-green-400">${activity.cost}</span>
                    </button>
                  ))}
                </div>
              ) : (
                // Step 2: Schedule Activity
                <div className="p-4">
                  {/* Selected Activity Preview */}
                  <div className="flex items-center space-x-3 p-3 bg-gray-900 border border-blue-500 rounded-lg mb-4">
                    <span className="text-blue-400">{getActivityIcon(selectedActivity.icon)}</span>
                    <div className="flex-1">
                      <p className="text-white font-medium">{selectedActivity.name}</p>
                      <p className="text-sm text-gray-400">{selectedActivity.type}</p>
                    </div>
                    <span className="text-sm text-green-400">${selectedActivity.cost}</span>
                  </div>

                  {/* Date Selection */}
                  <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Date
                    </label>
                    <input
                      type="date"
                      value={activitySchedule.date}
                      onChange={(e) => setActivitySchedule({ ...activitySchedule, date: e.target.value })}
                      min={stops.find(s => s.id === showActivityModal)?.arrivalDate || ''}
                      max={stops.find(s => s.id === showActivityModal)?.departureDate || ''}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-all [color-scheme:dark]"
                    />
                    {stops.find(s => s.id === showActivityModal)?.arrivalDate && (
                      <p className="text-xs text-gray-500 mt-1">
                        Stay: {new Date(stops.find(s => s.id === showActivityModal)?.arrivalDate).toLocaleDateString()} - {new Date(stops.find(s => s.id === showActivityModal)?.departureDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {/* Time Selection */}
                  <div className="mb-6">
                    <label className="block text-sm text-gray-400 mb-2">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Time
                    </label>
                    <select
                      value={activitySchedule.time}
                      onChange={(e) => setActivitySchedule({ ...activitySchedule, time: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-all"
                    >
                      <option value="6:00 AM">6:00 AM</option>
                      <option value="7:00 AM">7:00 AM</option>
                      <option value="8:00 AM">8:00 AM</option>
                      <option value="9:00 AM">9:00 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="12:00 PM">12:00 PM</option>
                      <option value="1:00 PM">1:00 PM</option>
                      <option value="2:00 PM">2:00 PM</option>
                      <option value="3:00 PM">3:00 PM</option>
                      <option value="4:00 PM">4:00 PM</option>
                      <option value="5:00 PM">5:00 PM</option>
                      <option value="6:00 PM">6:00 PM</option>
                      <option value="7:00 PM">7:00 PM</option>
                      <option value="8:00 PM">8:00 PM</option>
                      <option value="9:00 PM">9:00 PM</option>
                      <option value="10:00 PM">10:00 PM</option>
                    </select>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={cancelActivitySelection}
                      className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={confirmAddActivity}
                      className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                    >
                      Add Activity
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Save Trip Modal */}
        {showSaveModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-xl w-full max-w-md">
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-white">Save Itinerary</h3>
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6">
                <label className="block text-sm text-gray-400 mb-2">Trip Name</label>
                <input
                  type="text"
                  value={tripName}
                  onChange={(e) => setTripName(e.target.value)}
                  placeholder={`Trip to ${stops[0]?.city?.name || 'Unknown'}`}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all mb-6"
                />

                <div className="bg-gray-900 rounded-lg p-4 mb-6">
                  <h4 className="text-sm text-gray-400 mb-3">Trip Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Cities:</span>
                      <span className="text-white">{stops.map(s => s.city.name).join(' → ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Stops:</span>
                      <span className="text-white">{stops.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Activities:</span>
                      <span className="text-white">{stops.reduce((sum, s) => sum + s.activities.length, 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Budget:</span>
                      <span className="text-green-400 font-medium">${calculateTotalBudget().toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowSaveModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmSave}
                    className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                  >
                    Save & View Timeline
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ItineraryBuilder;
