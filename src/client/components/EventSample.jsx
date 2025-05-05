import React from "react";

const EventSample = () => {
  return (
    <div className=" flex items-center justify-center p-4 ">
      <div className="bg-white rounded-xl shadow-md overflow-hidden max-w-sm w-full">
        <div className="h-40 bg-gradient-to-r from-dark-blue to-blue flex items-center justify-center">
          <span className="text-white text-xl font-bold">Event Image</span>
        </div>
        <div className="p-6">
          <p className="text-gray-500 text-sm font-medium mb-1">Tomorrow 21:00</p>
          <p className="text-lg font-semibold text-gray-700 mb-4">
            JERICHO Band - new album
          </p>

          <div className="space-y-3">
            <div className="flex items-center">
              <span className="text-gray-700">Rockuzina</span>
            </div>
            <a
              href="/event-details"
              className="block mt-4 px-4 py-2 bg-dark-blue text-white text-center rounded-lg hover:bg-light-blue transition duration-200"
            >
              View More
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventSample;