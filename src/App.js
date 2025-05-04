import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import SignUp from './pages/SignUp'; 
import LogIn from './pages/LogIn';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage  />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />   
      </Routes>
    </Router>
  );
}

export default App;
