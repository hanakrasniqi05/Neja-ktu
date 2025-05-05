import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './client/pages/HomePage';
import EventsPage from './client/pages/EventsPage';
import ScrollToTop from './ScrollToTop';
import SignUp from './client/pages/SignUp'; 
import LogIn from './client/pages/LogIn';
import AboutUs from './client/pages/AboutUs';

function App() {
  return (

    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage  />} />
        <Route path="/about-us" element={<AboutUs  />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />   
      </Routes>
    </Router>
  );
}

export default App;
