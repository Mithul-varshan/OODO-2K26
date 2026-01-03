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
  Clock,
  Pencil,
  Plane,
  Train,
  Bus,
  Car,
  Hotel,
  Home,
  Coffee,
  Waves,
  Sparkles,
  Music,
  Ticket,
  Landmark,
  TreePine,
  Bike,
  Ship,
  Umbrella,
  Wine,
  Beer,
  IceCream,
  Palmtree,
  Tent,
  Compass,
  Theater,
  Dumbbell,
  Soup
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

// Comprehensive default activities organized by category
const defaultActivities = [
  // Transport
  { id: 101, name: 'Airport Transfer', type: 'Transport', cost: 35, icon: 'plane' },
  { id: 102, name: 'Train Journey', type: 'Transport', cost: 50, icon: 'train' },
  { id: 103, name: 'Bus Tour', type: 'Transport', cost: 25, icon: 'bus' },
  { id: 104, name: 'Car Rental', type: 'Transport', cost: 60, icon: 'car' },
  { id: 105, name: 'Ferry/Boat Ride', type: 'Transport', cost: 30, icon: 'ship' },
  { id: 106, name: 'Bike Rental', type: 'Transport', cost: 15, icon: 'bike' },
  
  // Accommodation
  { id: 201, name: 'Hotel Check-in', type: 'Accommodation', cost: 0, icon: 'hotel' },
  { id: 202, name: 'Hostel Stay', type: 'Accommodation', cost: 0, icon: 'home' },
  { id: 203, name: 'Resort Check-in', type: 'Accommodation', cost: 0, icon: 'palmtree' },
  { id: 204, name: 'Camping Setup', type: 'Accommodation', cost: 20, icon: 'tent' },
  
  // Sightseeing
  { id: 301, name: 'City Walking Tour', type: 'Sightseeing', cost: 25, icon: 'camera' },
  { id: 302, name: 'Landmark Visit', type: 'Sightseeing', cost: 15, icon: 'landmark' },
  { id: 303, name: 'Guided City Tour', type: 'Sightseeing', cost: 45, icon: 'compass' },
  { id: 304, name: 'Photo Tour', type: 'Sightseeing', cost: 35, icon: 'camera' },
  { id: 305, name: 'Sunset/Sunrise Viewing', type: 'Sightseeing', cost: 0, icon: 'camera' },
  { id: 306, name: 'Observation Deck Visit', type: 'Sightseeing', cost: 30, icon: 'building' },
  
  // Food & Drink
  { id: 401, name: 'Breakfast', type: 'Food', cost: 15, icon: 'coffee' },
  { id: 402, name: 'Lunch', type: 'Food', cost: 25, icon: 'food' },
  { id: 403, name: 'Dinner', type: 'Food', cost: 40, icon: 'food' },
  { id: 404, name: 'Street Food Tour', type: 'Food', cost: 30, icon: 'food' },
  { id: 405, name: 'Fine Dining Experience', type: 'Food', cost: 100, icon: 'wine' },
  { id: 406, name: 'Food Market Visit', type: 'Food', cost: 20, icon: 'shopping' },
  { id: 407, name: 'Cooking Class', type: 'Food', cost: 75, icon: 'soup' },
  { id: 408, name: 'Wine Tasting', type: 'Food', cost: 50, icon: 'wine' },
  { id: 409, name: 'Brewery Tour', type: 'Food', cost: 35, icon: 'beer' },
  { id: 410, name: 'Coffee Shop Visit', type: 'Food', cost: 10, icon: 'coffee' },
  { id: 411, name: 'Dessert Tasting', type: 'Food', cost: 20, icon: 'icecream' },
  
  // Culture
  { id: 501, name: 'Museum Visit', type: 'Culture', cost: 20, icon: 'building' },
  { id: 502, name: 'Art Gallery Tour', type: 'Culture', cost: 25, icon: 'building' },
  { id: 503, name: 'Historical Site Tour', type: 'Culture', cost: 30, icon: 'landmark' },
  { id: 504, name: 'Religious Site Visit', type: 'Culture', cost: 0, icon: 'building' },
  { id: 505, name: 'Cultural Performance', type: 'Culture', cost: 45, icon: 'theater' },
  { id: 506, name: 'Local Festival', type: 'Culture', cost: 15, icon: 'sparkles' },
  { id: 507, name: 'Traditional Ceremony', type: 'Culture', cost: 25, icon: 'sparkles' },
  
  // Adventure
  { id: 601, name: 'Hiking Trail', type: 'Adventure', cost: 10, icon: 'mountain' },
  { id: 602, name: 'Mountain Climbing', type: 'Adventure', cost: 80, icon: 'mountain' },
  { id: 603, name: 'Scuba Diving', type: 'Adventure', cost: 100, icon: 'waves' },
  { id: 604, name: 'Snorkeling', type: 'Adventure', cost: 40, icon: 'waves' },
  { id: 605, name: 'Surfing Lesson', type: 'Adventure', cost: 60, icon: 'waves' },
  { id: 606, name: 'Zip-lining', type: 'Adventure', cost: 55, icon: 'mountain' },
  { id: 607, name: 'Paragliding', type: 'Adventure', cost: 120, icon: 'plane' },
  { id: 608, name: 'Kayaking', type: 'Adventure', cost: 45, icon: 'waves' },
  { id: 609, name: 'Safari Tour', type: 'Adventure', cost: 150, icon: 'compass' },
  { id: 610, name: 'Bungee Jumping', type: 'Adventure', cost: 100, icon: 'sparkles' },
  { id: 611, name: 'Rock Climbing', type: 'Adventure', cost: 50, icon: 'mountain' },
  { id: 612, name: 'White Water Rafting', type: 'Adventure', cost: 85, icon: 'waves' },
  
  // Shopping
  { id: 701, name: 'Shopping Mall Visit', type: 'Shopping', cost: 0, icon: 'shopping' },
  { id: 702, name: 'Local Market Shopping', type: 'Shopping', cost: 0, icon: 'shopping' },
  { id: 703, name: 'Souvenir Shopping', type: 'Shopping', cost: 50, icon: 'shopping' },
  { id: 704, name: 'Boutique Shopping', type: 'Shopping', cost: 0, icon: 'shopping' },
  { id: 705, name: 'Antique Shopping', type: 'Shopping', cost: 0, icon: 'shopping' },
  
  // Leisure
  { id: 801, name: 'Beach Day', type: 'Leisure', cost: 0, icon: 'umbrella' },
  { id: 802, name: 'Spa & Wellness', type: 'Leisure', cost: 80, icon: 'sparkles' },
  { id: 803, name: 'Pool Day', type: 'Leisure', cost: 0, icon: 'waves' },
  { id: 804, name: 'Park Visit', type: 'Leisure', cost: 0, icon: 'treepine' },
  { id: 805, name: 'Yoga Session', type: 'Leisure', cost: 20, icon: 'sparkles' },
  { id: 806, name: 'Gym Workout', type: 'Leisure', cost: 15, icon: 'dumbbell' },
  { id: 807, name: 'Garden Tour', type: 'Leisure', cost: 10, icon: 'treepine' },
  
  // Entertainment
  { id: 901, name: 'Live Music Show', type: 'Entertainment', cost: 50, icon: 'music' },
  { id: 902, name: 'Theater Performance', type: 'Entertainment', cost: 70, icon: 'theater' },
  { id: 903, name: 'Night Club', type: 'Entertainment', cost: 40, icon: 'music' },
  { id: 904, name: 'Cinema/Movie', type: 'Entertainment', cost: 15, icon: 'ticket' },
  { id: 905, name: 'Theme Park', type: 'Entertainment', cost: 80, icon: 'sparkles' },
  { id: 906, name: 'Casino Visit', type: 'Entertainment', cost: 50, icon: 'sparkles' },
  { id: 907, name: 'Pub Crawl', type: 'Entertainment', cost: 35, icon: 'beer' },
  { id: 908, name: 'Karaoke Night', type: 'Entertainment', cost: 25, icon: 'music' },
];

