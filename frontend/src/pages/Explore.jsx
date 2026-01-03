import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Star, 
  TrendingUp, 
  Heart,
  Search,
  Filter,
  Plane,
  Camera,
  Mountain,
  Utensils,
  Palmtree,
  Building,
  Sparkles,
  DollarSign,
  Users,
  Clock,
  Sun,
  CloudRain,
  Snowflake,
  Wind
} from 'lucide-react';
import Header from '../components/Header';

const Explore = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedContinent, setSelectedContinent] = useState('all');

  // Popular destinations with rich details
  const destinations = [
    {
      id: 1,
      name: 'Paris',
      country: 'France',
      continent: 'Europe',
      image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'The City of Light beckons with world-class museums, romantic streets, and iconic landmarks.',
      rating: 4.8,
      reviews: 12453,
      avgCost: '$200-300/day',
      bestTime: 'Apr-Jun, Sep-Oct',
      highlights: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame', 'Champs-Élysées'],
      tags: ['Culture', 'Romance', 'Food', 'Art'],
      trending: true,
      season: 'Spring'
    },
    {
      id: 2,
      name: 'Tokyo',
      country: 'Japan',
      continent: 'Asia',
      image: 'https://images.pexels.com/photos/2614818/pexels-photo-2614818.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Ultra-modern metropolis meets ancient traditions in this fascinating cultural hub.',
      rating: 4.9,
      reviews: 15782,
      avgCost: '$150-250/day',
      bestTime: 'Mar-May, Sep-Nov',
      highlights: ['Shibuya Crossing', 'Senso-ji Temple', 'Mt. Fuji', 'Tokyo Skytree'],
      tags: ['Culture', 'Food', 'Technology', 'Shopping'],
      trending: true,
      season: 'Spring'
    },
    {
      id: 3,
      name: 'Bali',
      country: 'Indonesia',
      continent: 'Asia',
      image: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Tropical paradise with stunning beaches, lush rice terraces, and spiritual temples.',
      rating: 4.7,
      reviews: 9876,
      avgCost: '$50-100/day',
      bestTime: 'Apr-Oct',
      highlights: ['Ubud Rice Terraces', 'Tanah Lot Temple', 'Seminyak Beach', 'Mount Batur'],
      tags: ['Beach', 'Adventure', 'Relaxation', 'Culture'],
      trending: true,
      season: 'Summer'
    },
    {
      id: 4,
      name: 'New York',
      country: 'USA',
      continent: 'North America',
      image: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'The city that never sleeps offers endless entertainment, culture, and iconic landmarks.',
      rating: 4.6,
      reviews: 18234,
      avgCost: '$250-400/day',
      bestTime: 'Apr-Jun, Sep-Nov',
      highlights: ['Statue of Liberty', 'Central Park', 'Times Square', 'Empire State Building'],
      tags: ['Urban', 'Culture', 'Entertainment', 'Shopping'],
      trending: false,
      season: 'Fall'
    },
    {
      id: 5,
      name: 'Santorini',
      country: 'Greece',
      continent: 'Europe',
      image: 'https://images.pexels.com/photos/161815/santorini-oia-greece-water-161815.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Stunning sunsets, white-washed buildings, and azure waters make this island paradise unforgettable.',
      rating: 4.9,
      reviews: 8234,
      avgCost: '$180-280/day',
      bestTime: 'Apr-Jun, Sep-Oct',
      highlights: ['Oia Sunset', 'Red Beach', 'Ancient Akrotiri', 'Wine Tours'],
      tags: ['Beach', 'Romance', 'Relaxation', 'Photography'],
      trending: true,
      season: 'Summer'
    },
    {
      id: 6,
      name: 'Dubai',
      country: 'UAE',
      continent: 'Asia',
      image: 'https://images.pexels.com/photos/1534411/pexels-photo-1534411.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Futuristic cityscape with luxury shopping, ultramodern architecture, and desert adventures.',
      rating: 4.5,
      reviews: 11290,
      avgCost: '$200-350/day',
      bestTime: 'Nov-Mar',
      highlights: ['Burj Khalifa', 'Dubai Mall', 'Palm Jumeirah', 'Desert Safari'],
      tags: ['Luxury', 'Shopping', 'Adventure', 'Modern'],
      trending: false,
      season: 'Winter'
    },
    {
      id: 7,
      name: 'Iceland',
      country: 'Iceland',
      continent: 'Europe',
      image: 'https://images.pexels.com/photos/1933239/pexels-photo-1933239.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Land of fire and ice featuring dramatic landscapes, Northern Lights, and geothermal wonders.',
      rating: 4.8,
      reviews: 6543,
      avgCost: '$300-450/day',
      bestTime: 'Jun-Aug, Dec-Feb',
      highlights: ['Northern Lights', 'Blue Lagoon', 'Golden Circle', 'Glacier Hiking'],
      tags: ['Nature', 'Adventure', 'Photography', 'Unique'],
      trending: true,
      season: 'Winter'
    },
    {
      id: 8,
      name: 'Rome',
      country: 'Italy',
      continent: 'Europe',
      image: 'https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'The Eternal City where ancient history meets vibrant modern life and world-class cuisine.',
      rating: 4.7,
      reviews: 14567,
      avgCost: '$150-250/day',
      bestTime: 'Apr-Jun, Sep-Oct',
      highlights: ['Colosseum', 'Vatican City', 'Trevi Fountain', 'Roman Forum'],
      tags: ['History', 'Culture', 'Food', 'Art'],
      trending: false,
      season: 'Spring'
    },
    {
      id: 9,
      name: 'Machu Picchu',
      country: 'Peru',
      continent: 'South America',
      image: 'https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Ancient Incan citadel set high in the Andes Mountains, one of the New Seven Wonders.',
      rating: 4.9,
      reviews: 5432,
      avgCost: '$100-180/day',
      bestTime: 'Apr-Oct',
      highlights: ['Inca Trail', 'Sun Gate', 'Huayna Picchu', 'Sacred Valley'],
      tags: ['History', 'Adventure', 'Hiking', 'Culture'],
      trending: true,
      season: 'Summer'
    },
    {
      id: 10,
      name: 'Maldives',
      country: 'Maldives',
      continent: 'Asia',
      image: 'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Tropical paradise with overwater bungalows, pristine beaches, and world-class diving.',
      rating: 4.8,
      reviews: 7890,
      avgCost: '$300-600/day',
      bestTime: 'Nov-Apr',
      highlights: ['Overwater Villas', 'Coral Reefs', 'Water Sports', 'Luxury Resorts'],
      tags: ['Beach', 'Luxury', 'Relaxation', 'Diving'],
      trending: false,
      season: 'Winter'
    },
    {
      id: 11,
      name: 'Bangkok',
      country: 'Thailand',
      continent: 'Asia',
      image: 'https://images.pexels.com/photos/1031659/pexels-photo-1031659.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Vibrant city of golden temples, bustling markets, and incredible street food.',
      rating: 4.6,
      reviews: 13245,
      avgCost: '$50-100/day',
      bestTime: 'Nov-Feb',
      highlights: ['Grand Palace', 'Wat Pho', 'Floating Markets', 'Street Food'],
      tags: ['Culture', 'Food', 'Shopping', 'Urban'],
      trending: false,
      season: 'Winter'
    },
    {
      id: 12,
      name: 'Barcelona',
      country: 'Spain',
      continent: 'Europe',
      image: 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: "Gaudí's architectural masterpieces, Mediterranean beaches, and passionate culture.",
      rating: 4.7,
      reviews: 11678,
      avgCost: '$150-250/day',
      bestTime: 'May-Jun, Sep-Oct',
      highlights: ['Sagrada Familia', 'Park Güell', 'Las Ramblas', 'Gothic Quarter'],
      tags: ['Culture', 'Beach', 'Architecture', 'Food'],
      trending: true,
      season: 'Summer'
    }
  ];

  // Travel categories
  const categories = [
    { id: 'all', name: 'All Destinations', icon: MapPin },
    { id: 'beach', name: 'Beach & Islands', icon: Palmtree },
    { id: 'culture', name: 'Culture & History', icon: Building },
    { id: 'adventure', name: 'Adventure', icon: Mountain },
    { id: 'food', name: 'Food & Dining', icon: Utensils },
    { id: 'luxury', name: 'Luxury Travel', icon: Sparkles }
  ];

  const continents = [
    { id: 'all', name: 'All Continents' },
    { id: 'Europe', name: 'Europe' },
    { id: 'Asia', name: 'Asia' },
    { id: 'North America', name: 'North America' },
    { id: 'South America', name: 'South America' },
    { id: 'Africa', name: 'Africa' },
    { id: 'Oceania', name: 'Oceania' }
  ];

  // Filter destinations
  const filteredDestinations = destinations.filter(dest => {
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dest.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dest.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
                           dest.tags.some(tag => tag.toLowerCase().includes(selectedCategory));
    
    const matchesContinent = selectedContinent === 'all' || dest.continent === selectedContinent;
    
    return matchesSearch && matchesCategory && matchesContinent;
  });

  const handleCreateTrip = (destination) => {
    navigate(`/create-trip?destination=${destination.name}`);
  };

  const getSeasonIcon = (season) => {
    switch(season) {
      case 'Spring': return <Sun className="w-4 h-4 text-yellow-400" />;
      case 'Summer': return <Sun className="w-4 h-4 text-orange-400" />;
      case 'Fall': return <Wind className="w-4 h-4 text-orange-500" />;
      case 'Winter': return <Snowflake className="w-4 h-4 text-blue-400" />;
      default: return <Sun className="w-4 h-4 text-yellow-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-blue-600/20 rounded-xl">
              <MapPin className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Explore Destinations</h1>
              <p className="text-gray-400">Discover amazing places around the world</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search destinations, countries, or experiences..."
              className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Category Filter */}
            <div className="flex-1">
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {categories.map(category => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                        selectedCategory === category.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{category.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Continent Filter */}
            <select
              value={selectedContinent}
              onChange={(e) => setSelectedContinent(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              {continents.map(continent => (
                <option key={continent.id} value={continent.id}>{continent.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-400">
            Found <span className="text-white font-semibold">{filteredDestinations.length}</span> destinations
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span>{filteredDestinations.filter(d => d.trending).length} trending now</span>
          </div>
        </div>

        {/* Destinations Grid */}
        {filteredDestinations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDestinations.map(destination => (
              <div
                key={destination.id}
                className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500/50 transition-all hover:transform hover:scale-[1.02] cursor-pointer group"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {destination.trending && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-blue-600 rounded-full text-xs font-medium">
                      <TrendingUp className="w-3 h-3" />
                      Trending
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs">
                    {getSeasonIcon(destination.season)}
                    <span>{destination.season}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{destination.name}</h3>
                      <p className="text-sm text-gray-400">{destination.country}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded-lg">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-semibold text-yellow-400">{destination.rating}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">{destination.description}</p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      <span>{destination.reviews.toLocaleString()} reviews</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>{destination.avgCost}</span>
                    </div>
                  </div>

                  {/* Best Time */}
                  <div className="flex items-center gap-2 mb-4 text-xs">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-gray-400">Best time:</span>
                    <span className="text-white">{destination.bestTime}</span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {destination.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Highlights */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Top highlights:</p>
                    <ul className="text-xs text-gray-400 space-y-1">
                      {destination.highlights.slice(0, 3).map((highlight, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleCreateTrip(destination)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                  >
                    <Plane className="w-4 h-4" />
                    Plan Trip Here
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-800 rounded-xl border border-gray-700">
            <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No destinations found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Explore;
