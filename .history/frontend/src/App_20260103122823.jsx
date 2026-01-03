import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TripProvider } from './context/TripContext';
import Dashboard from './pages/Dashboard';
import CreateTrip from './pages/CreateTrip';
import MyTrips from './pages/MyTrips';
import ItineraryBuilder from './pages/ItineraryBuilder';
import TimelineView from './pages/TimelineView';
import Profile from './pages/Profile';
import './App.css';

function App() {
  return (
    <TripProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create-trip" element={<CreateTrip />} />
          <Route path="/my-trips" element={<MyTrips />} />
          <Route path="/itinerary-builder" element={<ItineraryBuilder />} />
          <Route path="/itinerary-builder/:tripId" element={<ItineraryBuilder />} />
          <Route path="/timeline/:tripId" element={<TimelineView />} />
          <Route path="/timeline" element={<TimelineView />} />
        </Routes>
      </Router>
    </TripProvider>
  );
}

export default App;
