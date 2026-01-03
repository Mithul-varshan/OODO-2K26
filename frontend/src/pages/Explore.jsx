import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  TrendingUp, 
  DollarSign,
  Calendar,
  Users,
  ThermometerSun,
  Plane,
  Camera,
  Mountain,
  Waves,
  Building,
  Palmtree,
  Coffee,
  ShoppingBag,
  Wine,
  Utensils,
  Heart,
  Star,
  Search,
  Filter,
  ArrowRight
} from 'lucide-react';
import Header from '../components/Header';

// Curated destination data
const destinations = [
  {
    id: 1,
    name: 'Paris, France',
    image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'City',
    rating: 4.9,
    avgCost: '$150-200',
    bestTime: 'Apr-Oct',
    highlights: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame', 'Seine River'],
    description: 'The City of Light offers unmatched culture, cuisine, and romance.',
    tags: ['Culture', 'Food', 'Romance'],
    duration: '4-5 days'
  },
  {
    id: 2,
    name: 'Tokyo, Japan',
    image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'City',
    rating: 4.8,
    avgCost: '$180-250',
    bestTime: 'Mar-May, Sep-Nov',
    highlights: ['Shibuya Crossing', 'Senso-ji Temple', 'Mount Fuji', 'Cherry Blossoms'],
    description: 'A vibrant blend of ultra-modern and traditional culture.',
    tags: ['Culture', 'Technology', 'Food'],
    duration: '5-7 days'
  },
  {
    id: 3,
    name: 'Bali, Indonesia',
    image: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Beach',
    rating: 4.7,
    avgCost: '$80-120',
    bestTime: 'Apr-Oct',
    highlights: ['Ubud Rice Terraces', 'Beach Clubs', 'Temples', 'Surfing'],
    description: 'Tropical paradise with stunning beaches and spiritual culture.',
    tags: ['Beach', 'Adventure', 'Wellness'],
    duration: '5-7 days'
  },
  {
    id: 4,
    name: 'New York City, USA',
    image: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'City',
    rating: 4.8,
    avgCost: '$200-300',
    bestTime: 'Apr-Jun, Sep-Nov',
    highlights: ['Statue of Liberty', 'Central Park', 'Times Square', 'Broadway'],
    description: 'The city that never sleeps with endless entertainment.',
    tags: ['City', 'Culture', 'Entertainment'],
    duration: '4-6 days'
  },
  {
    id: 5,
    name: 'Santorini, Greece',
    image: 'https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Beach',
    rating: 4.9,
    avgCost: '$120-180',
    bestTime: 'Apr-Oct',
    highlights: ['Oia Sunset', 'White Villages', 'Volcanic Beaches', 'Wine Tasting'],
    description: 'Stunning island with iconic white-washed buildings and sunsets.',
    tags: ['Beach', 'Romance', 'Photography'],
    duration: '3-5 days'
  },
  {
    id: 6,
    name: 'Machu Picchu, Peru',
    image: 'https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Adventure',
    rating: 4.9,
    avgCost: '$100-150',
    bestTime: 'May-Sep',
    highlights: ['Ancient Ruins', 'Inca Trail', 'Sacred Valley', 'Mountain Views'],
    description: 'Ancient Incan citadel set high in the Andes Mountains.',
    tags: ['Adventure', 'History', 'Hiking'],
    duration: '3-4 days'
  },
  {
    id: 7,
    name: 'Dubai, UAE',
    image: 'https://images.pexels.com/photos/1470502/pexels-photo-1470502.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'City',
    rating: 4.7,
    avgCost: '$150-250',
    bestTime: 'Nov-Mar',
    highlights: ['Burj Khalifa', 'Desert Safari', 'Luxury Shopping', 'Beach Resorts'],
    description: 'Futuristic city with luxury, desert adventures, and beaches.',
    tags: ['Luxury', 'Shopping', 'Adventure'],
    duration: '4-5 days'
  },
  {
    id: 8,
    name: 'Iceland',
    image: 'https://images.pexels.com/photos/1933239/pexels-photo-1933239.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Nature',
    rating: 4.8,
    avgCost: '$200-300',
    bestTime: 'Jun-Aug (Summer), Sep-Mar (Northern Lights)',
    highlights: ['Northern Lights', 'Blue Lagoon', 'Waterfalls', 'Glaciers'],
    description: 'Land of fire and ice with dramatic natural wonders.',
    tags: ['Nature', 'Adventure', 'Photography'],
    duration: '5-7 days'
  },
  {
    id: 9,
    name: 'Barcelona, Spain',
    image: 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'City',
    rating: 4.8,
    avgCost: '$130-180',
    bestTime: 'May-Jun, Sep-Oct',
    highlights: ['Sagrada Familia', 'Park Güell', 'La Rambla', 'Gothic Quarter'],
    description: 'Artistic city with Gaudí architecture and Mediterranean charm.',
    tags: ['Culture', 'Beach', 'Food'],
    duration: '4-5 days'
  },
  {
    id: 10,
    name: 'Maldives',
    image: 'https://images.pexels.com/photos/3250613/pexels-photo-3250613.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Beach',
    rating: 4.9,
    avgCost: '$250-500',
    bestTime: 'Nov-Apr',
    highlights: ['Overwater Bungalows', 'Diving', 'Private Islands', 'Luxury Resorts'],
    description: 'Tropical paradise with crystal clear waters and luxury resorts.',
    tags: ['Beach', 'Luxury', 'Romance'],
    duration: '5-7 days'
  },
  {
    id: 11,
    name: 'Rome, Italy',
    image: 'https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'City',
    rating: 4.8,
    avgCost: '$120-170',
    bestTime: 'Apr-Jun, Sep-Oct',
    highlights: ['Colosseum', 'Vatican City', 'Trevi Fountain', 'Roman Forum'],
    description: 'Eternal city with ancient history and incredible cuisine.',
    tags: ['History', 'Culture', 'Food'],
    duration: '4-5 days'
  },
  {
    id: 12,
    name: 'Swiss Alps',
    image: 'https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Mountain',
    rating: 4.9,
    avgCost: '$200-350',
    bestTime: 'Jun-Sep (Summer), Dec-Mar (Winter)',
    highlights: ['Skiing', 'Mountain Railways', 'Chocolate', 'Scenic Trains'],
    description: 'Majestic mountains with world-class skiing and alpine beauty.',
    tags: ['Adventure', 'Nature', 'Skiing'],
    duration: '5-7 days'
  }
];

