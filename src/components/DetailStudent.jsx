import React, { useState } from "react";
import Header from "../block/Header";
import Footer from "../block/Footer";
import { Outlet, useNavigate } from "react-router-dom"; // Import useNavigate để chuyển hướng
import { Space, Table, Tag, Spin } from 'antd';
const DetailStudent = () => {
  // const [searchTerm, setSearchTerm] = useState(""); // State để lưu trữ giá trị tìm kiếm
  const navigate = useNavigate(); // Hook để chuyển hướng

  // Hàm xử lý khi nhấn nút tìm kiếm
  // const handleSearch = (event) => {
  //   setIsVisible(false);
  //   event.preventDefault(); // Ngăn chặn hành động mặc định của form
  //   // Chuyển hướng đến trang InformationPage và truyền giá trị tìm kiếm qua query parameters
  //   navigate(`/details/information?query=${searchTerm}`);
  // };


  return (
    <>
      <div className="">
        <Header />
        <div className="content-homepage min-h-screen">
          {/* <form className="w-2/5 mx-auto mt-10" onSubmit={handleSearch}>
            <label
              htmlFor="default-search"
              className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                id="default-search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật state khi nhập vào ô tìm kiếm
                className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-[4rem] placeholder:text-lg"
                placeholder="Nhập mã sinh viên"
                required
              />
              <button
                type="submit"
                className="text-white absolute end-2.5 bottom-3 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Search
              </button>
            </div>
          </form> */}
          <Outlet />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default DetailStudent;
