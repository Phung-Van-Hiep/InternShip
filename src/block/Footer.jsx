import React from "react";

const Footer = () => {
  return (
    <>
        <div className="footer-wrapper">
          <div className="footer-container w-full flex justify-between">
            <div className="logo-LeftFooter w-4/5 relative">
              <img
                className="h-[9.3rem] w-full"
                src="/images/footer/Picture1.jpg"
                alt="Logo-left"
              />
              <p className="absolute inset-0 flex justify-center items-center text-white text-2xl font-bold">
                Copyright © 2021 Thang Long University. All rights reserved.
              </p>
            </div>
            <div className="logo-RightFooter w-1/5">
              <img
                className="h-[9.3rem] w-full"
                src="/images/footer/Picture2.jpg"
                alt="Logo-right"
              />
            </div>
          </div>
        </div>
    </>
  );
};

export default Footer;
