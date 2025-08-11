import React from "react";
import logo from "../assets/logopin.png";

const NotFound = () => {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen text-white px-6"
      style={{
        background: "linear-gradient(to bottom, #023E8A, #008080)",
      }}
    >
      <div className="flex items-center text-[12rem] select-none">
        <span>4</span>
        <img
          src={logo}
          alt="Kosovo Map Logo"
          className="w-40 h-40 mx-6 object-contain"
        />
        <span>4</span>
      </div>
      <p className="text-center mt-6 text-3xl  leading-relaxed">
        Oops, you’ve wandered off the path
        <br />
        let’s head back to where the events are
      </p>
      <button
        onClick={() => (window.location.href = "/")}
        className="mt-10 bg-gray-200 text-black px-10 py-4 rounded-lg hover:bg-gray-300 transition text-xl font-semibold"
      >
        Go back home
      </button>
    </div>
  );
};

export default NotFound;
