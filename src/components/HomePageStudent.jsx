import React, { useState, useEffect } from "react";
import Header from "../block/Header";
import Footer from "../block/Footer";
import { Outlet, useNavigate } from "react-router-dom";
import { Space, Table, Tag, Spin, Button } from 'antd';
import axios from 'axios';

const HomePageStudent = () => {
  const ma_gv = localStorage.getItem('username');
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const [classData, setClassData] = useState([]); // Dữ liệu lớp học
  const [loading, setLoading] = useState(false);
  const [expandedClass, setExpandedClass] = useState(null);

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
      const storedData = localStorage.getItem('classData');

      if (storedData) {
        setClassData(JSON.parse(storedData)); // Load from localStorage if data exists
      } else {
        try {
          setLoading(true);
          const response = await axios.get(`https://myapp-api-wds1.onrender.com/api/instructor2?a=${ma_gv}`);
          const result = response.data;
          console.log('Dữ liệu API:', result);
          if (result && result.ND) {
            setClassData(result.ND); // Lưu trữ dữ liệu lớp học
            localStorage.setItem('classData', JSON.stringify(result.ND)); // Save to localStorage
          }
        } catch (error) {
          console.error('Lỗi khi lấy dữ liệu:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [ma_gv]);

  const studentColumns = [
    {
      title: 'Mã sinh viên',
      dataIndex: 'MSV',
      key: 'MSV',
    },
    {
      title: 'Tên sinh viên',
      dataIndex: 'TEN_SV',
      key: 'TEN_SV',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Mức độ hoàn thành',
      key: 'MUC_DO',
      dataIndex: 'MUC_DO',
      render: (tag) => {
        let color = tag.length > 10 ? 'red' : 'blue';
        if (tag === 'CHUA_HOAN_THANH') {
          return <Tag color={color}>Chưa hoàn thành</Tag>;
        } else {
          return <Tag color={color}>Hoàn thành</Tag>;
        }
      },
    },
    {
      title: '',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <button
            onClick={() => handleDetail(record.MSV)}
            className="text-blue-500"
          >
            Xem chi tiết
          </button>
        </Space>
      ),
    },
  ];

  const classColumns = [
    {
      title: 'Tên lớp',
      dataIndex: 'TEN_LOP',
      key: 'TEN_LOP',
      width: 500
    },
    {
      title: 'ACtion',
      key: 'action',
      render: (_, record) => (
        <Button onClick={() => setExpandedClass(expandedClass === record.TEN_LOP ? null : record.TEN_LOP)}>
          {expandedClass === record.TEN_LOP ? "Ẩn đi" : "Xem danh sách"}
        </Button>
      ),
    },
  ];

  return (
    <>
      <div className="">
        <Header />
        <div className="content-homepage min-h-screen">
          <div className="text-xl text-center mt-10" style={{color:"#333333"}}>
            Hiện tại chương trình chỉ cài đặt xem được danh sách lớp TT35CL01, chỉ cài đặt xem được CTĐT K35 Khoa Toán-Tin.
            Nhưng bạn vẫn có thể sử dụng thanh tìm kiếm để nhập mã sinh viên K35 ngành Công nghệ thông tin
          </div>
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
            ) : (
              isVisible && (
                <>
                  <div className="m-40">

                    {classData.map((classItem) => {
                      // console.log(classItem); // Kiểm tra dữ liệu của classItem
                      return (
                        <div key={classItem.TEN_LOP}>
                          <Table
                            columns={classColumns}
                            dataSource={[classItem]}
                            pagination={false}
                            showHeader={false}
                            rowKey="TEN_LOP"
                          />
                          {expandedClass === classItem.TEN_LOP && classItem.DS.length > 0 && (
                            <Table
                              columns={studentColumns}
                              dataSource={classItem.DS}
                              pagination={false}
                              rowKey="MSV" // Đảm bảo rằng MSV của sinh viên là duy nhất
                            />
                          )}
                          {expandedClass === classItem.TEN_LOP && classItem.DS.length === 0 && (
                            <div className="text-center text-xl">Không có sinh viên trong lớp này.</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )
            )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default HomePageStudent;