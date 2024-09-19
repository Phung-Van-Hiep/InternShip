import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { Table, Button, Divider, Spin } from "antd";

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
        // const response = await axios.get('/images/demo.json');

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
        key: "classes",
        label: "Lớp học",
        value: data.ND.map((item) => item.TEN_LOP).join(", "),
      },
    ];
  };

  const getCategoryStatus = (category) => {
    if (!category || !category.DS) {
      return { status: "Chưa hoàn thành", courses: [] };
    }

    const courses = [];
    const bins = [];
    // Lấy danh sách môn học từ DS nếu có
    if (Array.isArray(category.DS)) {
      category.DS.forEach((item) => {
        // Xử lý môn học từ DS
        if (item && item.TEN) {
          // Lưu trữ trực tiếp HP_CON_LAI vào mỗi bin
          bins?.push({
            key: item?.TEN,
            status: (() => {
              switch (item?.TRANG_THAI) {
                case "CHUA_DU":
                  return 'Chưa đủ';
                case "DANG_HOC":
                  return 'Đang học';
                case "CHUA_HOC":
                  return "Chưa học";
                default:
                  return "";  // Nếu không khớp với bất kỳ trường hợp nào
              }
            })(), 
            comment: (() => {
              switch (item?.TRANG_THAI) {
                case "CHUA_DU":
                  if (item?.CHU_THICH)
                    return `Cần học đủ ${item?.TC_CON_LAI} tín chỉ qua các môn ở dưới hoặc chọn các môn có đầu mã sau: ${item?.CHU_THICH}`;
                  else return `Cần học đủ ${item?.TC_CON_LAI} tín chỉ để hoàn thành`;
                case "DANG_HOC":
                  return "Cần học đủ mọi môn của tổ hợp này";
                case "CHUA_HOC":
                  return "Chọn học 1 trong các tổ hợp ở đây";
                default:
                  return "";  // Nếu không khớp với bất kỳ trường hợp nào
              }
            })(), 
            courses1: item?.HP_CON_LAI?.map((hp) => ({
              key: hp?.MA_MON,
              course: hp?.TEN_MON,
              credits: hp?.STC
            })) || [],  // Đảm bảo courses1 luôn là mảng
          });
        }

        if (item && item.MA_MON) {
          courses?.push({
            key: item?.MA_MON,
            course: item?.TEN_MON,
            credits: item?.STC,
          });
        }
      });
    }

    const status =
      category.TRANG_THAI === "CHUA_HOAN_THANH" ? "Chưa hoàn thành" : "Hoàn thành";

    return {
      status,
      bins, // bins sẽ chứa HP_CON_LAI của từng bin
      courses,
      element: (
        <div
          className={`inline-block px-4 py-2 rounded-lg text-white ${status === "Chưa hoàn thành" ? "bg-red-400" : "bg-sky-300"}`}
        >
          {status}
        </div>
      ),
    };
  };

  const CategoryTable = ({ record }) => {
    const [expandedCategoryKeys, setExpandedCategoryKeys] = useState([]);

    const handleCategoryExpand = (expanded, record) => {
      if (expanded) {
        setExpandedCategoryKeys((prevKeys) => [...prevKeys, record.key]);
      } else {
        setExpandedCategoryKeys((prevKeys) =>
          prevKeys.filter((key) => key !== record.key)
        );
      }
    };

    const statusColumns = [
      {
        title: "",
        dataIndex: "category",
        key: "category",
        width: 170,
      },
      {
        title: "",
        dataIndex: "status",
        key: "status",
        render: (statusObj) => statusObj.element,
      },
      {
        title: "",
        key: "details",
        width: 150,
        render: (_, record) => (
          record.status.status === "Chưa hoàn thành" && (
            <a
              onClick={() => handleCategoryExpand(!expandedCategoryKeys.includes(record.key), record)}
            >
              {expandedCategoryKeys.includes(record.key) ? "Đang hiển thị" : "Xem chi tiết"}
            </a>
          )
        ),
      },
    ];

    const classes = data.ND.find((item) => item.TEN_LOP === record.class);

    const categoryData = [
      { key: "NGOAI_NGU_2_CON_LAI", category: "Học phần ngôn ngữ 2:", status: getCategoryStatus(classes?.ND?.NGOAI_NGU_2_CON_LAI) },
      { key: "CO_SO_CON_LAI", category: "Học phần cơ sở:", status: getCategoryStatus(classes?.ND?.CO_SO_CON_LAI) },
      { key: "DAI_CUONG_CON_LAI", category: "Học phần đại cương:", status: getCategoryStatus(classes?.ND?.DAI_CUONG_CON_LAI) },
      { key: "BAT_BUOC_CON_LAI", category: "Học phần bắt buộc:", status: getCategoryStatus(classes?.ND?.BAT_BUOC_CON_LAI) },
      { key: "LUA_CHON_CON_LAI", category: "Học phần lựa chọn:", status: getCategoryStatus(classes?.ND?.LUA_CHON_CON_LAI) },
      { key: "TOT_NGHIEP_CON_LAI", category: "CĐTN/KLTN:", status: getCategoryStatus(classes?.ND?.TOT_NGHIEP_CON_LAI) },
      { key: "TU_DO_CON_LAI", category: "Tự do:", status: getCategoryStatus(classes?.ND?.TU_DO_CON_LAI) },
    ];
    return (
      <Table
        columns={statusColumns}
        dataSource={categoryData}
        pagination={false}
        rowKey="key"
        showHeader={false}
        expandable={{
          expandedRowRender: (record) => {
            return (
              <div>
                {/* Bảng 1: Hiển thị danh sách môn học */}
                {(record.key === "CO_SO_CON_LAI" || record.key === "DAI_CUONG_CON_LAI" || record.key === "BAT_BUOC_CON_LAI") && (
                  <Table
                    columns={[
                      { title: "Mã môn", dataIndex: "key", key: "key" },
                      { title: "Tên môn", dataIndex: "course", key: "course" },
                      { title: "Số tín chỉ", dataIndex: "credits", key: "credits" },
                    ]}
                    dataSource={record.status.courses}
                    pagination={false}
                    rowKey="key"
                  />
                )}

                {/* Bảng 2: Hiển thị danh sách tổ hợp */}
                {record.status.bins.length > 0 && (
                  <Table
                    columns={[
                      { title: "Tên tổ hợp", dataIndex: "key", key: "key" },
                      { title: "Trạng thái", dataIndex: "status", key: "status" },
                      { title: "Chú thích (nhấn + để xem chi tiết)", dataIndex: "comment", key: "comment" },
                    ]}
                    dataSource={record.status.bins}
                    pagination={false}
                    rowKey="key"
                    expandable={{
                      expandedRowRender: (binRecord) => (
                        <Table
                          columns={[
                            { title: "Mã môn", dataIndex: "key", key: "key" },
                            { title: "Tên môn", dataIndex: "course", key: "course" },
                            { title: "Số tín chỉ", dataIndex: "credits", key: "credits" },
                          ]}
                          dataSource={binRecord.courses1} // Hiển thị courses1 (HP_CON_LAI) của bin hiện tại
                          pagination={false}
                          rowKey="key"
                          className="mt-4 ml-15"
                        />
                      ),
                    }}
                  />
                )}
              </div>
            );
          },
          expandedRowKeys: expandedCategoryKeys,
          onExpand: handleCategoryExpand,
          expandIcon: () => null,
        }}
      />
    );
  };



  const handleExpand = (expanded, record) => {
    if (expanded) {
      setExpandedRowKeys((prevKeys) => [...prevKeys, record.key]);
    } else {
      setExpandedRowKeys((prevKeys) => prevKeys.filter((key) => key !== record.key));
    }
  };
  const handleShowDetails = () => {
    setShowDetails(!showDetails); // Đổi trạng thái ẩn hiện chi tiết
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
          <span className="bg-red-400 font-bold inline-block px-4 py-2 rounded-lg text-white">Chưa hoàn thành CTĐT</span>
        ) : item.MUC_DO === "HOAN_THANH" ? (
          <span className="bg-sky-300 font-bold inline-block px-4 py-2 rounded-lg text-white">Hoàn thành CTĐT</span>
        ) : (
          <span className="text-gray-500">Không xác định</span>
        ),
    }))
  : [];

  return (
    <div className="flex flex-col items-center justify-center mt-10 p-5">
      {loading ? (
        <div className="flex items-center justify-center">
          <Spin size="large" />
        </div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="w-3/5">
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
            <Divider orientation="center">
              Thông tin chi tiết môn học còn lại
            </Divider>
            <Table
              columns={classColumns}
              dataSource={classData}
              expandable={{
                expandedRowRender: (record) => <CategoryTable record={record} />,
                expandedRowKeys: expandedRowKeys, // Kiểm soát hàng được mở rộng
                onExpand: handleExpand,
                expandIcon: () => null,
              }}
              pagination={false}
              rowKey="class"
            // showHeader={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default InformationPage;

