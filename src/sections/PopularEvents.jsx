import React from 'react';
import EventSample from '../components/EventSample';

const PopularEvents = () => {
  return (
    <div className="p-4">
      <h2 className="text-4xl font-bold mb-10 text-center w-full text-dark-blue">Popular Now</h2>
        <div className="overflow-x-auto pb-4">
          <div className="flex flex-nowrap gap-4 w-max">
            <EventSample />
            <EventSample />
            <EventSample />
            <EventSample />
            <EventSample />
            <EventSample />
          </div>
        </div>
    </div>
  );
};

export default PopularEvents;
