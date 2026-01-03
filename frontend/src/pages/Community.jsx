import { useState } from "react";
import {
  Search,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  Heart,
  MessageCircle,
  Share2,
  MapPin,
  Calendar,
} from "lucide-react";
import Header from "../components/Header";
import { useLanguage } from "../context/LanguageContext";

const Community = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [showGroupBy, setShowGroupBy] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);

  // Filter states
  const [groupBy, setGroupBy] = useState("none"); // 'none', 'destination', 'type', 'user'
  const [filter, setFilter] = useState("all"); // 'all', 'popular', 'recent', 'liked'
  const [sortBy, setSortBy] = useState("newest"); // 'newest', 'oldest', 'engagement'

  // Interaction states
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [postLikes, setPostLikes] = useState({});
  const [postComments, setPostComments] = useState({});
  const [showCommentInput, setShowCommentInput] = useState({});
  const [commentText, setCommentText] = useState({});
  const [showShareMenu, setShowShareMenu] = useState({});

  // Mock community posts data
  const communityPosts = [
    {
      id: 1,
      user: {
        name: "Witty Conure",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Conure",
        location: "Total Ostrich",
      },
      trip: {
        destination: "Paris, France",
        date: "December 2025",
        type: "Cultural Tour",
      },
      content:
        "Just got back from the most amazing trip to Paris! The Eiffel Tower at sunset was absolutely breathtaking. Pro tip: Book your tickets in advance to skip the long queues.",
      images: [
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
      ],
      likes: 124,
      comments: 18,
      timestamp: "2 hours ago",
      timestampValue: new Date(Date.now() - 2 * 60 * 60 * 1000),
      tags: ["Europe", "Cultural", "Photography"],
    },
    {
      id: 2,
      user: {
        name: "Minty Wildcat",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Wildcat",
        location: "Adventure Seeker",
      },
      trip: {
        destination: "Bali, Indonesia",
        date: "November 2025",
        type: "Beach & Adventure",
      },
      content:
        "Bali is a paradise! Spent 10 days exploring temples, beaches, and trying amazing food. The Tegalalang Rice Terraces are a must-visit. Would love to hear recommendations for next time!",
      images: [
        "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800",
      ],
      likes: 89,
      comments: 12,
      timestamp: "5 hours ago",
      timestampValue: new Date(Date.now() - 5 * 60 * 60 * 1000),
      tags: ["Asia", "Beach", "Culture"],
    },
    {
      id: 3,
      user: {
        name: "Sophisticated Chicken",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chicken",
        location: "Luxury Traveler",
      },
      trip: {
        destination: "Tokyo, Japan",
        date: "October 2025",
        type: "City Exploration",
      },
      content:
        "Tokyo exceeded all expectations! From the serene temples to the bustling Shibuya crossing, every moment was magical. Best ramen of my life at a tiny shop in Shinjuku.",
      images: [
        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
      ],
      likes: 156,
      comments: 24,
      timestamp: "1 day ago",
      timestampValue: new Date(Date.now() - 24 * 60 * 60 * 1000),
      tags: ["Japan", "Food", "City"],
    },
    {
      id: 4,
      user: {
        name: "Witty Dinosaur",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dinosaur",
        location: "Budget Explorer",
      },
      trip: {
        destination: "Iceland",
        date: "September 2025",
        type: "Nature & Adventure",
      },
      content:
        "Iceland in autumn was incredible! The Northern Lights, hot springs, and dramatic landscapes made it unforgettable. Rented a car and did the Ring Road - highly recommend!",
      images: [
        "https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800",
      ],
      likes: 203,
      comments: 31,
      timestamp: "2 days ago",
      timestampValue: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      tags: ["Europe", "Nature", "Adventure"],
    },
  ];

  // Filter posts based on search query
  const filteredPosts = communityPosts.filter((post) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      post.user.name.toLowerCase().includes(searchLower) ||
      post.trip.destination.toLowerCase().includes(searchLower) ||
      post.content.toLowerCase().includes(searchLower) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  });

  // Apply filter
  const getFilteredPosts = () => {
    let posts = [...filteredPosts];

    if (filter === "popular") {
      // Filter posts with high engagement (likes + comments > 150)
      posts = posts.filter((post) => post.likes + post.comments > 150);
    } else if (filter === "recent") {
      // Filter posts from last 12 hours
      const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
      posts = posts.filter((post) => post.timestampValue > twelveHoursAgo);
    } else if (filter === "liked") {
      // Filter posts with more than 100 likes
      posts = posts.filter((post) => post.likes > 100);
    }

    return posts;
  };

  // Apply sorting
  const getSortedPosts = (posts) => {
    let sorted = [...posts];

    if (sortBy === "newest") {
      sorted.sort((a, b) => b.timestampValue - a.timestampValue);
    } else if (sortBy === "oldest") {
      sorted.sort((a, b) => a.timestampValue - b.timestampValue);
    } else if (sortBy === "engagement") {
      sorted.sort((a, b) => b.likes + b.comments - (a.likes + a.comments));
    }

    return sorted;
  };

  // Apply grouping
  const getGroupedPosts = (posts) => {
    if (groupBy === "none") {
      return { "All Posts": posts };
    }

    const grouped = {};

    if (groupBy === "destination") {
      posts.forEach((post) => {
        const dest = post.trip.destination;
        if (!grouped[dest]) grouped[dest] = [];
        grouped[dest].push(post);
      });
    } else if (groupBy === "type") {
      posts.forEach((post) => {
        const type = post.trip.type;
        if (!grouped[type]) grouped[type] = [];
        grouped[type].push(post);
      });
    } else if (groupBy === "user") {
      posts.forEach((post) => {
        const user = post.user.name;
        if (!grouped[user]) grouped[user] = [];
        grouped[user].push(post);
      });
    }

    return grouped;
  };

  // Get final posts to display
  const getDisplayPosts = () => {
    const filtered = getFilteredPosts();
    const sorted = getSortedPosts(filtered);
    return getGroupedPosts(sorted);
  };

  const displayPosts = getDisplayPosts();

  const handleGroupBy = () => {
    setShowGroupBy(!showGroupBy);
    setShowFilter(false);
    setShowSort(false);
  };

  const handleFilter = () => {
    setShowFilter(!showFilter);
    setShowGroupBy(false);
    setShowSort(false);
  };

  const handleSort = () => {
    setShowSort(!showSort);
    setShowGroupBy(false);
    setShowFilter(false);
  };

  const selectGroupBy = (value) => {
    setGroupBy(value);
    setShowGroupBy(false);
  };

  const selectFilter = (value) => {
    setFilter(value);
    setShowFilter(false);
  };

  const selectSort = (value) => {
    setSortBy(value);
    setShowSort(false);
  };

  // Handle like
  const handleLike = (postId, currentLikes) => {
    const isLiked = likedPosts.has(postId);
    const newLikedPosts = new Set(likedPosts);

    if (isLiked) {
      newLikedPosts.delete(postId);
      setPostLikes((prev) => ({
        ...prev,
        [postId]: (prev[postId] || currentLikes) - 1,
      }));
    } else {
      newLikedPosts.add(postId);
      setPostLikes((prev) => ({
        ...prev,
        [postId]: (prev[postId] || currentLikes) + 1,
      }));
    }

    setLikedPosts(newLikedPosts);
  };

  // Handle comment
  const toggleCommentInput = (postId) => {
    setShowCommentInput((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleAddComment = (postId, currentComments) => {
    const text = commentText[postId];
    if (!text || text.trim() === "") return;

    setPostComments((prev) => ({
      ...prev,
      [postId]: (prev[postId] || currentComments) + 1,
    }));

    setCommentText((prev) => ({ ...prev, [postId]: "" }));
    setShowCommentInput((prev) => ({ ...prev, [postId]: false }));
  };

  // Handle share
  const toggleShareMenu = (postId) => {
    setShowShareMenu((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleShare = (postId, platform) => {
    const url = window.location.href;
    const text = `Check out this amazing travel experience!`;

    let shareUrl = "";
    switch (platform) {
      case "copy":
        navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`;
        window.open(shareUrl, "_blank");
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          text
        )}&url=${encodeURIComponent(url)}`;
        window.open(shareUrl, "_blank");
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(
          text + " " + url
        )}`;
        window.open(shareUrl, "_blank");
        break;
      default:
        break;
    }

    setShowShareMenu((prev) => ({ ...prev, [postId]: false }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Community</h1>
          <p className="text-gray-400">
            Community section where all the users can share their experience
            about a certain trip or activity.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search posts, destinations, or users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-700 text-white pl-10 pr-4 py-2.5 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              <div className="relative">
                <button
                  onClick={handleGroupBy}
                  className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2.5 rounded-lg transition-colors border border-gray-600"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Group by
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showGroupBy && (
                  <div className="absolute top-full mt-2 right-0 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10 w-48">
                    <button
                      onClick={() => selectGroupBy("none")}
                      className={`w-full text-left px-4 py-2 text-white hover:bg-gray-700 transition-colors ${
                        groupBy === "none" ? "bg-gray-700" : ""
                      }`}
                    >
                      None
                    </button>
                    <button
                      onClick={() => selectGroupBy("destination")}
                      className={`w-full text-left px-4 py-2 text-white hover:bg-gray-700 transition-colors ${
                        groupBy === "destination" ? "bg-gray-700" : ""
                      }`}
                    >
                      By Destination
                    </button>
                    <button
                      onClick={() => selectGroupBy("type")}
                      className={`w-full text-left px-4 py-2 text-white hover:bg-gray-700 transition-colors ${
                        groupBy === "type" ? "bg-gray-700" : ""
                      }`}
                    >
                      By Trip Type
                    </button>
                    <button
                      onClick={() => selectGroupBy("user")}
                      className={`w-full text-left px-4 py-2 text-white hover:bg-gray-700 transition-colors ${
                        groupBy === "user" ? "bg-gray-700" : ""
                      }`}
                    >
                      By User
                    </button>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={handleFilter}
                  className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2.5 rounded-lg transition-colors border border-gray-600"
                >
                  <Filter className="w-4 h-4" />
                  Filter
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showFilter && (
                  <div className="absolute top-full mt-2 right-0 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10 w-48">
                    <button
                      onClick={() => selectFilter("all")}
                      className={`w-full text-left px-4 py-2 text-white hover:bg-gray-700 transition-colors ${
                        filter === "all" ? "bg-gray-700" : ""
                      }`}
                    >
                      All Posts
                    </button>
                    <button
                      onClick={() => selectFilter("popular")}
                      className={`w-full text-left px-4 py-2 text-white hover:bg-gray-700 transition-colors ${
                        filter === "popular" ? "bg-gray-700" : ""
                      }`}
                    >
                      Most Popular
                    </button>
                    <button
                      onClick={() => selectFilter("recent")}
                      className={`w-full text-left px-4 py-2 text-white hover:bg-gray-700 transition-colors ${
                        filter === "recent" ? "bg-gray-700" : ""
                      }`}
                    >
                      Most Recent
                    </button>
                    <button
                      onClick={() => selectFilter("liked")}
                      className={`w-full text-left px-4 py-2 text-white hover:bg-gray-700 transition-colors ${
                        filter === "liked" ? "bg-gray-700" : ""
                      }`}
                    >
                      Most Liked
                    </button>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={handleSort}
                  className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2.5 rounded-lg transition-colors border border-gray-600"
                >
                  Sort by...
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showSort && (
                  <div className="absolute top-full mt-2 right-0 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10 w-48">
                    <button
                      onClick={() => selectSort("newest")}
                      className={`w-full text-left px-4 py-2 text-white hover:bg-gray-700 transition-colors ${
                        sortBy === "newest" ? "bg-gray-700" : ""
                      }`}
                    >
                      Newest First
                    </button>
                    <button
                      onClick={() => selectSort("oldest")}
                      className={`w-full text-left px-4 py-2 text-white hover:bg-gray-700 transition-colors ${
                        sortBy === "oldest" ? "bg-gray-700" : ""
                      }`}
                    >
                      Oldest First
                    </button>
                    <button
                      onClick={() => selectSort("engagement")}
                      className={`w-full text-left px-4 py-2 text-white hover:bg-gray-700 transition-colors ${
                        sortBy === "engagement" ? "bg-gray-700" : ""
                      }`}
                    >
                      Most Engagement
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Community Posts */}
        <div className="space-y-6">
          {Object.entries(displayPosts).map(([groupName, posts]) => (
            <div key={groupName}>
              {/* Group Header (only show if grouped) */}
              {groupBy !== "none" && (
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-blue-500 rounded"></span>
                  {groupName}
                  <span className="text-sm text-gray-400 font-normal">
                    ({posts.length} {posts.length === 1 ? "post" : "posts"})
                  </span>
                </h2>
              )}

              {/* Posts in this group */}
              {posts.length === 0 ? (
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center">
                  <p className="text-gray-400">
                    No posts found matching your criteria.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-blue-500 transition-all duration-300"
                    >
                      {/* Post Header */}
                      <div className="p-6 pb-4">
                        <div className="flex items-start gap-4">
                          <img
                            src={post.user.avatar}
                            alt={post.user.name}
                            className="w-12 h-12 rounded-full bg-gray-700"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-white font-semibold">
                                {post.user.name}
                              </h3>
                              <span className="text-gray-400 text-sm">
                                • {post.timestamp}
                              </span>
                            </div>
                            <p className="text-gray-400 text-sm">
                              {post.user.location}
                            </p>

                            {/* Trip Info */}
                            <div className="flex flex-wrap gap-3 mt-2">
                              <div className="flex items-center gap-1 text-blue-400 text-sm">
                                <MapPin className="w-4 h-4" />
                                {post.trip.destination}
                              </div>
                              <div className="flex items-center gap-1 text-gray-400 text-sm">
                                <Calendar className="w-4 h-4" />
                                {post.trip.date}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Post Content */}
                        <p className="text-gray-300 mt-4 leading-relaxed">
                          {post.content}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mt-3">
                          {post.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-600/20 text-blue-400 text-xs rounded-full border border-blue-600/30"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Post Images */}
                      {post.images && post.images.length > 0 && (
                        <div className="px-6 pb-4">
                          <div className="grid grid-cols-1 gap-2 rounded-lg overflow-hidden">
                            {post.images.map((image, index) => (
                              <img
                                key={index}
                                src={image}
                                alt={`Post ${index + 1}`}
                                className="w-full h-64 object-cover"
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Post Actions */}
                      <div className="px-6 py-4 border-t border-gray-700">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6">
                            <button
                              onClick={() => handleLike(post.id, post.likes)}
                              className={`flex items-center gap-2 transition-colors group ${
                                likedPosts.has(post.id)
                                  ? "text-red-500"
                                  : "text-gray-400 hover:text-red-500"
                              }`}
                            >
                              <Heart
                                className={`w-5 h-5 ${
                                  likedPosts.has(post.id)
                                    ? "fill-current"
                                    : "group-hover:fill-red-500"
                                }`}
                              />
                              <span>{postLikes[post.id] ?? post.likes}</span>
                            </button>
                            <div className="relative">
                              <button
                                onClick={() => toggleCommentInput(post.id)}
                                className="flex items-center gap-2 text-gray-400 hover:text-blue-500 transition-colors"
                              >
                                <MessageCircle className="w-5 h-5" />
                                <span>
                                  {postComments[post.id] ?? post.comments}
                                </span>
                              </button>
                              {showCommentInput[post.id] && (
                                <div className="absolute top-full left-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-3 z-10">
                                  <textarea
                                    value={commentText[post.id] || ""}
                                    onChange={(e) =>
                                      setCommentText((prev) => ({
                                        ...prev,
                                        [post.id]: e.target.value,
                                      }))
                                    }
                                    placeholder="Write a comment..."
                                    className="w-full bg-gray-700 text-white border border-gray-600 rounded p-2 text-sm resize-none focus:outline-none focus:border-blue-500"
                                    rows="3"
                                  />
                                  <div className="flex gap-2 mt-2">
                                    <button
                                      onClick={() =>
                                        handleAddComment(post.id, post.comments)
                                      }
                                      className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                                    >
                                      Post
                                    </button>
                                    <button
                                      onClick={() =>
                                        toggleCommentInput(post.id)
                                      }
                                      className="px-4 py-1.5 bg-gray-700 text-gray-300 text-sm rounded hover:bg-gray-600 transition-colors"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="relative">
                              <button
                                onClick={() => toggleShareMenu(post.id)}
                                className="flex items-center gap-2 text-gray-400 hover:text-green-500 transition-colors"
                              >
                                <Share2 className="w-5 h-5" />
                                <span>Share</span>
                              </button>
                              {showShareMenu[post.id] && (
                                <div className="absolute top-full right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-2 z-10">
                                  <button
                                    onClick={() => handleShare(post.id, "copy")}
                                    className="w-full px-4 py-2.5 text-left text-gray-300 hover:bg-gray-700 transition-colors flex items-center gap-3"
                                  >
                                    <Share2 className="w-4 h-4" />
                                    Copy Link
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleShare(post.id, "facebook")
                                    }
                                    className="w-full px-4 py-2.5 text-left text-gray-300 hover:bg-gray-700 transition-colors flex items-center gap-3"
                                  >
                                    <Share2 className="w-4 h-4" />
                                    Share to Facebook
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleShare(post.id, "twitter")
                                    }
                                    className="w-full px-4 py-2.5 text-left text-gray-300 hover:bg-gray-700 transition-colors flex items-center gap-3"
                                  >
                                    <Share2 className="w-4 h-4" />
                                    Share to Twitter
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleShare(post.id, "whatsapp")
                                    }
                                    className="w-full px-4 py-2.5 text-left text-gray-300 hover:bg-gray-700 transition-colors flex items-center gap-3"
                                  >
                                    <Share2 className="w-4 h-4" />
                                    Share to WhatsApp
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Community;

