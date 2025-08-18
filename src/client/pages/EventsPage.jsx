import { useState, useEffect } from 'react';
import {
  Music, Globe, HeartPulse, Cpu, Briefcase, Dumbbell,
  Palette, GraduationCap, UtensilsCrossed, Star
} from 'lucide-react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import EventCard from '../components/EventCard.jsx';
import { eventCategoryAPI } from '../../services/api';

const allCategories = [
  { label: 'All', icon: <Star size={16} />, id: null },
  { label: 'Music', icon: <Music size={16} />, id: 1 },
  { label: 'Culture', icon: <Globe size={16} />, id: 2 },
  { label: 'Health', icon: <HeartPulse size={16} />, id: 3 },
  { label: 'Tech', icon: <Cpu size={16} />, id: 4 },
  { label: 'Business', icon: <Briefcase size={16} />, id: 5 },
  { label: 'Sports', icon: <Dumbbell size={16} />, id: 6 },
  { label: 'Art', icon: <Palette size={16} />, id: 7 },
  { label: 'Education', icon: <GraduationCap size={16} />, id: 8 },
  { label: 'Food', icon: <UtensilsCrossed size={16} />, id: 9 },
];

const EventsPage = () => {
  const [selectedCategories, setSelectedCategories] = useState(['All']);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async (categories) => {
    setLoading(true);
    try {
      let response;

      if (categories.includes('All') || categories.length === allCategories.length - 1) {
        response = await eventCategoryAPI.getAllEvents();
      } else {
        const categoryIds = categories
          .map(label => {
            const category = allCategories.find(cat => cat.label === label);
            return category?.id;
          })
          .filter(id => id !== null);

        response = await eventCategoryAPI.getEventsByCategories(categoryIds);
      }

      setEvents(response.data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(selectedCategories);
  }, [selectedCategories]);

  const handleCategoryClick = (label) => {
    setSelectedCategories(prev => {
      if (label === 'All') {
        return ['All'];
      }

      if (prev.includes(label)) {
        const newSelection = prev.filter(cat => cat !== label);
        return newSelection.length === 0 ? ['All'] : newSelection;
      }

      const newSelection = prev.includes('All')
        ? [label]
        : [...prev, label];

      if (newSelection.length === allCategories.length - 1) {
        return ['All'];
      }

      return newSelection;
    });
  };

  const getOrderedCategories = () => {
    const all = allCategories.find(c => c.label === 'All');
    const selected = allCategories.filter(c =>
      c.label !== 'All' && selectedCategories.includes(c.label)
    );
    const unselected = allCategories.filter(c =>
      c.label !== 'All' && !selectedCategories.includes(c.label)
    );

    return [all, ...selected, ...unselected];
  };

  return (
    <>
      <Header />
      <div className="w-full overflow-x-auto px-6 py-4 bg-blue-50 shadow-md sticky top-0 z-10">
        <div className="flex space-x-4 min-w-max">
          {getOrderedCategories().map(({ label, icon }) => (
            <button
              key={label}
              onClick={() => handleCategoryClick(label)}
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
        {loading ? (
          <p className="text-center text-gray-500">Loading events...</p>
        ) : events.length === 0 ? (
          <p className="text-center text-gray-500">No events found.</p>
        ) : (
          events.map((event, index) => (
            <div key={event.EventID || index} className="w-[22%] min-w-[250px]">
              <EventCard event={event} />
            </div>
          ))
        )}
      </main>

      <Footer />
    </>
  );
};

export default EventsPage;
