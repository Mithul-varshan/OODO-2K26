import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Camera, Edit2, Mail, Phone, MapPin, Calendar, User, 
  Settings, Heart, DollarSign, Globe, Bell, Lock, 
  Trash2, Save, X, Shield, Languages, Eye, EyeOff,
  AlertTriangle, Download, Share2
} from 'lucide-react';
import Header from '../components/Header';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userDetails, setUserDetails] = useState({
    username: '@GlobalTrotter',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    location: 'New York, USA',
    memberSince: 'January 2024',
    bio: 'Passionate traveler exploring the world one destination at a time.',
  });

  // Mock data for preplanned trips
  const preplannedTrips = [
    {
      id: 1,
      title: 'Paris Adventure',
      destination: 'Paris, France',
      date: 'March 2026',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400',
    },
    {
      id: 2,
      title: 'Tokyo Explorer',
      destination: 'Tokyo, Japan',
      date: 'May 2026',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400',
    },
    {
      id: 3,
      title: 'Bali Retreat',
      destination: 'Bali, Indonesia',
      date: 'July 2026',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400',
    },
  ];

  // Mock data for previous trips
  const previousTrips = [
    {
      id: 101,
      title: 'Summer in Italy',
      destination: 'Rome, Italy',
      date: 'August 2025',
      image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400',
    },
    {
      id: 102,
      title: 'Swiss Alps',
      destination: 'Zurich, Switzerland',
      date: 'December 2025',
      image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400',
    },
    {
      id: 103,
      title: 'NYC Winter',
      destination: 'New York, USA',
      date: 'November 2025',
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400',
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // TODO: Save to backend
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Profile Image */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1">
                <div className="w-full h-full rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                  <User className="w-16 h-16 text-gray-400" />
                </div>
              </div>
              <button className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 rounded-full p-2 transition-colors">
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* User Details */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-white">{userDetails.username}</h1>
                <button
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  {isEditing ? 'Save' : 'Edit Profile'}
                </button>
              </div>

              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={userDetails.name}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={userDetails.email}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={userDetails.phone}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={userDetails.location}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-400 mb-1">Bio</label>
                    <textarea
                      name="bio"
                      value={userDetails.bio}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-300">
                    <User className="w-4 h-4 text-gray-400" />
                    <span>{userDetails.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{userDetails.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{userDetails.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{userDetails.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>Member since {userDetails.memberSince}</span>
                  </div>
                  <p className="text-gray-400 mt-2">{userDetails.bio}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preplanned Trips Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Preplanned Trips</h2>
            <Link 
              to="/create-trip"
              className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {preplannedTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </div>

        {/* Previous Trips Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Previous Trips</h2>
            <Link 
              to="/my-trips"
              className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {previousTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Trip Card Component (inline for profile page)
const TripCard = ({ trip }) => {
  return (
    <div className="group relative bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative overflow-hidden h-48">
        <img 
          src={trip.image} 
          alt={trip.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-white font-semibold text-lg truncate group-hover:text-blue-400 transition-colors">
          {trip.title}
        </h3>
        
        <div className="flex items-center space-x-1 mt-2 text-gray-400">
          <MapPin className="w-4 h-4" />
          <span className="text-sm truncate">{trip.destination}</span>
        </div>

        <div className="flex items-center space-x-1 mt-1 text-gray-400">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">{trip.date}</span>
        </div>

        {/* View Button */}
        <Link
          to={`/timeline/${trip.id}`}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-center block transition-colors"
        >
          View
        </Link>
      </div>
    </div>
  );
};

export default Profile;
