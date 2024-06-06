import Layout from "@/layout/Layout";
import { Admins, LoginForm } from "@/pages";
import { Navigate, Route, Routes } from "react-router-dom";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Navigate to="/admins" replace />} />
        <Route path="admins" element={<Admins />} />
      </Route>
      <Route path="/login" element={<LoginForm />} />
    </Routes>
  );
};

export default AllRoutes;
