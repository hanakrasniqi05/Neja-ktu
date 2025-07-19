import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './client/pages/HomePage';
import EventsPage from './client/pages/EventsPage';
import ScrollToTop from './ScrollToTop';
import SignUp from './client/pages/SignUp'; 
import LogIn from './client/pages/LogIn';
import AboutUs from './client/pages/AboutUs';
import PrivateRoute from './client/components/PrivateRoute';
import Unauthorized from './client/pages/Unauthorized';
import TestPage from './client/pages/TestPage';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage  />} />
        <Route path="/about-us" element={<AboutUs  />} /> 
        <Route path="/login" element={<LogIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route
          path="/test-admin"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <TestPage role="Admin" />
            </PrivateRoute>
          }
        />

        <Route
          path="/test-company"
          element={
            <PrivateRoute allowedRoles={['admin', 'company']}>
              <TestPage role="Company" />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/test-user"
          element={
            <PrivateRoute allowedRoles={['admin', 'company', 'user']}>
              <TestPage role="User" />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

