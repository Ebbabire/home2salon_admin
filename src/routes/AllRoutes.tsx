import Layout from "@/layout/Layout";
import {
  Admins,
  AssignedOrders,
  CompletedOrders,
  Dashboard,
  LoginForm,
  OrderDetail,
  PendingOrders,
  Professionals,
  Services,
  Wallet,
  Settings,
} from "@/pages"
import { Navigate, Route, Routes } from "react-router-dom";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="orders/pending" element={<PendingOrders />} />
        <Route path="orders/assigned" element={<AssignedOrders />} />
        <Route path="orders/completed" element={<CompletedOrders />} />
        <Route path="orders/:id" element={<OrderDetail />} />
        <Route path="services" element={<Services />} />
        <Route path="professionals" element={<Professionals />} />
        <Route path="admins" element={<Admins />} />
        <Route path="wallet" element={<Wallet />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="/login" element={<LoginForm />} />
    </Routes>
  );
};

export default AllRoutes;
