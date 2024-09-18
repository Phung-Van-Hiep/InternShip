
import React from "react";

const Header = () =>{
    return (
    <>
    <div className="header-wrapper h-[14rem] shadow">
    <div className="header-container w-full h-[14rem] flex justify-between">
    <div className="logo-LeftHeader h-[10rem] w-2/5">
      <img
        className="h-[14rem] w-full"
        src="/images/header/Picture2.jpg"
        alt="Logo-Left"
      />
    </div>
    <div className="logo-RightHeader h-[10rem] w-3/5 relative">
      <img
        className="h-[14rem] w-full object-cover"
        src="/images/header/Picture3.jpg"
        alt="Logo-right"
      />
      <img
        className="absolute top-6 right-0 w-1/2 h-full object-contain"
        src="/images/header/logo-tlu.png"
        alt="Logo-TLU"
      />
    </div>
  </div>
</div>
    </>
    )
}

export default Header;