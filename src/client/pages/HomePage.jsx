import React from 'react';
import { useNavigate } from 'react-router-dom';

import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

import HeroHeader from '../sections/HeroHeader.jsx';
import PopularEvents from '../sections/PopularEvents.jsx';
import OurCompanies from '../sections/OurCompanies.jsx';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />

      <main>
        <HeroHeader />
        <PopularEvents />
        <OurCompanies />

        {/* Butoni për të shkuar te AdminDashboard */}
        <div className="my-8 text-center">
          <button
            onClick={() => navigate('/admin-dashboard')}
            className="bg-teal-600 text-white px-6 py-3 rounded hover:bg-teal-700"
          >
            Go to Admin Dashboard
          </button>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default HomePage;
