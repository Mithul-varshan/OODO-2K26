import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Camera,
  Edit2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Globe,
  Trash2,
  Heart,
  X,
} from "lucide-react";
import Header from "../components/Header";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState("profile"); // profile, settings, destinations
  const [notification, setNotification] = useState(null);
  const [userDetails, setUserDetails] = useState({
    username: "@GlobalTrotter",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 8900",
    location: "New York, USA",
    memberSince: "January 2024",
    bio: "Passionate traveler exploring the world one destination at a time.",
    language: "en",
    profileImage: null,
  });

  // Mock data for preplanned trips
  const preplannedTrips = [
    {
      id: 1,
      title: "Paris Adventure",
      destination: "Paris, France",
      date: "March 2026",
      image:
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400",
    },
    {
      id: 2,
      title: "Tokyo Explorer",
      destination: "Tokyo, Japan",
      date: "May 2026",
      image:
        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400",
    },
    {
      id: 3,
      title: "Bali Retreat",
      destination: "Bali, Indonesia",
      date: "July 2026",
      image:
        "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400",
    },
  ];

  // Mock data for previous trips
  const previousTrips = [
    {
      id: 101,
      title: "Summer in Italy",
      destination: "Rome, Italy",
      date: "August 2025",
      image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400",
    },
    {
      id: 102,
      title: "Swiss Alps",
      destination: "Zurich, Switzerland",
      date: "December 2025",
      image:
        "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400",
    },
    {
      id: 103,
      title: "NYC Winter",
      destination: "New York, USA",
      date: "November 2025",
      image:
        "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400",
    },
  ];

  // Mock data for saved destinations
  const savedDestinations = [
    {
      id: 1,
      name: "Santorini",
      country: "Greece",
      image:
        "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400",
      savedDate: "Dec 2025",
    },
    {
      id: 2,
      name: "Kyoto",
      country: "Japan",
      image:
        "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400",
      savedDate: "Nov 2025",
    },
    {
      id: 3,
      name: "Iceland",
      country: "Europe",
      image:
        "https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=400",
      savedDate: "Oct 2025",
    },
    {
      id: 4,
      name: "Maldives",
      country: "Indian Ocean",
      image:
        "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400",
      savedDate: "Sep 2025",
    },
    {
      id: 5,
      name: "Machu Picchu",
      country: "Peru",
      image:
        "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=400",
      savedDate: "Aug 2025",
    },
    {
      id: 6,
      name: "Dubai",
      country: "UAE",
      image:
        "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400",
      savedDate: "Jul 2025",
    },
  ];

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "pt", name: "Portuguese" },
    { code: "ja", name: "Japanese" },
    { code: "zh", name: "Chinese" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Show notification when language is changed
    if (name === 'language') {
      const selectedLang = languages.find(lang => lang.code === value);
      showNotification(`Language changed to ${selectedLang?.name}. This will be applied across the app.`);
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSave = () => {
    setIsEditing(false);
    showNotification('Profile updated successfully!');
    // TODO: Save to backend
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserDetails((prev) => ({
          ...prev,
          profileImage: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion
    console.log("Account deletion requested");
    setShowDeleteModal(false);
  };

  const handleRemoveDestination = (id) => {
    // TODO: Remove from saved destinations
    console.log("Remove destination:", id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <Header />

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in">
          <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span>{notification}</span>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Profile Image */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1">
                <div className="w-full h-full rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                  {userDetails.profileImage ? (
                    <img
                      src={userDetails.profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-gray-400" />
                  )}
                </div>
              </div>
              <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 rounded-full p-2 transition-colors cursor-pointer">
                <Camera className="w-4 h-4 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* User Details */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-white">
                  {userDetails.username}
                </h1>
                <button
                  onClick={() =>
                    isEditing ? handleSave() : setIsEditing(true)
                  }
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  {isEditing ? "Save" : "Edit Profile"}
                </button>
              </div>

              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={userDetails.name}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={userDetails.email}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={userDetails.phone}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={userDetails.location}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-400 mb-1">
                      Bio
                    </label>
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

        {/* Tabs Navigation */}
        <div className="flex gap-2 mb-8 border-b border-gray-700">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === "profile"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            My Trips
          </button>
          <button
            onClick={() => setActiveTab("destinations")}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === "destinations"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Saved Destinations
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === "settings"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Settings & Privacy
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "profile" && (
          <>
            {/* Preplanned Trips Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">
                  Preplanned Trips
                </h2>
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
                <h2 className="text-2xl font-bold text-white">
                  Previous Trips
                </h2>
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
          </>
        )}

        {/* Saved Destinations Tab */}
        {activeTab === "destinations" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">
                Saved Destinations
              </h2>
              <span className="text-gray-400 text-sm">
                {savedDestinations.length} destinations
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedDestinations.map((destination) => (
                <div
                  key={destination.id}
                  className="group relative bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-all duration-300"
                >
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveDestination(destination.id)}
                      className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 rounded-full p-2 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-semibold text-lg">
                        {destination.name}
                      </h3>
                      <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                    </div>

                    <div className="flex items-center space-x-1 text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{destination.country}</span>
                    </div>

                    <div className="flex items-center space-x-1 mt-1 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        Saved {destination.savedDate}
                      </span>
                    </div>

                    <Link
                      to={`/create-trip?destination=${destination.name}`}
                      className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-center block transition-colors"
                    >
                      Plan Trip
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-white mb-6">
              Settings & Privacy
            </h2>

            {/* Language Preference */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-600/10 p-3 rounded-lg">
                  <Globe className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg mb-2">
                    Language Preference
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Choose your preferred language for the application
                  </p>
                  <select
                    name="language"
                    value={userDetails.language}
                    onChange={handleInputChange}
                    className="w-full md:w-64 bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-6">
              <h3 className="text-white font-semibold text-lg mb-4">
                Privacy Settings
              </h3>

              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="text-white font-medium">
                      Make profile public
                    </p>
                    <p className="text-gray-400 text-sm">
                      Allow others to see your profile and trips
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500"
                    defaultChecked
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="text-white font-medium">
                      Email notifications
                    </p>
                    <p className="text-gray-400 text-sm">
                      Receive updates about your trips
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500"
                    defaultChecked
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="text-white font-medium">Share trip data</p>
                    <p className="text-gray-400 text-sm">
                      Help improve recommendations
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                </label>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-900/20 rounded-xl border border-red-800/50 p-6">
              <div className="flex items-start gap-4">
                <div className="bg-red-600/10 p-3 rounded-lg">
                  <Trash2 className="w-6 h-6 text-red-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg mb-2">
                    Delete Account
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Once you delete your account, there is no going back. Please
                    be certain.
                  </p>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Delete My Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 max-w-md w-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-600/10 p-3 rounded-lg">
                  <Trash2 className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Delete Account</h3>
              </div>

              <p className="text-gray-300 mb-6">
                Are you sure you want to delete your account? This action cannot
                be undone and all your data will be permanently removed.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}

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
