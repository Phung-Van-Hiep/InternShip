import React, { lazy, useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { Table, Button, Divider, Spin, Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";

const InformationPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("query");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false); // state to toggle the table
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  useEffect(() => {
    if (!query) return;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
           `https://myapp-api-wds1.onrender.com/api/student?a=${query}`
        );
        // const response = await axios.get('/images/jsonformatter.json');

        if (response.data) {
          setData(response.data);
        } else {
          setError("Không tìm thấy thông tin sinh viên.");
        }
      } catch (error) {
        setError(
          error.response?.data?.message ||
          "Không tìm thấy sinh viên hoặc lỗi kết nối."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  const columns = [
    {
      title: "Thông tin",
      dataIndex: "label",
      key: "label",
    },
    {
      title: "Chi tiết",
      dataIndex: "value",
      key: "value",
    },
  ];

  const formatData = (data) => {
    if (!data || !Array.isArray(data.ND)) return [];
    return [
      {
        key: "MSV",
        label: "Mã sinh viên",
        value: data.MSV,
      },
      {
        key: "Name",
        label: "Tên sinh viên",
        value: data.TEN_SV,
      },
      {
        key: "classes",
        label: "Lớp học",
        value: data.ND.map((item) => item.TEN_LOP).join(", "),
      },

    ];
  };

  const getCategoryStatus = (category) => {
    if (!category || !category.DS) {
      return { status: "Chưa hoàn thành", courses: [], bins: [] }; // Đảm bảo bins cũng được khởi tạo
    }

    const courses = [];
    const bins = [];

    // Lấy danh sách môn học từ DS nếu có
    if (Array.isArray(category.DS)) {
      category.DS.forEach((item) => {
        if (item && item.CHU_THICH) {
          if (Array.isArray(item.ND)) {
            item.ND.forEach((ndItem) => {
              bins.push({
                key: ndItem?.TEN,
                status: ndItem?.DIEU_KIEN,
                courses1: ndItem?.DS?.map((hp) => ({
                  key: hp?.MA_MON,
                  course: hp?.TEN_MON,
                  credits: hp?.STC,
                  status: (
                    <div>
                      {hp?.TRANG_THAI.map((status, index) => {
                        let className = "border inline-block p-2 m-1 rounded";
                        if (status === "Đã học") {
                          className += " border-green-500 bg-green-100 text-green-800";
                        } else if (status === "Chưa học, có thể đăng kí") {
                          className += " border-orange-500 bg-orange-100 text-orange-800";
                        } else {
                          className += " border-red-500 bg-red-100 text-red-700";
                        }
                        return (
                          <div key={index} className={className}>
                            {status}
                          </div>
                        );
                      })}
                    </div>
                  ),
                })) || [],
                condition: item?.CHU_THICH,
              });
            });
          }
        }

        if (item && item.MA_MON) {
          courses.push({
            key: item?.MA_MON,
            course: item?.TEN_MON,
            credits: item?.STC,
            condition: (
              <div>
                {item?.TRANG_THAI.map((status, index) => {
                  let className = "border inline-block p-2 m-1 rounded";
                  if (status === "Đã học") {
                    className += " border-green-500 bg-green-100 text-green-800";
                  } else if (status === "Chưa học, có thể đăng kí") {
                    className += " border-orange-500 bg-orange-100 text-orange-800";
                  } else {
                    className += " border-red-500 bg-red-100 text-red-700";
                  }
                  return (
                    <div key={index} className={className}>
                      {status}
                    </div>
                  );
                })}
              </div>
            ),
          });
        }
      });
    }

    const status = category.TRANG_THAI === "CHUA_HOAN_THANH" ? "Thiếu" : "Xong";

    return {
      status,
      bins,
      courses,
      element: (
        <div >
          {status}
        </div>
      ),
    };
  };

  const CategoryTable = ({ record }) => {
    const [expandedCategoryKeys, setExpandedCategoryKeys] = useState([]);

    const handleShowDetails = (expanded, binRecord) => {
      setExpandedCategoryKeys((prevKeys) => {
        if (expanded) {
          return [...prevKeys, binRecord.key];
        } else {
          return prevKeys.filter((key) => key !== binRecord.key);
        }
      });
    };

    const classes = data.ND.find((item) => item.TEN_LOP === record.class);

    const categoryData = [
      { key: 'DAI_CUONG_CON_LAI', category: 'Đại cương', status: getCategoryStatus(classes?.ND?.DAI_CUONG_CON_LAI) },
      { key: 'CO_SO_CON_LAI', category: 'Cơ sở', status: getCategoryStatus(classes?.ND?.CO_SO_CON_LAI) },
      { key: 'BAT_BUOC_CON_LAI', category: 'Bắt buộc', status: getCategoryStatus(classes?.ND?.BAT_BUOC_CON_LAI) },
      { key: 'LUA_CHON_CON_LAI', category: 'Lựa chọn', status: getCategoryStatus(classes?.ND?.LUA_CHON_CON_LAI) },
      { key: 'TOT_NGHIEP_CON_LAI', category: 'CĐTN/KLTN', status: getCategoryStatus(classes?.ND?.TOT_NGHIEP_CON_LAI) },
      { key: 'TU_DO_CON_LAI', category: 'Tự do', status: getCategoryStatus(classes?.ND?.TU_DO_CON_LAI) },
    ];

    return (
      <Tabs defaultActiveKey="0" items={categoryData.map((category, index) => ({
        key: index.toString(), // Chuyển index thành chuỗi để làm key
        label: (
          <span className="mr-6">
            {category.category} <span
              className={`inline-block px-2 py-1 rounded-lg 
              ${category.status.status === 'Xong' ? 'border border-sky-600 bg-sky-100 text-sky-900' : 'border border-orange-500 bg-orange-100 text-orange-800'}`}
            >
              {`${category.status.status}`}
            </span>
          </span>),
        children: (
          <div>
            {category.status.courses.length > 0 && (
              <>
                {/* <div className="font-bold text-center">Danh sách môn học</div> */}
                <Table
                  columns={[
                    { title: 'Mã môn', dataIndex: 'key', key: 'key', width: 100 },
                    { title: 'Tên môn', dataIndex: 'course', key: 'course' },
                    { title: 'Số tín chỉ', dataIndex: 'credits', key: 'credits', width: 150 },
                    { title: 'Trạng thái', dataIndex: 'condition', key: 'condition' },
                  ]}
                  dataSource={category.status.courses}
                  pagination={false}
                  rowKey="key"
                  className="mt-10 mb-10 ml-20"
                />
              </>
            )}

            {category.status.bins.length > 0 && (
              <>
                {category.status.bins.length > 1 && (
                  <div className="font-bold ml-20">
                    {category?.status?.bins[0]?.condition}
                  </div>
                )}
                <Table
                  columns={[
                    { title: 'Tên tổ hợp', dataIndex: 'key', key: 'key' },
                    { title: 'Điều kiện hoàn thành', dataIndex: 'status', key: 'status' },
                  ]}
                  dataSource={category.status.bins}
                  pagination={false}
                  rowKey="key"
                  expandable={{
                    expandedRowRender: (binRecord) => (
                      <Table
                        columns={[
                          { title: 'Mã môn', dataIndex: 'key', key: 'key' },
                          { title: 'Tên môn', dataIndex: 'course', key: 'course' },
                          { title: 'Số tín chỉ', dataIndex: 'credits', key: 'credits' },
                          { title: 'Trạng thái', dataIndex: 'status', key: 'status' },
                        ]}
                        dataSource={binRecord.courses1}
                        pagination={false}
                        rowKey="key"
                        showHeader={false}
                        className="mt-4 ml-16"
                      />
                    ),
                    onExpand: handleShowDetails,
                    expandedRowKeys:
                      category.status.bins.length === 1
                        ? category.status.bins.map(bin => bin.key)
                        : expandedCategoryKeys,
                  }}
                  expandIcon={category.status.bins.length > 1 ? undefined : () => null}
                />
              </>
            )}
          </div>
        ),
      }))} />

    );
  };




  const handleExpand = (expanded, record) => {
    if (expanded) {
      setExpandedRowKeys((prevKeys) => [...prevKeys, record.key]);
    } else {
      setExpandedRowKeys((prevKeys) => prevKeys.filter((key) => key !== record.key));
    }
  };


  const classColumns = [
    {
      title: "Lớp",
      dataIndex: "class",
      key: "class",
    },
    {
      title: "Đánh giá",
      dataIndex: "rate",
      key: "rate",
    },
    {
      title: "",
      key: "action",
      render: (_, record) => (
        <Button onClick={() => handleExpand(!expandedRowKeys.includes(record.class), record)}>
          {expandedRowKeys.includes(record.class) ? "Thu gọn" : "Xem thêm"}
        </Button>
      ),
    },

  ];

  const classData = data?.ND
    ? data.ND.map((item) => ({
      key: item.TEN_LOP,
      class: item.TEN_LOP,
      rate:
        item.MUC_DO === "CHUA_HOAN_THANH" ? (
          <span className=" inline-block px-4 py-2 rounded-lg border border-orange-500 bg-orange-100 text-orange-800">Chưa hoàn thành CTĐT</span>
        ) : item.MUC_DO === "HOAN_THANH" ? (
          <span className=" inline-block px-4 py-2 rounded-lg border border-sky-500 bg-sky-100 text-sky-800">Hoàn thành CTĐT</span>
        ) : (
          <span className="text-gray-500">Không xác định</span>
        ),
    }))
    : [];

  const tabItems = classData.map((item, index) => ({
    key: index.toString(),
    label: item.class,
    children: (
      <>
        <div className="mb-4 text-center font-bold">
            Đánh giá mức độ tổng thể: {item.rate}
        </div>
        <CategoryTable record={item} />
      </>
    ),
  }));

  return (
    <div className="flex flex-col items-center justify-center mt-10 p-5">
      {loading ? (
        <div className="flex items-center justify-center">
          <Spin size="large" />
        </div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="w-7/12">
          <Divider orientation="center" className="border-slate-950">
            Thông tin chi tiết
          </Divider>
          <Table
            columns={columns}
            dataSource={formatData(data)}
            pagination={false}
            bordered
            rowKey="key"
            showHeader={false}
            className="rounded-lg"
          />
          <div className="mt-8">
            {/* <Divider orientation="center">
              Thông tin chi tiết môn học còn lại
            </Divider> */}
            {/* Use the new Tabs items prop */}
            <Tabs defaultActiveKey="0" items={tabItems} />
          </div>
        </div>
      )}
    </div>
  );
};

export default InformationPage;

