import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Search, ArrowRight, Check, Plus, X, Loader2 } from 'lucide-react';
import Header from '../components/Header';
import { useTrips } from '../context/TripContext';

// Curated suggestions for popular places and activities
const suggestedActivities = [
  // Iconic Landmarks
  {
    id: 1,
    title: 'Eiffel Tower Visit',
    location: 'Paris, France',
    image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: 'Sightseeing',
    cost: '$30',
  },
  {
    id: 2,
    title: 'Colosseum Tour',
    location: 'Rome, Italy',
    image: 'https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: 'Sightseeing',
    cost: '$25',
  },
  {
    id: 3,
    title: 'Machu Picchu Trek',
    location: 'Cusco, Peru',
    image: 'https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: 'Adventure',
    cost: '$75',
  },
  // Food Experiences
  {
    id: 4,
    title: 'Street Food Tour',
    location: 'Bangkok, Thailand',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: 'Food',
    cost: '$40',
  },
  {
    id: 5,
    title: 'Sushi Making Class',
    location: 'Tokyo, Japan',
    image: 'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: 'Food',
    cost: '$85',
  },
  {
    id: 6,
    title: 'Wine Tasting Tour',
    location: 'Tuscany, Italy',
    image: 'https://images.pexels.com/photos/1123260/pexels-photo-1123260.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: 'Food',
    cost: '$60',
  },
  // Beach & Nature
  {
    id: 7,
    title: 'Beach Day & Snorkeling',
    location: 'Bali, Indonesia',
    image: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: 'Adventure',
    cost: '$45',
  },
  {
    id: 8,
    title: 'Northern Lights Tour',
    location: 'Reykjavik, Iceland',
    image: 'https://images.pexels.com/photos/1933239/pexels-photo-1933239.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: 'Adventure',
    cost: '$120',
  },
  {
    id: 9,
    title: 'Safari Adventure',
    location: 'Serengeti, Tanzania',
    image: 'https://images.pexels.com/photos/631317/pexels-photo-631317.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: 'Adventure',
    cost: '$200',
  },
  // Culture
  {
    id: 10,
    title: 'Louvre Museum',
    location: 'Paris, France',
    image: 'https://images.pexels.com/photos/2363/france-landmark-lights-night.jpg?auto=compress&cs=tinysrgb&w=400',
    type: 'Culture',
    cost: '$20',
  },
  {
    id: 11,
    title: 'Flamenco Show',
    location: 'Seville, Spain',
    image: 'https://images.pexels.com/photos/2188012/pexels-photo-2188012.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: 'Culture',
    cost: '$35',
  },
  {
    id: 12,
    title: 'Traditional Tea Ceremony',
    location: 'Kyoto, Japan',
    image: 'https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: 'Culture',
    cost: '$50',
  },
];

