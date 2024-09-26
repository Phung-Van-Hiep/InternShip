import React, { useState } from "react";
import Header from "../block/Header";
import Footer from "../block/Footer";
import { Outlet, useNavigate } from "react-router-dom"; 
const DetailStudent = () => {
  const navigate = useNavigate(); // Hook để chuyển hướng
  return (
    <>
      <div className="">
        <Header />
        <div className="content-homepage min-h-screen">
          <Outlet />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default DetailStudent;
