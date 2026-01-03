import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Calendar, 
  MapPin, 
  Trash2, 
  Edit3, 
  Eye, 
  Clock,
  DollarSign,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Layers,
  X,
  ChevronDown
} from 'lucide-react';
import Header from '../components/Header';
import { useTrips } from '../context/TripContext';

const MyTrips = () => {
  const navigate = useNavigate();
  const { trips, deleteTrip, selectTrip } = useTrips();
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [groupBy, setGroupBy] = useState('status');
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const getStopsCount = (trip) => trip.stops?.length || 0;

  const getActivitiesCount = (trip) => {
    if (!trip.stops) return 0;
    return trip.stops.reduce((total, stop) => total + (stop.activities?.length || 0), 0);
  };

  const getTotalBudget = (trip) => {
    if (!trip.stops || trip.stops.length === 0) return 0;
    return trip.stops.reduce((total, stop) => {
      const stopBudget = parseFloat(stop.budget) || 0;
      const activitiesCost = (stop.activities || []).reduce((sum, a) => sum + (a.cost || 0), 0);
      return total + stopBudget + activitiesCost;
    }, 0);
  };

  const handleViewTrip = (tripId) => navigate(`/timeline/${tripId}`);
  const handleEditTrip = (tripId) => { selectTrip(tripId); navigate(`/itinerary-builder/${tripId}`); };
  const handleDeleteTrip = (tripId) => { deleteTrip(tripId); setShowDeleteModal(null); };

  const getTripStatus = (trip) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (!trip.startDate) return { label: 'Draft', key: 'draft', color: 'gray' };
    const startDate = new Date(trip.startDate);
    const endDate = trip.endDate ? new Date(trip.endDate) : startDate;
    if (today < startDate) return { label: 'Upcoming', key: 'upcoming', color: 'blue' };
    if (today > endDate) return { label: 'Completed', key: 'completed', color: 'green' };
    return { label: 'Ongoing', key: 'ongoing', color: 'yellow' };
  };

  const processedTrips = useMemo(() => {
    let filtered = [...trips];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(trip => 
        trip.name?.toLowerCase().includes(query) ||
        trip.stops?.some(stop => stop.city?.name?.toLowerCase().includes(query) || stop.city?.country?.toLowerCase().includes(query))
      );
    }
    if (filterStatus !== 'all') filtered = filtered.filter(trip => getTripStatus(trip).key === filterStatus);
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date': comparison = (a.startDate ? new Date(a.startDate) : new Date(0)) - (b.startDate ? new Date(b.startDate) : new Date(0)); break;
        case 'name': comparison = (a.name || '').localeCompare(b.name || ''); break;
        case 'budget': comparison = getTotalBudget(a) - getTotalBudget(b); break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    return filtered;
  }, [trips, searchQuery, filterStatus, sortBy, sortOrder]);

  const groupedTrips = useMemo(() => {
    if (groupBy === 'none') return { all: processedTrips };
    return {
      ongoing: processedTrips.filter(trip => getTripStatus(trip).key === 'ongoing'),
      upcoming: processedTrips.filter(trip => getTripStatus(trip).key === 'upcoming'),
      completed: processedTrips.filter(trip => getTripStatus(trip).key === 'completed'),
      draft: processedTrips.filter(trip => getTripStatus(trip).key === 'draft'),
    };
  }, [processedTrips, groupBy]);

  const TripCard = ({ trip }) => {
    const status = getTripStatus(trip);
    const daysCount = getDaysCount(trip.startDate, trip.endDate);
    const stopsCount = getStopsCount(trip);
    const activitiesCount = getActivitiesCount(trip);
    const budget = getTotalBudget(trip);

    return (
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 hover:border-gray-600 transition-all">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1">{trip.name}</h3>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Calendar className="w-4 h-4" />
              <span>{getDateRange(trip.startDate, trip.endDate)}</span>
            </div>
          </div>
          <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
            status.color === 'blue' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
            status.color === 'green' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
            status.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
            'bg-gray-500/20 text-gray-400 border border-gray-500/30'
          }`}>{status.label}</span>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-4 mb-4">
          {stopsCount > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
              <div className="flex flex-wrap gap-1.5">
                {trip.stops.slice(0, 4).map((stop, idx) => (
                  <span key={idx} className="text-sm text-gray-300">
                    {stop.city?.name || 'Unknown'}
                    {idx < Math.min(trip.stops.length - 1, 3) && <span className="text-gray-500 ml-1.5"></span>}
                  </span>
                ))}
                {trip.stops.length > 4 && <span className="text-sm text-gray-500">+{trip.stops.length - 4} more</span>}
              </div>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            {daysCount && <div className="flex items-center gap-1.5 text-gray-400"><Clock className="w-4 h-4" /><span>{daysCount} day{daysCount !== 1 ? 's' : ''}</span></div>}
            <div className="flex items-center gap-1.5 text-gray-400"><MapPin className="w-4 h-4" /><span>{stopsCount} stop{stopsCount !== 1 ? 's' : ''}</span></div>
            {activitiesCount > 0 && <div className="flex items-center gap-1.5 text-gray-400"><Layers className="w-4 h-4" /><span>{activitiesCount} activit{activitiesCount !== 1 ? 'ies' : 'y'}</span></div>}
            {budget > 0 && <div className="flex items-center gap-1.5 text-green-400"><DollarSign className="w-4 h-4" /><span>${budget.toFixed(0)}</span></div>}
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => handleEditTrip(trip.id)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors"><Edit3 className="w-4 h-4" />Edit</button>
          <button onClick={() => handleViewTrip(trip.id)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"><Eye className="w-4 h-4" />View</button>
          <button onClick={() => setShowDeleteModal(trip.id)} className="px-3 py-2.5 bg-gray-700 hover:bg-red-600 text-gray-400 hover:text-white rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>
    );
  };

  const TripSection = ({ title, trips, color }) => {
    if (trips.length === 0) return null;
    return (
      <div className="mb-8">
        <h2 className={`text-lg font-semibold mb-4 ${color === 'yellow' ? 'text-yellow-400' : color === 'blue' ? 'text-blue-400' : color === 'green' ? 'text-green-400' : 'text-gray-400'}`}>
          {title}<span className="text-gray-500 font-normal ml-2">({trips.length})</span>
        </h2>
        <div className="space-y-4">{trips.map((trip) => <TripCard key={trip.id} trip={trip} />)}</div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">My Trips</h1>
            <p className="text-gray-400 mt-1">{trips.length === 0 ? "You haven't created any trips yet" : `${trips.length} trip${trips.length !== 1 ? 's' : ''} planned`}</p>
          </div>
          <button onClick={() => navigate('/create-trip')} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-blue-600/20"><Plus className="w-5 h-5" />New Trip</button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search trips..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all" />
            {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>}
          </div>
          <div className="relative">
            <button onClick={() => { setShowGroupDropdown(!showGroupDropdown); setShowFilterDropdown(false); setShowSortDropdown(false); }} className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-lg text-gray-300 transition-all"><Layers className="w-4 h-4" /><span className="hidden sm:inline">Group by</span><ChevronDown className="w-4 h-4" /></button>
            {showGroupDropdown && <div className="absolute right-0 mt-1 w-40 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-20">
              <button onClick={() => { setGroupBy('status'); setShowGroupDropdown(false); }} className={`w-full text-left px-4 py-2 text-sm transition-colors ${groupBy === 'status' ? 'text-blue-400 bg-blue-500/10' : 'text-gray-300 hover:bg-gray-700'}`}>By Status</button>
              <button onClick={() => { setGroupBy('none'); setShowGroupDropdown(false); }} className={`w-full text-left px-4 py-2 text-sm transition-colors ${groupBy === 'none' ? 'text-blue-400 bg-blue-500/10' : 'text-gray-300 hover:bg-gray-700'}`}>No Grouping</button>
            </div>}
          </div>
          <div className="relative">
            <button onClick={() => { setShowFilterDropdown(!showFilterDropdown); setShowGroupDropdown(false); setShowSortDropdown(false); }} className={`flex items-center gap-2 px-4 py-2.5 bg-gray-800 border rounded-lg transition-all ${filterStatus !== 'all' ? 'border-blue-500 text-blue-400' : 'border-gray-700 hover:border-gray-600 text-gray-300'}`}><SlidersHorizontal className="w-4 h-4" /><span className="hidden sm:inline">Filter</span><ChevronDown className="w-4 h-4" /></button>
            {showFilterDropdown && <div className="absolute right-0 mt-1 w-40 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-20">
              {[{ key: 'all', label: 'All Trips' }, { key: 'ongoing', label: 'Ongoing' }, { key: 'upcoming', label: 'Upcoming' }, { key: 'completed', label: 'Completed' }, { key: 'draft', label: 'Drafts' }].map(option => (
                <button key={option.key} onClick={() => { setFilterStatus(option.key); setShowFilterDropdown(false); }} className={`w-full text-left px-4 py-2 text-sm transition-colors ${filterStatus === option.key ? 'text-blue-400 bg-blue-500/10' : 'text-gray-300 hover:bg-gray-700'}`}>{option.label}</button>
              ))}
            </div>}
          </div>
          <div className="relative">
            <button onClick={() => { setShowSortDropdown(!showSortDropdown); setShowGroupDropdown(false); setShowFilterDropdown(false); }} className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-lg text-gray-300 transition-all"><ArrowUpDown className="w-4 h-4" /><span className="hidden sm:inline">Sort by</span><ChevronDown className="w-4 h-4" /></button>
            {showSortDropdown && <div className="absolute right-0 mt-1 w-44 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-20">
              {[{ key: 'date', label: 'Date' }, { key: 'name', label: 'Name' }, { key: 'budget', label: 'Budget' }].map(option => (
                <button key={option.key} onClick={() => { if (sortBy === option.key) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); else { setSortBy(option.key); setSortOrder('asc'); } setShowSortDropdown(false); }} className={`w-full flex items-center justify-between px-4 py-2 text-sm transition-colors ${sortBy === option.key ? 'text-blue-400 bg-blue-500/10' : 'text-gray-300 hover:bg-gray-700'}`}>{option.label}{sortBy === option.key && <span className="text-xs">{sortOrder === 'asc' ? '' : ''}</span>}</button>
              ))}
            </div>}
          </div>
        </div>

        {trips.length === 0 && (
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-700 rounded-full flex items-center justify-center"><MapPin className="w-10 h-10 text-gray-500" /></div>
            <h2 className="text-xl font-bold text-white mb-2">No trips yet</h2>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">Start planning your next adventure! Create a trip to organize your destinations, activities, and build your perfect itinerary.</p>
            <button onClick={() => navigate('/create-trip')} className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"><Plus className="w-5 h-5" />Plan Your First Trip</button>
          </div>
        )}

        {trips.length > 0 && processedTrips.length === 0 && (
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center">
            <Search className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No trips found</h3>
            <p className="text-gray-400 mb-4">Try adjusting your search or filters</p>
            <button onClick={() => { setSearchQuery(''); setFilterStatus('all'); }} className="text-blue-400 hover:text-blue-300 font-medium">Clear all filters</button>
          </div>
        )}

        {trips.length > 0 && processedTrips.length > 0 && (
          <>{groupBy === 'status' ? (
            <>
              <TripSection title="Ongoing" trips={groupedTrips.ongoing || []} color="yellow" />
              <TripSection title="Upcoming" trips={groupedTrips.upcoming || []} color="blue" />
              <TripSection title="Completed" trips={groupedTrips.completed || []} color="green" />
              <TripSection title="Drafts" trips={groupedTrips.draft || []} color="gray" />
            </>
          ) : (
            <div className="space-y-4">{processedTrips.map((trip) => <TripCard key={trip.id} trip={trip} />)}</div>
          )}</>
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-md w-full">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center"><Trash2 className="w-8 h-8 text-red-400" /></div>
                <h3 className="text-xl font-bold text-white mb-2">Delete Trip?</h3>
                <p className="text-gray-400 mb-6">Are you sure you want to delete this trip? This action cannot be undone.</p>
                <div className="flex gap-3">
                  <button onClick={() => setShowDeleteModal(null)} className="flex-1 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors">Cancel</button>
                  <button onClick={() => handleDeleteTrip(showDeleteModal)} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors">Delete</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      {(showGroupDropdown || showFilterDropdown || showSortDropdown) && <div className="fixed inset-0 z-10" onClick={() => { setShowGroupDropdown(false); setShowFilterDropdown(false); setShowSortDropdown(false); }} />}
    </div>
  );
};

export default MyTrips;
