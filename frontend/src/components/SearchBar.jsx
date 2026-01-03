import { Search, SlidersHorizontal, ArrowUpDown, LayoutGrid } from 'lucide-react';

const SearchBar = ({ 
  searchQuery, 
  onSearchChange, 
  onGroupBy, 
  onFilter, 
  onSort 
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search destinations, trips..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button 
          onClick={onGroupBy}
          className="flex items-center space-x-2 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-gray-600 transition-all"
        >
          <LayoutGrid className="w-4 h-4" />
          <span className="text-sm hidden sm:inline">Group by</span>
        </button>

        <button 
          onClick={onFilter}
          className="flex items-center space-x-2 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-gray-600 transition-all"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="text-sm hidden sm:inline">Filter</span>
        </button>

        <button 
          onClick={onSort}
          className="flex items-center space-x-2 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-gray-600 transition-all"
        >
          <ArrowUpDown className="w-4 h-4" />
          <span className="text-sm hidden sm:inline">Sort by...</span>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
