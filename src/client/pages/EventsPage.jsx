import { useState } from 'react';
import { Music, Globe, HeartPulse, Cpu, Briefcase, Dumbbell, Palette, GraduationCap, UtensilsCrossed, Star } from 'lucide-react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import EventSample from '../components/EventSample.jsx';

const allCategories = [
  { label: 'All', icon: <Star size={16} /> },
  { label: 'Music', icon: <Music size={16} /> },
  { label: 'Culture', icon: <Globe size={16} /> },
  { label: 'Health', icon: <HeartPulse size={16} /> },
  { label: 'Tech', icon: <Cpu size={16} /> },
  { label: 'Business', icon: <Briefcase size={16} /> },
  { label: 'Sports', icon: <Dumbbell size={16} /> },
  { label: 'Art', icon: <Palette size={16} /> },
  { label: 'Education', icon: <GraduationCap size={16} /> },
  { label: 'Food', icon: <UtensilsCrossed size={16} /> },
];

const EventsPage = () => {
  const [selectedCategories, setSelectedCategories] = useState(['All']);

  const toggleCategory = (label) => {
    if (label === 'All') {
      setSelectedCategories(selectedCategories.includes('All') ? [] : ['All']);
    } else {
      setSelectedCategories(prev => {
        const withoutAll = prev.filter(cat => cat !== 'All');
        
        if (withoutAll.includes(label)) {
          return withoutAll.filter(cat => cat !== label);
        } else {
          return [...withoutAll, label];
        }
      });
    }
  };
  const categories = [
    ...selectedCategories.filter(label => label !== 'All').map(label => 
      allCategories.find(cat => cat.label === label)
    ).filter(Boolean),
    ...(selectedCategories.includes('All') ? [allCategories[0]] : []),
    ...allCategories.filter(cat => 
      !selectedCategories.includes(cat.label) && cat.label !== 'All'
    )
  ];

  return (
    <>
      <Header />
      <div className="w-full overflow-x-auto px-6 py-4 bg-blue-50 shadow-md sticky top-0 z-10">
        <div className="flex space-x-4 min-w-max">
          {categories.map(({ label, icon }) => (
            <button
              key={label}
              onClick={() => toggleCategory(label)}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-full border-2 text-sm font-medium transition-all 
                ${selectedCategories.includes(label)
                  ? 'bg-light-blue text-white border-blue-600'
                  : 'bg-white text-gray-800 hover:text-white border-gray-300 hover:bg-light-blue'}
              `}
            >
              {icon}
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      <main className="flex flex-wrap justify-center gap-4 p-4 w-full box-border">
        {[...Array(10)].map((_, index) => (
          <div key={index} className="w-[22%] min-w-[250px]">
            <EventSample />
          </div>
        ))}
      </main>

      <Footer />
    </>
  );
};

export default EventsPage;