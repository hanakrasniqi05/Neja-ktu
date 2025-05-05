import React from 'react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

import HeroSection from '../components/about/HeroSection';
import ValueProposition from '../components/about/ValueProposition';

const AboutUs = () => {
  return (
    <div className='bg-gradient-to-b from-white to-blue-50'>
      <Header/>
      <HeroSection/>
      <ValueProposition/>
      <Footer/>
    </div>
  );
};

export default AboutUs;