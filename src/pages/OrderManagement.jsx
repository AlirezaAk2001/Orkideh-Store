import React, { useEffect, useState } from "react";
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Select, MenuItem, Button } from "@mui/material";
import { collection, query, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const ordersQuery = query(collection(db, "orders"));
    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setOrders(ordersData);
    }, (error) => {
      console.error("خطا در دریافت سفارش‌ها:", error);
    });

    return () => unsubscribe();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });
      alert("وضعیت سفارش با موفقیت به‌روزرسانی شد.");
    } catch (error) {
      console.error("خطا در به‌روزرسانی وضعیت سفارش:", error);
      alert("خطا در به‌روزرسانی وضعیت سفارش.");
    }
  };

  return (
    <Box sx={{ p: 2, sm: { p: 4 }, direction: "rtl", backgroundColor: "#f9f9f9", minHeight: "calc(100vh - 64px)" }}>
      <Typography variant="h4" fontWeight="bold" mb={2} sm={{ mb: 4 }} color="#ff6200" textAlign="center">
        مدیریت سفارش‌ها
      </Typography>
      <Table sx={{ minWidth: 300, sm: { minWidth: 650 }, backgroundColor: "#fff", borderRadius: 2, boxShadow: 1 }}>
        <TableHead sx={{ backgroundColor: "#ff6200", color: "#fff" }}>
          <TableRow>
            <TableCell sx={{ color: "#fff", fontWeight: "bold", display: { xs: "none", sm: "table-cell" } }}>شناسه سفارش</TableCell>
            <TableCell sx={{ color: "#fff", fontWeight: "bold", display: { xs: "none", sm: "table-cell" } }}>محصولات</TableCell>
            <TableCell sx={{ color: "#fff", fontWeight: "bold", display: { xs: "none", sm: "table-cell" } }}>وضعیت</TableCell>
            <TableCell sx={{ color: "#fff", fontWeight: "bold", display: { xs: "none", sm: "table-cell" } }}>عملیات</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f5f5f5" } }}>
              <TableCell sx={{ display: { xs: "block", sm: "table-cell" } }}>
                <Typography variant="subtitle1" fontWeight="bold">شناسه سفارش:</Typography> {order.id}
              </TableCell>
              <TableCell sx={{ display: { xs: "block", sm: "table-cell" } }}>
                <Typography variant="subtitle1" fontWeight="bold">محصولات:</Typography>
                {order.products.map((p, index) => (
                  <div key={index} style={{ marginBottom: 8 }}>
                    {p.name} (تعداد: {p.quantity})
                  </div>
                ))}
              </TableCell>
              <TableCell sx={{ display: { xs: "block", sm: "table-cell" } }}>
                <Typography variant="subtitle1" fontWeight="bold">وضعیت:</Typography>
                <Select
                  value={order.status || "processing"}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  sx={{ minWidth: 120, sm: { minWidth: 150 }, backgroundColor: "#fff", mt: 1 }}
                >
                  <MenuItem value="processing">جاری</MenuItem>
                  <MenuItem value="delivered">تحویل داده شده</MenuItem>
                  <MenuItem value="returned">مرجوع شده</MenuItem>
                </Select>
              </TableCell>
              <TableCell sx={{ display: { xs: "block", sm: "table-cell" }, mb: { xs: 2, sm: 0 } }}>
                <Typography variant="subtitle1" fontWeight="bold">عملیات:</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => updateOrderStatus(order.id, order.status === "delivered" ? "processing" : "delivered")}
                  sx={{ backgroundColor: "#ff6200", "&:hover": { backgroundColor: "#e65c00" }, mt: 1, width: { xs: "100%", sm: "auto" } }}
                >
                  {order.status === "delivered" ? "بازگردانی" : "تحویل"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default OrderManagement;