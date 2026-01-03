import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TripProvider } from "./context/TripContext";
import { LanguageProvider } from "./context/LanguageContext";
import Dashboard from "./pages/Dashboard";
import CreateTrip from "./pages/CreateTrip";
import MyTrips from "./pages/MyTrips";
import ItineraryBuilder from "./pages/ItineraryBuilder";
import TimelineView from "./pages/TimelineView";
import GlobalCalendar from "./pages/GlobalCalendar";
import BudgetTracker from "./pages/BudgetTracker";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';
import Signup from './pages/Signup';
import Community from "./pages/Community";
import "./App.css";

function App() {
  return (
    <LanguageProvider>
      <TripProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-trip" element={<CreateTrip />} />
            <Route path="/my-trips" element={<MyTrips />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/calendar" element={<GlobalCalendar />} />
            <Route path="/budget" element={<BudgetTracker />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/itinerary-builder" element={<ItineraryBuilder />} />
            <Route path='/community' element={<Community />} />
            <Route
              path="/itinerary-builder/:tripId"
              element={<ItineraryBuilder />}
            />
            <Route path="/timeline/:tripId" element={<TimelineView />} />
            <Route path="/timeline" element={<TimelineView />} />
          </Routes>
        </Router>
      </TripProvider>
    </LanguageProvider>
  );
}

export default App;
