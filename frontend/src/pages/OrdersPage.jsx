import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  Stack,
  Button,
} from "@mui/material";

const OrdersPage = () => {
  const [user] = useAuthState(auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState(0); // تب پیش‌فرض (0 برای جاری)
  const [orderBy, setOrderBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  // useEffect(() => {
  //   if (!user) {
  //     setLoading(false);
  //     return;
  //   }

  //   const ordersQuery = query(collection(db, "orders"), where("userId", "==", user.uid));
  //   const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
  //     const ordersData = snapshot.docs.map((docSnap) => ({
  //       id: docSnap.id,
  //       ...docSnap.data(),
  //     }));
  //     setOrders(ordersData);
  //     setLoading(false);
  //   }, (error) => {
  //     console.error("خطا در دریافت سفارش‌ها:", error);
  //     setLoading(false);
  //   });

  //   return () => unsubscribe();
  // }, [user]);

  // const handleChange = (event, newValue) => {
  //   setValue(newValue);
  // };

  useEffect(() => {
  setOrders([
    { id: "1", userId: "testUser", products: [{ name: "محصول 1", quantity: 2 }], status: "processing", createdAt: new Date() },
  ]);
  setLoading(false);
  }, []);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(orderBy === property && order === "asc" ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedOrders = (statusOrders) => [...statusOrders].sort((a, b) => {
    const aTime = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return order === "desc" ? bTime - aTime : aTime - bTime;
  });

  const groupedOrders = {
    processing: orders.filter(o => (o.status || "").toLowerCase() === "processing"),
    delivered: orders.filter(o => (o.status || "").toLowerCase() === "delivered" || (o.status || "").toLowerCase() === "completed"),
    returned: orders.filter(o => (o.status || "").toLowerCase() === "returned"),
  };

  const formatDate = (date) => {
    if (!date) return "بدون تاریخ";
    try {
      const d = date?.seconds ? new Date(date.seconds * 1000) : new Date(date);
      return d.toLocaleDateString("fa-IR");
    } catch {
      return "بدون تاریخ";
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography>...در حال بارگذاری</Typography>
      </Box>
    );
  }

  if (!orders.length) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography>.شما سفارشی ندارید</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, sm: { p: 4 }, direction: "rtl", backgroundColor: "#f9f9f9", minHeight: "calc(100vh - 64px)" }}>
      <Typography variant="h4" fontWeight="bold" mb={2} sm={{ mb: 4 }} color="#ff6200" textAlign="center">
        سفارش‌های من
      </Typography>
      <Box sx={{ display: { xs: "none", sm: "block" } }}>
        <Tabs value={value} onChange={handleChange} aria-label="سفارش‌ها" sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tab label={`جاری (${groupedOrders.processing.length})`} value={0} />
          <Tab label={`تحویل داده شده (${groupedOrders.delivered.length})`} value={1} />
          <Tab label={`مرجوع شده (${groupedOrders.returned.length})`} value={2} />
        </Tabs>
      </Box>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ display: { sm: "none" }, mb: 2 }}>
        <Button
          variant={value === 0 ? "contained" : "outlined"}
          color="primary"
          onClick={() => handleChange(null, 0)}
          sx={{ flex: 1 }}
        >
          جاری ({groupedOrders.processing.length})
        </Button>
        <Button
          variant={value === 1 ? "contained" : "outlined"}
          color="primary"
          onClick={() => handleChange(null, 1)}
          sx={{ flex: 1 }}
        >
          تحویل داده شده ({groupedOrders.delivered.length})
        </Button>
        <Button
          variant={value === 2 ? "contained" : "outlined"}
          color="primary"
          onClick={() => handleChange(null, 2)}
          sx={{ flex: 1 }}
        >
          مرجوع شده ({groupedOrders.returned.length})
        </Button>
      </Stack>
      {value === 0 && (
        groupedOrders.processing.length ? (
          <Paper sx={{ width: "100%", overflowX: "auto", borderRadius: 2, boxShadow: 1, mt: 2 }}>
            <Table sx={{ minWidth: 300, sm: { minWidth: 650 }, backgroundColor: "#fff" }}>
              <TableHead sx={{ backgroundColor: "#ff6200" }}>
                <TableRow>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold", display: { xs: "none", sm: "table-cell" } }}>
                    <TableSortLabel
                      active={orderBy === "createdAt"}
                      direction={orderBy === "createdAt" ? order : "asc"}
                      onClick={() => handleSort("createdAt")}
                      sx={{ color: "#fff", "&:hover": { color: "#fff" }, "&.Mui-active": { color: "#fff" } }}
                    >
                      تاریخ
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold", display: { xs: "none", sm: "table-cell" } }}>نام محصول</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold", display: { xs: "none", sm: "table-cell" } }}>تعداد</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedOrders(groupedOrders.processing).map((order) => (
                  order.products.map((product, index) => (
                    <TableRow key={`${order.id}-${index}`} sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f5f5f5" } }}>
                      <TableCell sx={{ display: { xs: "block", sm: "table-cell" } }}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ display: { sm: "none" } }}>تاریخ:</Typography>
                        {formatDate(order.createdAt)}
                      </TableCell>
                      <TableCell sx={{ display: { xs: "block", sm: "table-cell" } }}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ display: { sm: "none" } }}>نام محصول:</Typography>
                        {product.name || "بدون نام"}
                      </TableCell>
                      <TableCell sx={{ display: { xs: "block", sm: "table-cell" } }}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ display: { sm: "none" } }}>تعداد:</Typography>
                        {product.quantity || 0}
                      </TableCell>
                    </TableRow>
                  ))
                ))}
              </TableBody>
            </Table>
          </Paper>
        ) : (
          <Typography sx={{ mt: 2 }}>سفارش جاری ای یافت نشد.</Typography>
        )
      )}
      {value === 1 && (
        groupedOrders.delivered.length ? (
          <Paper sx={{ width: "100%", overflowX: "auto", borderRadius: 2, boxShadow: 1, mt: 2 }}>
            <Table sx={{ minWidth: 300, sm: { minWidth: 650 }, backgroundColor: "#fff" }}>
              <TableHead sx={{ backgroundColor: "#ff6200" }}>
                <TableRow>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold", display: { xs: "none", sm: "table-cell" } }}>
                    <TableSortLabel
                      active={orderBy === "createdAt"}
                      direction={orderBy === "createdAt" ? order : "asc"}
                      onClick={() => handleSort("createdAt")}
                      sx={{ color: "#fff", "&:hover": { color: "#fff" }, "&.Mui-active": { color: "#fff" } }}
                    >
                      تاریخ
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold", display: { xs: "none", sm: "table-cell" } }}>نام محصول</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold", display: { xs: "none", sm: "table-cell" } }}>تعداد</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedOrders(groupedOrders.delivered).map((order) => (
                  order.products.map((product, index) => (
                    <TableRow key={`${order.id}-${index}`} sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f5f5f5" } }}>
                      <TableCell sx={{ display: { xs: "block", sm: "table-cell" } }}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ display: { sm: "none" } }}>تاریخ:</Typography>
                        {formatDate(order.createdAt)}
                      </TableCell>
                      <TableCell sx={{ display: { xs: "block", sm: "table-cell" } }}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ display: { sm: "none" } }}>نام محصول:</Typography>
                        {product.name || "بدون نام"}
                      </TableCell>
                      <TableCell sx={{ display: { xs: "block", sm: "table-cell" } }}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ display: { sm: "none" } }}>تعداد:</Typography>
                        {product.quantity || 0}
                      </TableCell>
                    </TableRow>
                  ))
                ))}
              </TableBody>
            </Table>
          </Paper>
        ) : (
          <Typography sx={{ mt: 2 }}>سفارش تحویل داده شده ای یافت نشد.</Typography>
        )
      )}
      {value === 2 && (
        groupedOrders.returned.length ? (
          <Paper sx={{ width: "100%", overflowX: "auto", borderRadius: 2, boxShadow: 1, mt: 2 }}>
            <Table sx={{ minWidth: 300, sm: { minWidth: 650 }, backgroundColor: "#fff" }}>
              <TableHead sx={{ backgroundColor: "#ff6200" }}>
                <TableRow>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold", display: { xs: "none", sm: "table-cell" } }}>
                    <TableSortLabel
                      active={orderBy === "createdAt"}
                      direction={orderBy === "createdAt" ? order : "asc"}
                      onClick={() => handleSort("createdAt")}
                      sx={{ color: "#fff", "&:hover": { color: "#fff" }, "&.Mui-active": { color: "#fff" } }}
                    >
                      تاریخ
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold", display: { xs: "none", sm: "table-cell" } }}>نام محصول</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold", display: { xs: "none", sm: "table-cell" } }}>تعداد</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedOrders(groupedOrders.returned).map((order) => (
                  order.products.map((product, index) => (
                    <TableRow key={`${order.id}-${index}`} sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f5f5f5" } }}>
                      <TableCell sx={{ display: { xs: "block", sm: "table-cell" } }}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ display: { sm: "none" } }}>تاریخ:</Typography>
                        {formatDate(order.createdAt)}
                      </TableCell>
                      <TableCell sx={{ display: { xs: "block", sm: "table-cell" } }}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ display: { sm: "none" } }}>نام محصول:</Typography>
                        {product.name || "بدون نام"}
                      </TableCell>
                      <TableCell sx={{ display: { xs: "block", sm: "table-cell" } }}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ display: { sm: "none" } }}>تعداد:</Typography>
                        {product.quantity || 0}
                      </TableCell>
                    </TableRow>
                  ))
                ))}
              </TableBody>
            </Table>
          </Paper>
        ) : (
          <Typography sx={{ mt: 2 }}>سفارش مرجوع شده ای یافت نشد.</Typography>
        )
      )}
    </Box>
  );
};

export default OrdersPage;