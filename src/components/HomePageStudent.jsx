import React, { useState, useEffect } from "react";
import Header from "../block/Header";
import Footer from "../block/Footer";
import { Outlet, useNavigate } from "react-router-dom";
import { Space, Table, Tag, Spin } from 'antd';
import axios from 'axios';

const HomePageStudent = () => {
  const ma_gv = localStorage.getItem('username');
  const [searchTerm, setSearchTerm] = useState(""); 
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const [data, setData] = useState(JSON.parse(localStorage.getItem('studentData')) || []);
  const [loading, setLoading] = useState(false);

  const handleSearch = (event) => {
    setIsVisible(false);
    event.preventDefault(); 
    navigate(`/details/information?query=${searchTerm}`);
  };

  const handleDetail = (ma_sv) => {
    setIsVisible(false);
    navigate(`/details/information?query=${ma_sv}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (data.length === 0) { // Only fetch if data is empty
        try {
          setLoading(true);
          const response = await axios.get(`https://myapp-api-wds1.onrender.com/api/instructor?a=${ma_gv}`);
          const result = response.data;
          console.log('Dữ liệu API:', result);
          if (result && result.ND) {
            const fetchedData = result.ND.map(student => ({
              key: student.MSV,
              student_code: student.MSV,
              name: student.TEN_SV,
              tags: [student.MUC_DO]
            }));
            setData(fetchedData);
            localStorage.setItem('studentData', JSON.stringify(fetchedData)); // Store data in localStorage
          }
        } catch (error) {
          console.error('Lỗi khi lấy dữ liệu:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [data.length, ma_gv]);

  const columns = [
    {
      title: 'Mã sinh viên',
      dataIndex: 'student_code',
      key: 'student_code',
    },
    {
      title: 'Tên sinh viên',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Mức độ hoàn thành',
      key: 'tags',
      dataIndex: 'tags',
      render: (_, { tags }) => (
        <>
          {tags.map((tag) => {
            let color = tag.length > 10 ? 'red' : 'blue';
            if (tag === 'CHUA_HOAN_THANH') {
              return (
                <Tag color={color} key={tag}>
                  Chưa hoàn thành
                </Tag>
              );
            } else {
              return (
                <Tag color={color} key={tag}>
                  Hoàn thành
                </Tag>
              );
            }
          })}
        </>
      ),
    },
    {
      title: '',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <button
            onClick={() => handleDetail(record.student_code)}
            className="text-blue-500"
          >
            Xem chi tiết
          </button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="">
        <Header />
        <div className="content-homepage min-h-screen">
          <form className="w-2/5 mx-auto mt-10" onSubmit={handleSearch}>
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
                onChange={(e) => setSearchTerm(e.target.value)}
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
          </form>
          <div>
            {loading ? (
              <div className="flex items-center justify-center mt-20">
                <Spin size="large" />
              </div>
            )
              : (
                isVisible && <Table className="m-40" columns={columns} dataSource={data} />
              )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default HomePageStudent;
