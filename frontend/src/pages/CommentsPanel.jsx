import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";

const CommentsPanel = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    setRows([
      { id: "1_0", index: 0, productId: "1", user: "کاربر 1", rating: 4, text: "نظر نمونه", timestamp: new Date().toISOString() },
      { id: "2_0", index: 0, productId: "2", user: "کاربر 2", rating: 5, text: "عالی بود", timestamp: new Date().toISOString() },
    ]);
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return "-";
    const date = new Date(timestamp);
    return date.toLocaleDateString("fa-IR") + " " + date.toLocaleTimeString("fa-IR");
  };

  const columns = [
    { field: "user", headerName: "کاربر", flex: 1, align: "right" },
    { field: "rating", headerName: "امتیاز", flex: 0.5, align: "right" },
    { field: "text", headerName: "نظر", flex: 2, align: "right" },
    {
      field: "timestamp",
      headerName: "تاریخ ثبت",
      flex: 1,
      align: "right",
      valueGetter: (params) => formatDate(params.row.timestamp),
    },
    { field: "productId", headerName: "آیدی محصول", flex: 1, align: "right" },
    {
      field: "actions",
      headerName: "عملیات",
      renderCell: (params) => (
        <Button
          variant="contained"
          color="error"
          size="small"
          sx={{ alignSelf: "center" }}
          disabled // غیرفعال کردن دکمه تا منطق حذف پیاده‌سازی شود
        >
          حذف
        </Button>
      ),
      flex: 0.7,
    },
  ];

  return (
    <div className="p-2 sm:p-4 md:p-6 bg-white rounded-lg shadow-md" dir="rtl">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-4 text-gray-800 text-center">
        مدیریت نظرات کاربران
      </h2>
      <div style={{ height: { xs: 400, sm: 600 }, width: "100%", overflowX: "auto" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          sx={{
            fontFamily: "inherit",
            direction: "rtl",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f5f5f5",
              fontWeight: "bold",
            },
          }}
        />
      </div>
    </div>
  );
};

export default CommentsPanel;