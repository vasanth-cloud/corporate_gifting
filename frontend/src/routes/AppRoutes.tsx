import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Dashboard from "../pages/Dashboard/Dashboard";
import Companies from "../pages/Companies/Companies";
import Employees from "../pages/Employees/Employees";
import Vendors from "../pages/Vendors/Vendors";
import Categories from "../pages/categories/Categories";

export default function AppRoutes() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/vendors" element={<Vendors />} />
        <Route path="/categories" element={<Categories />} />
      </Routes>
    </MainLayout>
  );
}