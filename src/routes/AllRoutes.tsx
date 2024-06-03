import Layout from "@/layout/Layout";
import { LoginForm, Orders } from "@/pages";
import { Navigate, Route, Routes } from "react-router-dom";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Orders />} />
        <Route path="orders" element={<Orders />} />
      </Route>
      <Route path="/login" element={<LoginForm />} />
    </Routes>
  );
};

export default AllRoutes;