const CreateTrip = () => {
  const navigate = useNavigate();
  const { createTrip } = useTrips();
  const [formData, setFormData] = useState({
    tripName: '',
    startDate: '',
    endDate: '',
    selectedPlace: '',
  });
  const [isCreating, setIsCreating] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState([]);
  
  // City search state
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [cityResults, setCityResults] = useState([]);
  const [isSearchingCities, setIsSearchingCities] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const searchTimeoutRef = useRef(null);

  // Search cities using Open-Meteo Geocoding API (free, no API key required)
  const searchCities = async (query) => {
    if (query.length < 2) {
      setCityResults([]);
      return;
    }
    
    setIsSearchingCities(true);
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=en&format=json`
      );
      const data = await response.json();
      
      if (data.results) {
        setCityResults(data.results.map(city => ({
          id: city.id,
          name: city.name,
          country: city.country || '',
          admin1: city.admin1 || '', // State/Region
          latitude: city.latitude,
          longitude: city.longitude,
          displayName: `${city.name}${city.admin1 ? `, ${city.admin1}` : ''}, ${city.country || ''}`
        })));
      } else {
        setCityResults([]);
      }
    } catch (error) {
      console.error('Error searching cities:', error);
      setCityResults([]);
    } finally {
      setIsSearchingCities(false);
    }
  };

  // Debounced city search
  const handleCitySearch = (e) => {
    const query = e.target.value;
    setCitySearchQuery(query);
    setFormData(prev => ({ ...prev, selectedPlace: query }));
    setShowCityDropdown(true);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      searchCities(query);
    }, 300);
  };

  const selectCity = (city) => {
    setFormData(prev => ({ ...prev, selectedPlace: city.displayName }));
    setCitySearchQuery(city.displayName);
    setShowCityDropdown(false);
    setCityResults([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsCreating(true);
    
    // Create the trip using context with selected activities
    const newTrip = createTrip({
      ...formData,
      selectedActivities: selectedActivities,
    });
    
    // Navigate to itinerary builder to add stops
    navigate(`/itinerary-builder/${newTrip.id}`);
  };

  const handleQuickCreate = () => {
    // Navigate directly to itinerary builder without pre-filling
    navigate('/itinerary-builder');
  };

  const toggleActivity = (activity) => {
    setSelectedActivities(prev => {
      const isSelected = prev.some(a => a.id === activity.id);
      if (isSelected) {
        return prev.filter(a => a.id !== activity.id);
      } else {
        return [...prev, activity];
      }
    });
  };

  const isActivitySelected = (activityId) => {
    return selectedActivities.some(a => a.id === activityId);
  };

  const removeActivity = (activityId) => {
    setSelectedActivities(prev => prev.filter(a => a.id !== activityId));
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Plan a new trip Form */}
        <section className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-6">Plan a new trip</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Trip Name */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="text-gray-300 text-sm font-medium w-32 shrink-0">
                Trip Name:
              </label>
              <input
                type="text"
                name="tripName"
                value={formData.tripName}
                onChange={handleInputChange}
                placeholder="Enter trip name"
                className="flex-1 px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Select a Place */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
              <label className="text-gray-300 text-sm font-medium w-32 shrink-0 pt-3">
                Select a Place:
              </label>
              <div className="relative flex-1">
                <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 z-10" />
                {isSearchingCities && (
                  <Loader2 className="absolute right-4 top-3.5 w-5 h-5 text-blue-400 animate-spin" />
                )}
                <input
                  type="text"
                  value={formData.selectedPlace}
                  onChange={handleCitySearch}
                  onFocus={() => citySearchQuery.length >= 2 && setShowCityDropdown(true)}
                  placeholder="Search any city worldwide..."
                  className="w-full pl-12 pr-10 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
                
                {/* City Dropdown */}
                {showCityDropdown && cityResults.length > 0 && (
                  <div className="absolute z-20 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                    {cityResults.map((city) => (
                      <button
                        key={city.id}
                        type="button"
                        onClick={() => selectCity(city)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-700 transition-colors border-b border-gray-700/50 last:border-b-0"
                      >
                        <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">{city.name}</p>
                          <p className="text-sm text-gray-400 truncate">
                            {city.admin1 && `${city.admin1}, `}{city.country}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                
                {/* No results message */}
                {showCityDropdown && citySearchQuery.length >= 2 && !isSearchingCities && cityResults.length === 0 && (
                  <div className="absolute z-20 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-4 text-center">
                    <p className="text-gray-400 text-sm">No cities found for "{citySearchQuery}"</p>
                  </div>
                )}
              </div>
            </div>

            {/* Click outside to close dropdown */}
            {showCityDropdown && (
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowCityDropdown(false)}
              />
            )}

            {/* Start Date */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="text-gray-300 text-sm font-medium w-32 shrink-0">
                Start Date:
              </label>
              <div className="relative flex-1">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all [color-scheme:dark]"
                />
              </div>
            </div>

            {/* End Date */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <label className="text-gray-300 text-sm font-medium w-32 shrink-0">
                End Date:
              </label>
              <div className="relative flex-1">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all [color-scheme:dark]"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={isCreating}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-medium rounded-lg transition-colors"
              >
                {isCreating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    Create & Build Itinerary
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/my-trips')}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
              >
                View My Trips
              </button>
            </div>
          </form>
        </section>

        {/* Selected Activities Section */}
        {selectedActivities.length > 0 && (
          <section className="bg-gray-800 border border-blue-500/50 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">
                Selected Activities ({selectedActivities.length})
              </h2>
              <button
                onClick={() => setSelectedActivities([])}
                className="text-sm text-gray-400 hover:text-red-400 transition-colors"
              >
                Clear all
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-2 bg-blue-600/20 border border-blue-500/50 text-blue-400 px-3 py-2 rounded-lg"
                >
                  <span className="text-sm font-medium">{activity.title}</span>
                  <span className="text-xs text-gray-400">• {activity.location}</span>
                  <button
                    onClick={() => removeActivity(activity.id)}
                    className="ml-1 hover:text-red-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-400 mt-3">
              These activities will be available to add in your itinerary builder.
            </p>
          </section>
        )}

        {/* Suggestions Section */}
        <section className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-2">
            Suggestion for Places to Visit/Activities to perform
          </h2>
          <p className="text-gray-400 text-sm mb-6">Click on activities to add them to your trip</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {suggestedActivities.map((activity) => (
              <div
                key={activity.id}
                onClick={() => toggleActivity(activity)}
                className={`group bg-gray-900 border rounded-xl overflow-hidden transition-all cursor-pointer hover:shadow-lg relative ${
                  isActivitySelected(activity.id)
                    ? 'border-blue-500 ring-2 ring-blue-500/30 shadow-lg shadow-blue-500/20'
                    : 'border-gray-700 hover:border-blue-500 hover:shadow-blue-500/10'
                }`}
              >
                {/* Selected Indicator */}
                {isActivitySelected(activity.id) && (
                  <div className="absolute top-2 right-2 z-10 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}

                {/* Add Indicator on Hover */}
                {!isActivitySelected(activity.id) && (
                  <div className="absolute top-2 right-2 z-10 w-7 h-7 bg-gray-800/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus className="w-4 h-4 text-white" />
                  </div>
                )}

                {/* Image */}
                <div className="h-36 overflow-hidden">
                  <img
                    src={activity.image}
                    alt={activity.title}
                    className={`w-full h-full object-cover transition-transform duration-500 ${
                      isActivitySelected(activity.id) ? 'scale-105' : 'group-hover:scale-110'
                    }`}
                  />
                  {isActivitySelected(activity.id) && (
                    <div className="absolute inset-0 bg-blue-600/10" />
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className={`font-semibold truncate transition-colors ${
                    isActivitySelected(activity.id) ? 'text-blue-400' : 'text-white group-hover:text-blue-400'
                  }`}>
                    {activity.title}
                  </h3>
                  <div className="flex items-center space-x-1 mt-1 text-gray-400">
                    <MapPin className="w-3 h-3" />
                    <span className="text-sm">{activity.location}</span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">
                      {activity.type}
                    </span>
                    <span className="text-sm text-green-400 font-medium">
                      {activity.cost}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default CreateTrip;
