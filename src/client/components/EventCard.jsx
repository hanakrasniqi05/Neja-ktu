import React from 'react';

const EventCard = ({ event }) => {
  const startDate = new Date(event.StartDateTime).toLocaleDateString();
  const endDate = new Date(event.EndDateTime).toLocaleDateString();

  return (
    <div className="w-64 flex-shrink-0 bg-white rounded-lg shadow-md overflow-hidden">
      <img 
        src={event.Image || '/default-event.jpg'} 
        alt={event.Title}
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <div className="flex items-center mb-2">
          <img 
            src={event.companyLogo || '/default-company.png'} 
            className="w-8 h-8 rounded-full mr-2"
            alt="Company"
          />
          <h3 className="font-bold text-lg">{event.Title}</h3>
        </div>
        <p className="text-gray-600 text-sm mb-2">{event.Location}</p>
        <p className="text-sm">
          {startDate} - {endDate}
        </p>
        <div className="mt-2 flex items-center">
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {event.popularity} attendees
          </span>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
