import React from 'react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

import HeroSection from '../sections/HeroSection.jsx';
import ValueProposition from '../sections/ValueProposition.jsx';
import USPShowcase from '../sections/USPShowcase.jsx';
import CTASection from '../sections/CTASection.jsx';

const AboutUs = () => {
  return (
    <div className='bg-gradient-to-b from-white to-blue-50'>
      <Header/>
      <HeroSection/>
      <ValueProposition/>
      <USPShowcase/>
      <CTASection/>
      <Footer/>
    </div>
  );
};

export default AboutUs;