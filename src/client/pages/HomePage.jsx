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

      </main>

      <Footer />
    </>
  );
};

export default HomePage;
