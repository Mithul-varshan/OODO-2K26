import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import TripCard from '../components/TripCard';
import SearchBar from '../components/SearchBar';

// Mock data for regional selections
const regionalSelections = [
  {
    id: 1,
    title: 'Paris',
    location: 'France',
    country: 'Europe',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400',
    costIndex: '$$$',
  },
  {
    id: 2,
    title: 'Tokyo',
    location: 'Japan',
    country: 'Asia',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400',
    costIndex: '$$$',
  },
  {
    id: 3,
    title: 'Bali',
    location: 'Indonesia',
    country: 'Asia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400',
    costIndex: '$$',
  },
  {
    id: 4,
    title: 'New York',
    location: 'USA',
    country: 'North America',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400',
    costIndex: '$$$$',
  },
];

// Mock data for previous trips
const previousTrips = [
  {
    id: 101,
    title: 'Summer in Italy',
    location: 'Rome, Florence, Venice',
    country: 'Italy',
    image: 'https://images.unsplash.com/photo-1515859005217-8a1f08870f59?w=400',
    dates: 'Jun 15 - Jun 28, 2025',
    destinationCount: 3,
  },
  {
    id: 102,
    title: 'Thailand Adventure',
    location: 'Bangkok, Phuket',
    country: 'Thailand',
    image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=400',
    dates: 'Mar 1 - Mar 10, 2025',
    destinationCount: 2,
  },
  {
    id: 103,
    title: 'Spanish Getaway',
    location: 'Barcelona, Madrid',
    country: 'Spain',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400',
    dates: 'Dec 20 - Dec 30, 2024',
    destinationCount: 2,
  },
  {
    id: 104,
    title: 'Greek Islands',
    location: 'Santorini, Mykonos',
    country: 'Greece',
    image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400',
    dates: 'Aug 5 - Aug 15, 2024',
    destinationCount: 2,
  },
];

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleGroupBy = () => {
    console.log('Group by clicked');
  };

  const handleFilter = () => {
    console.log('Filter clicked');
  };

  const handleSort = () => {
    console.log('Sort clicked');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Banner */}
        <section className="relative rounded-2xl overflow-hidden mb-8">
          <div className="h-64 sm:h-80 lg:h-96">
            <img
              src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200"
              alt="Travel Banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/50 to-transparent" />
          </div>

          <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Plan Your Next <span className="text-blue-400">Adventure</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-xl mb-6">
              Discover amazing destinations, create personalized itineraries, and make your travel dreams come true.
            </p>
            <Link
              to="/create-trip"
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors w-fit"
            >
              <Plus className="w-5 h-5" />
              <span>Start Planning</span>
            </Link>
          </div>
        </section>

        {/* Search Bar */}
        <section className="mb-10">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onGroupBy={handleGroupBy}
            onFilter={handleFilter}
            onSort={handleSort}
          />
        </section>

        {/* Top Regional Selections */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Top Regional Selections
            </h2>
            <Link
              to="/explore"
              className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <span className="text-sm">View all</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {regionalSelections.map((destination) => (
              <TripCard 
                key={destination.id} 
                trip={destination} 
                variant="regional"
              />
            ))}
          </div>
        </section>

        {/* Previous Trips */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Previous Trips
            </h2>
            <Link
              to="/my-trips"
              className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <span className="text-sm">View all</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {previousTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </section>
      </main>

      {/* Floating Action Button */}
      <Link
        to="/create-trip"
        className="fixed bottom-6 right-6 flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-full shadow-lg shadow-blue-500/30 transition-all hover:scale-105"
      >
        <Plus className="w-5 h-5" />
        <span className="font-medium">Plan a trip</span>
      </Link>
    </div>
  );
};

export default Dashboard;
