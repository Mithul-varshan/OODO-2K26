import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Calendar, 
  MapPin, 
  Trash2, 
  Edit3, 
  Eye, 
  MoreVertical,
  Clock,
  DollarSign,
  ChevronRight
} from 'lucide-react';
import Header from '../components/Header';
import { useTrips } from '../context/TripContext';

const MyTrips = () => {
  const navigate = useNavigate();
  const { trips, deleteTrip, selectTrip } = useTrips();
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getDateRange = (startDate, endDate) => {
    if (!startDate && !endDate) return 'Dates not set';
    if (!endDate) return `Starting ${formatDate(startDate)}`;
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  const getDaysCount = (startDate, endDate) => {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const getStopsCount = (trip) => {
    return trip.stops?.length || 0;
  };

  const getTotalBudget = (trip) => {
    if (!trip.stops || trip.stops.length === 0) return 0;
    return trip.stops.reduce((total, stop) => {
      const stopBudget = parseFloat(stop.budget) || 0;
      const activitiesCost = (stop.activities || []).reduce((sum, a) => sum + (a.cost || 0), 0);
      return total + stopBudget + activitiesCost;
    }, 0);
  };

  const handleViewTrip = (tripId) => {
    navigate(`/timeline/${tripId}`);
  };

  const handleEditTrip = (tripId) => {
    selectTrip(tripId);
    navigate('/itinerary-builder');
  };

  const handleDeleteTrip = (tripId) => {
    deleteTrip(tripId);
    setShowDeleteModal(null);
  };

  const getTripStatus = (trip) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (!trip.startDate) return { label: 'Draft', color: 'gray' };
    
    const startDate = new Date(trip.startDate);
    const endDate = trip.endDate ? new Date(trip.endDate) : startDate;
    
    if (today < startDate) return { label: 'Upcoming', color: 'blue' };
    if (today > endDate) return { label: 'Completed', color: 'green' };
    return { label: 'In Progress', color: 'yellow' };
  };

  const sortedTrips = [...trips].sort((a, b) => {
    // Sort by startDate (upcoming first), then by createdAt
    if (a.startDate && b.startDate) {
      return new Date(a.startDate) - new Date(b.startDate);
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">My Trips</h1>
            <p className="text-gray-400 mt-1">
              {trips.length === 0 
                ? "You haven't created any trips yet" 
                : `${trips.length} trip${trips.length !== 1 ? 's' : ''} planned`
              }
            </p>
          </div>
          <button
            onClick={() => navigate('/create-trip')}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-blue-600/20"
          >
            <Plus className="w-5 h-5" />
            Create New Trip
          </button>
        </div>

        {/* Empty State */}
        {trips.length === 0 && (
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-700 rounded-full flex items-center justify-center">
              <MapPin className="w-10 h-10 text-gray-500" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">No trips yet</h2>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Start planning your next adventure! Create a trip to organize your destinations, 
              activities, and build your perfect itinerary.
            </p>
            <button
              onClick={() => navigate('/create-trip')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              Plan Your First Trip
            </button>
          </div>
        )}

        {/* Trip Cards Grid */}
        {trips.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedTrips.map((trip) => {
              const status = getTripStatus(trip);
              const daysCount = getDaysCount(trip.startDate, trip.endDate);
              const stopsCount = getStopsCount(trip);
              const budget = getTotalBudget(trip);

              return (
                <div
                  key={trip.id}
                  className="group bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/10"
                >
                  {/* Cover Image */}
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={trip.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'}
                      alt={trip.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        status.color === 'blue' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        status.color === 'green' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                        status.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                        'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                      }`}>
                        {status.label}
                      </span>
                    </div>

                    {/* More Menu */}
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenu(activeMenu === trip.id ? null : trip.id);
                        }}
                        className="p-2 bg-gray-900/60 hover:bg-gray-900/80 rounded-lg text-white transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      
                      {activeMenu === trip.id && (
                        <div className="absolute right-0 mt-1 w-40 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10">
                          <button
                            onClick={() => {
                              handleViewTrip(trip.id);
                              setActiveMenu(null);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            View Timeline
                          </button>
                          <button
                            onClick={() => {
                              handleEditTrip(trip.id);
                              setActiveMenu(null);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                            Edit Trip
                          </button>
                          <button
                            onClick={() => {
                              setShowDeleteModal(trip.id);
                              setActiveMenu(null);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete Trip
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Trip Name Overlay */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-lg font-bold text-white truncate">{trip.name}</h3>
                    </div>
                  </div>

                  {/* Trip Details */}
                  <div className="p-4">
                    {/* Date Range */}
                    <div className="flex items-center gap-2 text-gray-400 mb-3">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{getDateRange(trip.startDate, trip.endDate)}</span>
                    </div>

                    {/* Stats Row */}
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                      {daysCount && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{daysCount} day{daysCount !== 1 ? 's' : ''}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{stopsCount} destination{stopsCount !== 1 ? 's' : ''}</span>
                      </div>
                      {budget > 0 && (
                        <div className="flex items-center gap-1 text-green-400">
                          <DollarSign className="w-4 h-4" />
                          <span>${budget.toFixed(0)}</span>
                        </div>
                      )}
                    </div>

                    {/* Destination Pills */}
                    {stopsCount > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {trip.stops.slice(0, 3).map((stop, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded-full"
                          >
                            {stop.city?.name || stop.destination || 'Unknown'}
                          </span>
                        ))}
                        {trip.stops.length > 3 && (
                          <span className="px-2 py-1 text-xs bg-gray-700 text-gray-400 rounded-full">
                            +{trip.stops.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditTrip(trip.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleViewTrip(trip.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        View
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Add New Trip Card */}
            <div
              onClick={() => navigate('/create-trip')}
              className="group bg-gray-800/50 border-2 border-dashed border-gray-700 hover:border-blue-500 rounded-xl p-8 flex flex-col items-center justify-center min-h-[320px] cursor-pointer transition-all hover:bg-gray-800"
            >
              <div className="w-16 h-16 bg-gray-700 group-hover:bg-blue-600 rounded-full flex items-center justify-center mb-4 transition-colors">
                <Plus className="w-8 h-8 text-gray-400 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-medium text-gray-400 group-hover:text-white transition-colors">
                Create New Trip
              </h3>
              <p className="text-sm text-gray-500 mt-1">Plan your next adventure</p>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-md w-full">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                  <Trash2 className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Delete Trip?</h3>
                <p className="text-gray-400 mb-6">
                  Are you sure you want to delete this trip? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteModal(null)}
                    className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteTrip(showDeleteModal)}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Click outside to close menu */}
      {activeMenu && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setActiveMenu(null)}
        />
      )}
    </div>
  );
};

export default MyTrips;