// Travel tips data
const travelTips = [
  {
    id: 1,
    title: 'Book Flights Early',
    description: 'Save up to 30% by booking international flights 2-3 months in advance.',
    icon: Plane,
    category: 'Budget'
  },
  {
    id: 2,
    title: 'Travel Off-Season',
    description: 'Visit popular destinations during shoulder season for lower prices and fewer crowds.',
    icon: Calendar,
    category: 'Budget'
  },
  {
    id: 3,
    title: 'Use Local Transportation',
    description: 'Save money and experience culture by using public transport instead of taxis.',
    icon: MapPin,
    category: 'Budget'
  },
  {
    id: 4,
    title: 'Pack Light',
    description: 'Travel with carry-on only to save baggage fees and move around easier.',
    icon: ShoppingBag,
    category: 'Packing'
  },
  {
    id: 5,
    title: 'Learn Basic Phrases',
    description: 'Knowing "hello", "thank you", and "where is..." in the local language goes a long way.',
    icon: Users,
    category: 'Culture'
  },
  {
    id: 6,
    title: 'Get Travel Insurance',
    description: 'Protect yourself from unexpected medical emergencies and trip cancellations.',
    icon: Heart,
    category: 'Safety'
  }
];

const Explore = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');

  // Get unique categories and tags
  const categories = ['all', ...new Set(destinations.map(d => d.category))];
  const allTags = ['all', ...new Set(destinations.flatMap(d => d.tags))];

  // Filter destinations
  const filteredDestinations = destinations.filter(dest => {
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dest.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || dest.category === selectedCategory;
    const matchesTag = selectedTag === 'all' || dest.tags.includes(selectedTag);
    return matchesSearch && matchesCategory && matchesTag;
  });

  const handleDestinationClick = (destination) => {
    navigate(`/create-trip?destination=${destination.name}`);
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'City': return Building;
      case 'Beach': return Waves;
      case 'Mountain': return Mountain;
      case 'Adventure': return Mountain;
      case 'Nature': return Palmtree;
      default: return MapPin;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Explore the World
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
            Discover amazing destinations, get travel tips, and plan your next adventure
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search destinations..."
                className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Category:</span>
            </div>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          {/* Tag Filters */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  selectedTag === tag
                    ? 'bg-green-600/20 text-green-400 border border-green-500'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Destinations Grid */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-400" />
            Popular Destinations
            <span className="text-sm text-gray-400 font-normal ml-2">
              ({filteredDestinations.length} {filteredDestinations.length === 1 ? 'destination' : 'destinations'})
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDestinations.map(dest => {
              const CategoryIcon = getCategoryIcon(dest.category);
              return (
                <div
                  key={dest.id}
                  onClick={() => handleDestinationClick(dest)}
                  className="group bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:border-blue-500 transition-all cursor-pointer hover:shadow-xl hover:shadow-blue-500/10"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-gray-900/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-medium text-white">{dest.rating}</span>
                    </div>
                    <div className="absolute top-3 left-3 bg-gray-900/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2">
                      <CategoryIcon className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-white">{dest.category}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                          {dest.name}
                        </h3>
                        <p className="text-sm text-gray-400">{dest.description}</p>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {dest.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-400" />
                        <div>
                          <p className="text-gray-400 text-xs">Avg. Daily</p>
                          <p className="text-white font-medium">{dest.avgCost}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-400" />
                        <div>
                          <p className="text-gray-400 text-xs">Duration</p>
                          <p className="text-white font-medium">{dest.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <ThermometerSun className="w-4 h-4 text-orange-400" />
                        <div>
                          <p className="text-gray-400 text-xs">Best Time</p>
                          <p className="text-white font-medium text-xs">{dest.bestTime}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Camera className="w-4 h-4 text-purple-400" />
                        <div>
                          <p className="text-gray-400 text-xs">Highlights</p>
                          <p className="text-white font-medium text-xs">{dest.highlights.length}</p>
                        </div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() => handleDestinationClick(dest)}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 group-hover:gap-3"
                    >
                      Plan Trip
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredDestinations.length === 0 && (
            <div className="text-center py-16 bg-gray-800 rounded-xl border border-gray-700">
              <MapPin className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No destinations found</h3>
              <p className="text-gray-500">Try adjusting your filters or search query</p>
            </div>
          )}
        </section>

        {/* Travel Tips Section */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-400" />
            Travel Tips & Advice
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {travelTips.map(tip => {
              const Icon = tip.icon;
              return (
                <div
                  key={tip.id}
                  className="bg-gradient-to-br from-gray-800 to-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-blue-500 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-600/20 rounded-lg">
                      <Icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-white">{tip.title}</h3>
                        <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
                          {tip.category}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm">{tip.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Explore;
