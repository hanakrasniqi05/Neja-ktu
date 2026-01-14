import { useState, useEffect } from 'react';
import {
  Music, Globe, HeartPulse, Cpu, Briefcase, Dumbbell,
  Palette, GraduationCap, UtensilsCrossed, Star
} from 'lucide-react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import EventCard from '../components/EventCard.jsx';
import { eventCategoryAPI } from '../../services/api';

const categoryIcons = {
  'Music': <Music size={16} />,
  'Culture': <Globe size={16} />,
  'Health': <HeartPulse size={16} />,
  'Tech': <Cpu size={16} />,
  'Business': <Briefcase size={16} />,
  'Sports': <Dumbbell size={16} />,
  'Art': <Palette size={16} />,
  'Education': <GraduationCap size={16} />,
  'Food': <UtensilsCrossed size={16} />,
  'All': <Star size={16} />
};

const EventsPage = () => {
  const [selectedCategories, setSelectedCategories] = useState(['All']);
  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasNoEventsForSelection, setHasNoEventsForSelection] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await eventCategoryAPI.getAllCategories();
        const eventsResponse = await eventCategoryAPI.getAllEvents();
        const allEventsData = eventsResponse.data || eventsResponse || [];
        setAllEvents(allEventsData);

        // Count events per category
        const stats = {};
        allEventsData.forEach(event => {
          if (event.categories) {
            event.categories.split(',').forEach(catName => {
              const trimmedCat = catName.trim();
              stats[trimmedCat] = (stats[trimmedCat] || 0) + 1;
            });
          }
        });

        // Build categories list
        const allCategoriesList = categoriesResponse.data.map(cat => ({
          label: cat.Name,
          id: cat.CategoryID,
          icon: categoryIcons[cat.Name] || <Star size={16} />,
          eventCount: stats[cat.Name] || 0,
          hasEvents: (stats[cat.Name] || 0) > 0
        }));

        allCategoriesList.sort((a, b) => {
          if (a.hasEvents !== b.hasEvents) return b.hasEvents - a.hasEvents;
          return a.label.localeCompare(b.label);
        });

        allCategoriesList.unshift({
          label: 'All',
          id: null,
          icon: <Star size={16} />,
          eventCount: allEventsData.length,
          hasEvents: allEventsData.length > 0
        });

        setCategories(allCategoriesList);
        setEvents(allEventsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setCategories([]);
        setEvents([]);
        setAllEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchEvents = async (selectedCats) => {
    setLoading(true);
    setHasNoEventsForSelection(false);

    try {
      let response;

      if (selectedCats.includes('All')) {
        response = await eventCategoryAPI.getAllEvents();
      } else {
        const categoryIds = selectedCats
          .map(catName => categories.find(c => c.label === catName)?.id)
          .filter(Boolean);

        if (categoryIds.length > 0) {
          const categoryQueryString = categoryIds.join(',');
          response = await eventCategoryAPI.getEventsByCategory(categoryQueryString);
        } else {
          response = await eventCategoryAPI.getAllEvents();
        }
      }

      setEvents(response.data);
      if (response.data.length === 0) setHasNoEventsForSelection(true);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
      setHasNoEventsForSelection(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categories.length > 0 && selectedCategories.length > 0 && !searchTerm.trim()) {
      fetchEvents(selectedCategories);
    }
  }, [selectedCategories, categories]);

  const getAllNonAllCategories = () => {
    return categories.filter(cat => cat.label !== 'All').map(cat => cat.label);
  };

  const handleCategoryClick = (label) => {
    setSelectedCategories(prev => {
      if (label === 'All') return ['All'];

      if (prev.includes(label)) {
        const newSelection = prev.filter(c => c !== label);
        if (newSelection.length === 0) {
          return ['All'];
        }
        const allNonAllCategories = getAllNonAllCategories();
        const areAllSelected = newSelection.length === allNonAllCategories.length && 
          allNonAllCategories.every(cat => newSelection.includes(cat));
        return areAllSelected ? ['All'] : newSelection;
      }
      if (prev.includes('All')) {
        return [label];
      }

      const newSelection = [...prev, label];
      const allNonAllCategories = getAllNonAllCategories();
      const areAllSelected = newSelection.length === allNonAllCategories.length && 
          allNonAllCategories.every(cat => newSelection.includes(cat));

      return areAllSelected ? ['All'] : newSelection;
    });
  };

  const getOrderedCategories = () => {
    const allCat = categories.find(c => c.label === 'All');
    const others = categories.filter(c => c.label !== 'All')
      .sort((a, b) => selectedCategories.includes(b.label) - selectedCategories.includes(a.label));
    return [allCat, ...others].filter(Boolean);
  };

  const showAllEvents = () => {
    setSelectedCategories(['All']);
    setSearchTerm('');
    setHasNoEventsForSelection(false);
  };

  // Filter events based on search term
  const getFilteredEvents = () => {
    if (!searchTerm.trim()) {
      return events;
    }
    
    const term = searchTerm.toLowerCase().trim();
    return allEvents.filter(event => {
      const eventTitle = event.Title || event.EventName || '';
      const location = event.Location || '';
      const categories = event.categories || '';
      return (
        eventTitle.toLowerCase().includes(term) ||
        location.toLowerCase().includes(term) ||
        categories.toLowerCase().includes(term)
      );
    });
  };

  const filteredEvents = getFilteredEvents();

  return (
    <>
      <Header />
      <div className="p-6 bg-blue-50 shadow-md">
        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search events by title, location, or category..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Category Buttons */}
        <div className="overflow-x-auto">
          <div className="flex space-x-4 min-w-max">
            {getOrderedCategories().map(({ label, icon, hasEvents }) => (
              <button
                key={label}
                type="button"
                onClick={() => handleCategoryClick(label)}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-full border-2 text-sm font-medium transition-all
                  ${selectedCategories.includes(label) || 
                    (label === 'All' && selectedCategories.length === getAllNonAllCategories().length)
                    ? 'bg-light-blue text-white border-blue-600'
                    : 'bg-white text-gray-800 border-gray-300 hover:bg-blue-50'}
                  ${!hasEvents && label !== 'All' ? 'opacity-60' : ''}`}
                title={!hasEvents && label !== 'All' ? `No events in ${label} category yet` : ''}
              >
                {icon}
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="flex flex-wrap justify-center gap-4 p-4 w-full box-border">
        {loading && !searchTerm.trim() ? (
          <div className="w-full text-center py-12">
            <p className="text-gray-500 text-lg">Loading events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="w-full text-center py-12">
            <p className="text-gray-500 text-lg mb-4">
              {searchTerm.trim() ? `No events found for "${searchTerm}"` : 'No events found'}
            </p>
            <p className="text-gray-500 mb-6">Try searching something else or</p>
            <button
              onClick={showAllEvents}
              className="px-6 py-2 bg-light-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Show All Events
            </button>
          </div>
        ) : (
          filteredEvents.map(event => (
            <div key={event.EventID || event.id} className="w-[22%] min-w-[250px]">
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