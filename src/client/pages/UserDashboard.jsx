import React from "react";
import Header from "../components/Header.jsx";
import UserSideBar from "../sections/UserSideBar.jsx";
import MyRSVP from "../sections/MyRSVP.jsx";

const UserDashboard = () => {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Header />
      <div className="flex flex-col md:flex-row flex-1 px-4 md:px-0 gap-4">
        <UserSideBar />
        <MyRSVP />
      </div>
    </div>
  );
};

export default UserDashboard;