// Activity categories for filtering
const activityCategories = [
  { id: 'all', name: 'All', icon: 'sparkles' },
  { id: 'Transport', name: 'Transport', icon: 'plane' },
  { id: 'Accommodation', name: 'Stay', icon: 'hotel' },
  { id: 'Sightseeing', name: 'Sights', icon: 'camera' },
  { id: 'Food', name: 'Food', icon: 'food' },
  { id: 'Culture', name: 'Culture', icon: 'building' },
  { id: 'Adventure', name: 'Adventure', icon: 'mountain' },
  { id: 'Shopping', name: 'Shopping', icon: 'shopping' },
  { id: 'Leisure', name: 'Leisure', icon: 'waves' },
  { id: 'Entertainment', name: 'Fun', icon: 'music' },
];

const getActivityIcon = (iconType) => {
  switch (iconType) {
    case 'food': return <Utensils className="w-4 h-4" />;
    case 'camera': return <Camera className="w-4 h-4" />;
    case 'mountain': return <Mountain className="w-4 h-4" />;
    case 'building': return <Building className="w-4 h-4" />;
    case 'shopping': return <ShoppingBag className="w-4 h-4" />;
    case 'plane': return <Plane className="w-4 h-4" />;
    case 'train': return <Train className="w-4 h-4" />;
    case 'bus': return <Bus className="w-4 h-4" />;
    case 'car': return <Car className="w-4 h-4" />;
    case 'hotel': return <Hotel className="w-4 h-4" />;
    case 'home': return <Home className="w-4 h-4" />;
    case 'coffee': return <Coffee className="w-4 h-4" />;
    case 'waves': return <Waves className="w-4 h-4" />;
    case 'sparkles': return <Sparkles className="w-4 h-4" />;
    case 'music': return <Music className="w-4 h-4" />;
    case 'ticket': return <Ticket className="w-4 h-4" />;
    case 'landmark': return <Landmark className="w-4 h-4" />;
    case 'treepine': return <TreePine className="w-4 h-4" />;
    case 'bike': return <Bike className="w-4 h-4" />;
    case 'ship': return <Ship className="w-4 h-4" />;
    case 'umbrella': return <Umbrella className="w-4 h-4" />;
    case 'wine': return <Wine className="w-4 h-4" />;
    case 'beer': return <Beer className="w-4 h-4" />;
    case 'icecream': return <IceCream className="w-4 h-4" />;
    case 'palmtree': return <Palmtree className="w-4 h-4" />;
    case 'tent': return <Tent className="w-4 h-4" />;
    case 'compass': return <Compass className="w-4 h-4" />;
    case 'theater': return <Theater className="w-4 h-4" />;
    case 'dumbbell': return <Dumbbell className="w-4 h-4" />;
    case 'soup': return <Soup className="w-4 h-4" />;
    default: return <Sparkles className="w-4 h-4" />;
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
  const [editingActivity, setEditingActivity] = useState(null); // { stopId, activity }
  const [activitySearchQuery, setActivitySearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCustomActivityForm, setShowCustomActivityForm] = useState(false);
  const [customActivity, setCustomActivity] = useState({
    name: '',
    type: 'Sightseeing',
    cost: 0,
    icon: 'sparkles'
  });

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

  // Combine default activities with trip suggested activities
  const allActivities = [
    ...tripSuggestedActivities.map(a => ({ ...a, suggested: true })),
    ...defaultActivities.filter(m => !tripSuggestedActivities.some(s => s.name === m.name)),
  ];

  // Filter activities based on search and category
  const filteredActivities = allActivities.filter((activity) => {
    const matchesSearch = activity.name.toLowerCase().includes(activitySearchQuery.toLowerCase()) ||
                          activity.type.toLowerCase().includes(activitySearchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || activity.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Reset activity modal state
  const resetActivityModal = () => {
    setShowActivityModal(null);
    setSelectedActivity(null);
    setActivitySchedule({ date: '', time: '' });
    setActivitySearchQuery('');
    setSelectedCategory('all');
    setShowCustomActivityForm(false);
    setCustomActivity({ name: '', type: 'Sightseeing', cost: 0, icon: 'sparkles' });
  };

  // Add custom activity
  const addCustomActivity = () => {
    if (!customActivity.name.trim()) return;
    const newActivity = {
      id: Date.now(),
      ...customActivity,
      custom: true
    };
    handleActivitySelect(newActivity);
    setShowCustomActivityForm(false);
    setCustomActivity({ name: '', type: 'Sightseeing', cost: 0, icon: 'sparkles' });
  };

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

  const startEditingActivity = (stopId, activity) => {
    setEditingActivity({ stopId, activity: { ...activity } });
  };

  const updateEditingActivity = (field, value) => {
    setEditingActivity(prev => ({
      ...prev,
      activity: { ...prev.activity, [field]: value }
    }));
  };

  const saveEditedActivity = () => {
    if (!editingActivity) return;
    const { stopId, activity } = editingActivity;
    setStops(
      stops.map((stop) =>
        stop.id === stopId
          ? {
              ...stop,
              activities: stop.activities.map((a) =>
                a.assignedId === activity.assignedId ? activity : a
              )
            }
          : stop
      )
    );
    setEditingActivity(null);
  };

  const cancelEditingActivity = () => {
    setEditingActivity(null);
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
                                onClick={() => startEditingActivity(stop.id, activity)}
                                className="text-gray-400 hover:text-blue-400 transition-colors"
                                title="Edit activity"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
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
            <div className="bg-gray-800 border border-gray-700 rounded-xl w-full max-w-lg">
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-white">
                  {selectedActivity ? 'Schedule Activity' : showCustomActivityForm ? 'Create Custom Activity' : 'Add Activity'}
                </h3>
                <button
                  onClick={resetActivityModal}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {showCustomActivityForm ? (
                // Custom Activity Form
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Activity Name *</label>
                    <input
                      type="text"
                      placeholder="Enter activity name..."
                      value={customActivity.name}
                      onChange={(e) => setCustomActivity({ ...customActivity, name: e.target.value })}
                      autoFocus
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Category</label>
                      <select
                        value={customActivity.type}
                        onChange={(e) => setCustomActivity({ ...customActivity, type: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-all"
                      >
                        <option value="Transport">Transport</option>
                        <option value="Accommodation">Accommodation</option>
                        <option value="Sightseeing">Sightseeing</option>
                        <option value="Food">Food</option>
                        <option value="Culture">Culture</option>
                        <option value="Adventure">Adventure</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Leisure">Leisure</option>
                        <option value="Entertainment">Entertainment</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Cost ($)</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={customActivity.cost}
                        onChange={(e) => setCustomActivity({ ...customActivity, cost: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Icon</label>
                    <div className="grid grid-cols-8 gap-2">
                      {['sparkles', 'camera', 'food', 'mountain', 'building', 'shopping', 'plane', 'train', 'bus', 'car', 'hotel', 'coffee', 'waves', 'music', 'ticket', 'landmark'].map((icon) => (
                        <button
                          key={icon}
                          type="button"
                          onClick={() => setCustomActivity({ ...customActivity, icon })}
                          className={`p-2 rounded-lg border transition-all ${
                            customActivity.icon === icon
                              ? 'bg-blue-600 border-blue-500 text-white'
                              : 'bg-gray-900 border-gray-600 text-gray-400 hover:border-gray-500'
                          }`}
                        >
                          {getActivityIcon(icon)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setShowCustomActivityForm(false)}
                      className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={addCustomActivity}
                      disabled={!customActivity.name.trim()}
                      className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
                    >
                      Add Activity
                    </button>
                  </div>
                </div>
              ) : !selectedActivity ? (
                // Step 1: Select Activity
                <div className="p-4">
                  {/* Search Bar */}
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search activities..."
                      value={activitySearchQuery}
                      onChange={(e) => setActivitySearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>

                  {/* Category Filters */}
                  <div className="flex flex-wrap gap-1.5 mb-3 pb-3 border-b border-gray-700">
                    {activityCategories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          selectedCategory === cat.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-900 text-gray-400 hover:bg-gray-700 hover:text-white'
                        }`}
                      >
                        {getActivityIcon(cat.icon)}
                        <span>{cat.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Activities List */}
                  <div className="max-h-64 overflow-y-auto space-y-1.5">
                    {/* Show suggested activities first if any */}
                    {tripSuggestedActivities.length > 0 && selectedCategory === 'all' && !activitySearchQuery && (
                      <div className="mb-3">
                        <p className="text-xs text-blue-400 font-medium mb-2 uppercase tracking-wide">
                          ★ Your Selected Activities
                        </p>
                        {tripSuggestedActivities.map((activity) => (
                          <button
                            key={`suggested-${activity.id}`}
                            onClick={() => handleActivitySelect(activity)}
                            className="w-full flex items-center justify-between p-2.5 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/50 hover:border-blue-500 rounded-lg transition-all text-left mb-1.5"
                          >
                            <div className="flex items-center space-x-3">
                              <span className="text-blue-400">{getActivityIcon(activity.icon)}</span>
                              <div>
                                <p className="text-white font-medium text-sm">{activity.name}</p>
                                <p className="text-xs text-gray-400">{activity.type}</p>
                              </div>
                            </div>
                            <span className="text-xs text-green-400 font-medium">${activity.cost}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {/* Filtered Activities */}
                    {filteredActivities.length > 0 ? (
                      filteredActivities.map((activity) => (
                        <button
                          key={activity.id}
                          onClick={() => handleActivitySelect(activity)}
                          className="w-full flex items-center justify-between p-2.5 bg-gray-900 hover:bg-gray-700 border border-gray-700 hover:border-blue-500 rounded-lg transition-all text-left"
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-blue-400">{getActivityIcon(activity.icon)}</span>
                            <div>
                              <p className="text-white font-medium text-sm">{activity.name}</p>
                              <p className="text-xs text-gray-400">{activity.type}</p>
                            </div>
                          </div>
                          <span className="text-xs text-green-400 font-medium">${activity.cost}</span>
                        </button>
                      ))
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-gray-500 text-sm mb-3">No activities found</p>
                        <button
                          onClick={() => setShowCustomActivityForm(true)}
                          className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                        >
                          + Create Custom Activity
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Create Custom Activity Button */}
                  <button
                    onClick={() => setShowCustomActivityForm(true)}
                    className="w-full mt-3 flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-blue-600/30 border border-purple-500/50 hover:border-purple-500 rounded-lg transition-all text-purple-300 hover:text-white font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Create Custom Activity
                  </button>
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

        {/* Edit Activity Modal */}
        {editingActivity && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-xl w-full max-w-md">
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-white">Edit Activity</h3>
                <button
                  onClick={cancelEditingActivity}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Activity Name */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Activity Name</label>
                  <input
                    type="text"
                    value={editingActivity.activity.name}
                    onChange={(e) => updateEditingActivity('name', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>

                {/* Activity Type */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Type</label>
                  <select
                    value={editingActivity.activity.type}
                    onChange={(e) => updateEditingActivity('type', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-all"
                  >
                    <option value="Sightseeing">Sightseeing</option>
                    <option value="Food">Food</option>
                    <option value="Culture">Culture</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Transport">Transport</option>
                    <option value="Accommodation">Accommodation</option>
                    <option value="Leisure">Leisure</option>
                    <option value="Entertainment">Entertainment</option>
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={editingActivity.activity.date || ''}
                      onChange={(e) => updateEditingActivity('date', e.target.value)}
                      className="w-full pl-10 pr-3 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-all [color-scheme:dark]"
                    />
                  </div>
                </div>

                {/* Time */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      value={editingActivity.activity.time || '9:00 AM'}
                      onChange={(e) => updateEditingActivity('time', e.target.value)}
                      className="w-full pl-10 pr-3 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-all"
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
                </div>

                {/* Cost */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Cost ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      min="0"
                      value={editingActivity.activity.cost}
                      onChange={(e) => updateEditingActivity('cost', parseFloat(e.target.value) || 0)}
                      className="w-full pl-10 pr-3 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={cancelEditingActivity}
                    className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveEditedActivity}
                    className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                  >
                    Save Changes
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
