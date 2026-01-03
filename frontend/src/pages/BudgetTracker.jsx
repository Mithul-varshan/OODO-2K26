import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  Plane,
  Hotel,
  Utensils,
  ShoppingBag,
  Calendar,
  PieChart,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Edit2,
  Check,
  X
} from 'lucide-react';
import Header from '../components/Header';
import { useTrips } from '../context/TripContext';

const BudgetTracker = () => {
  const navigate = useNavigate();
  const { trips, updateTripBudget } = useTrips();
  const [selectedTripId, setSelectedTripId] = useState(null);
  const [viewMode, setViewMode] = useState('pie'); // 'pie' or 'bar'
  const [editingBudget, setEditingBudget] = useState(null); // { tripId, value }
  const [budgetInput, setBudgetInput] = useState('');

  // Get selected trip or aggregate all trips
  const selectedTrip = selectedTripId ? trips.find(t => t.id === parseInt(selectedTripId)) : null;
  const tripsToAnalyze = selectedTrip ? [selectedTrip] : trips;

  // Budget management functions
  const startEditingBudget = (tripId, currentBudget) => {
    setEditingBudget(tripId);
    setBudgetInput(currentBudget?.toString() || '');
  };

  const saveBudget = () => {
    if (editingBudget && budgetInput) {
      const budget = parseFloat(budgetInput) || 0;
      updateTripBudget(editingBudget, budget);
      setEditingBudget(null);
      setBudgetInput('');
    }
  };

  const cancelEditingBudget = () => {
    setEditingBudget(null);
    setBudgetInput('');
  };

  // Calculate total budget and remaining
  const totalBudget = useMemo(() => {
    return tripsToAnalyze.reduce((sum, trip) => sum + (trip.budget || 0), 0);
  }, [tripsToAnalyze]);

  // Calculate comprehensive budget breakdown
  const budgetData = useMemo(() => {
    const categories = {
      transport: { total: 0, items: [], icon: Plane, color: 'blue' },
      accommodation: { total: 0, items: [], icon: Hotel, color: 'purple' },
      food: { total: 0, items: [], icon: Utensils, color: 'orange' },
      activities: { total: 0, items: [], icon: ShoppingBag, color: 'green' },
      shopping: { total: 0, items: [], icon: ShoppingBag, color: 'pink' },
      other: { total: 0, items: [], icon: DollarSign, color: 'gray' }
    };

    let totalCost = 0;
    let totalDays = 0;
    const dailyCosts = {};
    const tripBreakdowns = [];

    tripsToAnalyze.forEach(trip => {
      if (!trip.stops || trip.stops.length === 0) return;

      let tripTotal = 0;
      const tripDailyCosts = {};

      // Calculate trip duration
      if (trip.startDate && trip.endDate) {
        const start = new Date(trip.startDate);
        const end = new Date(trip.endDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        totalDays += days;
      }

      trip.stops.forEach(stop => {
        if (!stop.activities) return;

        stop.activities.forEach(activity => {
          const cost = parseFloat(activity.cost) || 0;
          const type = (activity.type || 'other').toLowerCase();
          const date = activity.date;

          // Categorize
          let category = 'other';
          if (type.includes('transport') || type.includes('plane') || type.includes('train') || type.includes('bus') || type.includes('car')) {
            category = 'transport';
          } else if (type.includes('accommodation') || type.includes('hotel') || type.includes('hostel')) {
            category = 'accommodation';
          } else if (type.includes('food') || type.includes('meal') || type.includes('restaurant') || type.includes('dining')) {
            category = 'food';
          } else if (type.includes('shopping') || type.includes('shop')) {
            category = 'shopping';
          } else if (type.includes('sightseeing') || type.includes('culture') || type.includes('adventure') || type.includes('leisure') || type.includes('entertainment')) {
            category = 'activities';
          }

          categories[category].total += cost;
          categories[category].items.push({
            name: activity.name,
            cost,
            date,
            trip: trip.name,
            stop: stop.city?.name || stop.cityName || stop.city_name
          });

          tripTotal += cost;
          totalCost += cost;

          // Track daily costs
          if (date) {
            dailyCosts[date] = (dailyCosts[date] || 0) + cost;
            tripDailyCosts[date] = (tripDailyCosts[date] || 0) + cost;
          }
        });
      });

      tripBreakdowns.push({
        id: trip.id,
        name: trip.name,
        total: tripTotal,
        dailyCosts: tripDailyCosts,
        startDate: trip.startDate,
        endDate: trip.endDate
      });
    });

    return {
      categories,
      totalCost,
      totalDays,
      dailyCosts,
      tripBreakdowns,
      avgPerDay: totalDays > 0 ? totalCost / totalDays : 0
    };
  }, [tripsToAnalyze]);

  // Identify overbudget days (days with costs above average + 50%)
  const overbudgetDays = useMemo(() => {
    if (budgetData.avgPerDay === 0) return [];
    const threshold = budgetData.avgPerDay * 1.5;
    return Object.entries(budgetData.dailyCosts)
      .filter(([_, cost]) => cost > threshold)
      .map(([date, cost]) => ({
        date,
        cost,
        excess: cost - threshold
      }))
      .sort((a, b) => b.cost - a.cost);
  }, [budgetData]);

  // Calculate percentage for pie chart
  const categoryPercentages = useMemo(() => {
    if (budgetData.totalCost === 0) return [];
    return Object.entries(budgetData.categories)
      .map(([name, data]) => ({
        name,
        value: data.total,
        percentage: (data.total / budgetData.totalCost) * 100,
        ...data
      }))
      .filter(c => c.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [budgetData]);

  // Simple pie chart using CSS conic-gradient
  const pieChartGradient = useMemo(() => {
    if (categoryPercentages.length === 0) return '';
    
    const colors = {
      blue: '#3b82f6',
      purple: '#a855f7',
      orange: '#f97316',
      green: '#10b981',
      pink: '#ec4899',
      gray: '#6b7280'
    };

    let currentAngle = 0;
    const segments = categoryPercentages.map(cat => {
      const angle = (cat.percentage / 100) * 360;
      const start = currentAngle;
      const end = currentAngle + angle;
      currentAngle = end;
      return `${colors[cat.color]} ${start}deg ${end}deg`;
    });

    return `conic-gradient(${segments.join(', ')})`;
  }, [categoryPercentages]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-600/20 rounded-xl">
              <DollarSign className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Budget Tracker</h1>
              <p className="text-gray-400">Monitor your travel expenses</p>
            </div>
          </div>

          {/* Trip Selector */}
          <select
            value={selectedTripId || ''}
            onChange={(e) => setSelectedTripId(e.target.value || null)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">All Trips</option>
            {trips.map(trip => (
              <option key={trip.id} value={trip.id}>{trip.name}</option>
            ))}
          </select>
        </div>

        {trips.length === 0 ? (
          <div className="text-center py-16 bg-gray-800 rounded-xl border border-gray-700">
            <DollarSign className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No trips to analyze</h3>
            <p className="text-gray-500">Create a trip to start tracking your budget</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Total Expenses */}
              <div className="bg-gradient-to-br from-red-600/20 to-red-600/5 border border-red-500/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Total Expenses</span>
                  <DollarSign className="w-5 h-5 text-red-400" />
                </div>
                <p className="text-3xl font-bold text-white">${budgetData.totalCost.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {selectedTrip ? `${selectedTrip.name}` : `${trips.length} trips`}
                </p>
              </div>

              {/* Budget Limit */}
              <div className="bg-gradient-to-br from-green-600/20 to-green-600/5 border border-green-500/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Budget Limit</span>
                  {selectedTrip ? (
                    editingBudget === selectedTrip.id ? (
                      <div className="flex items-center space-x-1">
                        <button onClick={saveBudget} className="p-1 hover:bg-green-600/20 rounded">
                          <Check className="w-4 h-4 text-green-400" />
                        </button>
                        <button onClick={cancelEditingBudget} className="p-1 hover:bg-red-600/20 rounded">
                          <X className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => startEditingBudget(selectedTrip.id, selectedTrip.budget)}
                        className="p-1 hover:bg-green-600/20 rounded transition-colors"
                        title="Click to set budget limit"
                      >
                        <Edit2 className="w-4 h-4 text-green-400" />
                      </button>
                    )
                  ) : (
                    <span className="text-xs text-gray-500">Select a trip to edit</span>
                  )}
                </div>
                {editingBudget === selectedTrip?.id ? (
                  <input
                    type="number"
                    value={budgetInput}
                    onChange={(e) => setBudgetInput(e.target.value)}
                    className="w-full px-2 py-1 bg-gray-900 border border-green-500 rounded text-xl font-bold text-white focus:outline-none"
                    placeholder="0.00"
                    autoFocus
                  />
                ) : (
                  <>
                    <p className="text-3xl font-bold text-white">${totalBudget.toFixed(2)}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {totalBudget > 0 ? (
                        totalBudget >= budgetData.totalCost ? (
                          <span className="text-green-400">Under budget</span>
                        ) : (
                          <span className="text-red-400">Over budget</span>
                        )
                      ) : (
                        selectedTrip ? 'Click to set' : 'Set per trip'
                      )}
                    </p>
                  </>
                )}
              </div>

              {/* Remaining/Over Budget */}
              <div className={`bg-gradient-to-br ${totalBudget > 0 && budgetData.totalCost > totalBudget ? 'from-red-600/20 to-red-600/5 border-red-500/30' : 'from-blue-600/20 to-blue-600/5 border-blue-500/30'} border rounded-xl p-6`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">
                    {totalBudget > 0 && budgetData.totalCost > totalBudget ? 'Over Budget' : 'Remaining'}
                  </span>
                  {totalBudget > 0 && budgetData.totalCost > totalBudget ? (
                    <ArrowUpRight className="w-5 h-5 text-red-400" />
                  ) : (
                    <ArrowDownRight className="w-5 h-5 text-blue-400" />
                  )}
                </div>
                <p className={`text-3xl font-bold ${totalBudget > 0 && budgetData.totalCost > totalBudget ? 'text-red-400' : 'text-white'}`}>
                  ${Math.abs(totalBudget - budgetData.totalCost).toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {totalBudget > 0 ? (
                    <span>{((budgetData.totalCost / totalBudget) * 100).toFixed(1)}% used</span>
                  ) : (
                    'Set budget to track'
                  )}
                </p>
              </div>

              {/* Average Per Day */}
              <div className="bg-gradient-to-br from-purple-600/20 to-purple-600/5 border border-purple-500/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Avg per Day</span>
                  <Calendar className="w-5 h-5 text-purple-400" />
                </div>
                <p className="text-3xl font-bold text-white">${budgetData.avgPerDay.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">{budgetData.totalDays} days total</p>
              </div>
            </div>

            {/* Budget Progress Bar */}
            {totalBudget > 0 && (
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white">Budget Overview</h3>
                  <span className={`text-sm font-medium ${budgetData.totalCost > totalBudget ? 'text-red-400' : 'text-green-400'}`}>
                    {((budgetData.totalCost / totalBudget) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="relative w-full h-6 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      budgetData.totalCost > totalBudget 
                        ? 'bg-gradient-to-r from-red-500 to-red-600' 
                        : budgetData.totalCost > totalBudget * 0.8
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600'
                        : 'bg-gradient-to-r from-green-500 to-green-600'
                    }`}
                    style={{ width: `${Math.min((budgetData.totalCost / totalBudget) * 100, 100)}%` }}
                  />
                  {budgetData.totalCost > totalBudget && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between mt-2 text-sm text-gray-400">
                  <span>Spent: ${budgetData.totalCost.toFixed(2)}</span>
                  <span>Budget: ${totalBudget.toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-purple-600/20 to-purple-600/5 border border-purple-500/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Highest Category</span>
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                </div>
                <p className="text-2xl font-bold text-white capitalize">
                  {categoryPercentages[0]?.name || 'N/A'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  ${categoryPercentages[0]?.value.toFixed(2) || '0.00'}
                </p>
              </div>

              {/* Overbudget Days */}
              <div className="bg-gradient-to-br from-orange-600/20 to-orange-600/5 border border-orange-500/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Budget Alerts</span>
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                </div>
                <p className="text-3xl font-bold text-white">{overbudgetDays.length}</p>
                <p className="text-xs text-gray-500 mt-1">Overbudget days</p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Category Breakdown</h3>
                  <PieChart className="w-5 h-5 text-gray-400" />
                </div>

                <div className="flex flex-col items-center">
                  {categoryPercentages.length > 0 ? (
                    <>
                      <div 
                        className="w-48 h-48 rounded-full mb-6 shadow-lg"
                        style={{ background: pieChartGradient }}
                      />
                      <div className="w-full space-y-2">
                        {categoryPercentages.map(cat => {
                          const Icon = cat.icon;
                          return (
                            <div key={cat.name} className="flex items-center justify-between p-2 hover:bg-gray-700/50 rounded-lg transition-colors">
                              <div className="flex items-center space-x-3">
                                <div className={`w-3 h-3 rounded-full bg-${cat.color}-500`}></div>
                                <Icon className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-300 capitalize">{cat.name}</span>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-white">${cat.value.toFixed(2)}</p>
                                <p className="text-xs text-gray-500">{cat.percentage.toFixed(1)}%</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No expenses to display</p>
                  )}
                </div>
              </div>

              {/* Bar Chart - Daily Costs */}
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Daily Expenses</h3>
                  <BarChart3 className="w-5 h-5 text-gray-400" />
                </div>

                <div className="space-y-3">
                  {Object.entries(budgetData.dailyCosts)
                    .sort(([a], [b]) => new Date(b) - new Date(a))
                    .slice(0, 10)
                    .map(([date, cost]) => {
                      const percentage = budgetData.totalCost > 0 ? (cost / budgetData.totalCost) * 100 : 0;
                      const isOverBudget = cost > budgetData.avgPerDay * 1.5;
                      return (
                        <div key={date} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">{new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            <div className="flex items-center space-x-2">
                              <span className={`font-semibold ${isOverBudget ? 'text-orange-400' : 'text-white'}`}>
                                ${cost.toFixed(2)}
                              </span>
                              {isOverBudget && <AlertTriangle className="w-4 h-4 text-orange-400" />}
                            </div>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                            <div 
                              className={`h-full ${isOverBudget ? 'bg-orange-500' : 'bg-blue-500'} rounded-full transition-all duration-300`}
                              style={{ width: `${Math.min(percentage * 2, 100)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  {Object.keys(budgetData.dailyCosts).length === 0 && (
                    <p className="text-gray-500 text-center py-8">No daily expenses recorded</p>
                  )}
                </div>
              </div>
            </div>

            {/* Overbudget Days Alert */}
            {overbudgetDays.length > 0 && (
              <div className="bg-gradient-to-r from-orange-600/10 to-red-600/10 border border-orange-500/30 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <AlertTriangle className="w-6 h-6 text-orange-400 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">Budget Alerts</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      The following days exceed the average daily budget by more than 50%:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {overbudgetDays.slice(0, 6).map(day => (
                        <div key={day.date} className="bg-gray-800/50 border border-orange-500/20 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-300">
                              {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                            <ArrowUpRight className="w-4 h-4 text-orange-400" />
                          </div>
                          <p className="text-xl font-bold text-white">${day.cost.toFixed(2)}</p>
                          <p className="text-xs text-orange-400 mt-1">+${day.excess.toFixed(2)} over avg</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Category Details */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Expense Details</h3>
              <div className="space-y-4">
                {categoryPercentages.map(cat => {
                  const Icon = cat.icon;
                  return (
                    <div key={cat.name} className="border border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 bg-${cat.color}-600/20 rounded-lg`}>
                            <Icon className={`w-5 h-5 text-${cat.color}-400`} />
                          </div>
                          <div>
                            <h4 className="font-semibold text-white capitalize">{cat.name}</h4>
                            <p className="text-xs text-gray-500">{cat.items.length} items</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-white">${cat.value.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">{cat.percentage.toFixed(1)}%</p>
                        </div>
                      </div>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {cat.items.slice(0, 5).map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm py-1 border-t border-gray-700/50">
                            <div className="flex-1">
                              <span className="text-gray-300">{item.name}</span>
                              {item.stop && (
                                <span className="text-xs text-gray-500 ml-2">• {item.stop}</span>
                              )}
                            </div>
                            <span className="text-gray-400 ml-4">${item.cost.toFixed(2)}</span>
                          </div>
                        ))}
                        {cat.items.length > 5 && (
                          <p className="text-xs text-gray-500 italic pt-2">
                            +{cat.items.length - 5} more items
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default BudgetTracker;
