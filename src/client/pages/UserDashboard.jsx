import React from "react";
import Header from '../components/Header.jsx';
import UserSideBar from "../sections/UserSideBar.jsx";
import MyRSVP from "../sections/MyRSVP.jsx";

const UserDashboard = () => {
  return (
    <div>
      <Header />
      <div className="flex">
        <UserSideBar />
        <MyRSVP />
      </div>
    </div>
  );
};

export default UserDashboard;
