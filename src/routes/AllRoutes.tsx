import Layout from "@/layout/Layout";
import {
  Admins,
  Dashboard,
  LoginForm,
  ProductDetail,
  Products,
  Settings,
} from "@/pages";

import { Navigate, Route, Routes } from "react-router-dom";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Navigate to="/admins" replace />} />
        <Route path="admins" element={<Admins />} />
        <Route path="dashboard" element={<Dashboard />} />

        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetail />} />

        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="/login" element={<LoginForm />} />
    </Routes>
  );
};

export default AllRoutes;
