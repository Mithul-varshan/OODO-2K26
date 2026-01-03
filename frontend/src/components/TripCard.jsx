import { MapPin, Calendar, DollarSign } from 'lucide-react';

const TripCard = ({ trip, variant = 'default' }) => {
  const { 
    id, 
    title, 
    image, 
    location, 
    country, 
    dates, 
    costIndex, 
    destinationCount 
  } = trip;

  // Variant styles
  const isRegional = variant === 'regional';
  
  return (
    <div className="group relative bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1">
      {/* Image Container */}
      <div className={`relative overflow-hidden ${isRegional ? 'h-32' : 'h-40'}`}>
        <img 
          src={image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400'} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
        
        {/* Cost Index Badge */}
        {costIndex && (
          <div className="absolute top-3 right-3 bg-gray-900/80 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1">
            <DollarSign className="w-3 h-3 text-green-400" />
            <span className="text-xs text-green-400 font-medium">{costIndex}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-white font-semibold text-lg truncate group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        
        {/* Location */}
        <div className="flex items-center space-x-1 mt-2 text-gray-400">
          <MapPin className="w-4 h-4" />
          <span className="text-sm truncate">
            {location}{country && `, ${country}`}
          </span>
        </div>

        {/* Additional Info */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700">
          {dates && (
            <div className="flex items-center space-x-1 text-gray-400">
              <Calendar className="w-4 h-4" />
              <span className="text-xs">{dates}</span>
            </div>
          )}
          
          {destinationCount && (
            <span className="text-xs text-blue-400 font-medium">
              {destinationCount} stops
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripCard;
