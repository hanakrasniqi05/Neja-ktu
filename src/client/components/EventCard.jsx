import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  const startDate = new Date(event.StartDateTime).toLocaleDateString();
  const endDate = new Date(event.EndDateTime).toLocaleDateString();

  // Build image URL
  const getImageUrl = () => {
    if (!event.Image) return '/default-event.jpg';
    
    if (event.Image.startsWith('http')) {
      return event.Image;
    } else if (event.Image.startsWith('/uploads/')) {
      return `http://localhost:5000${event.Image}`;
    } else {
      return `http://localhost:5000/uploads/${event.Image}`;
    }
  };

  return (
    <div className="w-64 flex-shrink-0 bg-white rounded-lg shadow-md overflow-hidden h-[360px] flex flex-col">
      <Link to={`/events/${event.EventID}`}>
        <img
          src={getImageUrl()}
          alt={event.Title}
          className="w-full h-40 object-cover"
          onError={(e) => {
            e.target.src = '/default-event.jpg';
          }}
        />
      </Link>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center mb-2">
            <img
              src={
                event.CompanyLogo
                  ? `http://localhost:5000/${event.CompanyLogo.replace(/^\/+/, '')}`
                  : '/default-company.png'
              }
              className="w-8 h-8 rounded-full mr-2 object-cover"
              alt="Company"
            />

            <h3 className="font-bold text-lg break-words">
              <Link to={`/events/${event.EventID}`} className="hover:underline">
                {event.Title}
              </Link>
            </h3>
          </div>
          <p
            className="text-gray-600 text-sm mb-2 truncate"
            title={event.Location}
          >
            {event.Location}
          </p>
          <p className="text-sm truncate" title={`${startDate} - ${endDate}`}>
            {startDate} - {endDate}
          </p>
        </div>
        <div className="mt-2">
          <Link
            to={`/events/${event.EventID}`}
            className="text-blue-600 text-sm font-semibold hover:underline"
          >
            More →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
