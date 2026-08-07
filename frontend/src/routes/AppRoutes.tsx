import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

import Login from "../pages/Login/Login";
import ClaimGift from "../pages/ClaimGift/ClaimGift";
import Dashboard from "../pages/Dashboard/Dashboard";
import Companies from "../pages/Companies/Companies";
import Employees from "../pages/Employees/Employees";
import Vendors from "../pages/Vendors/Vendors";
import Gifts from "../pages/Gifts/Gifts";
import Categories from "../pages/categories/Categories";
import Campaigns from "../pages/Campaigns/Campaigns";
import Orders from "../pages/Orders/Orders";
import Reports from "../pages/Reports/Reports";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/claim-gift" element={<ClaimGift />} />

      {/* Protected App Routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="companies" element={<Companies />} />
        <Route path="employees" element={<Employees />} />
        <Route path="vendors" element={<Vendors />} />
        <Route path="gifts" element={<Gifts />} />
        <Route path="products" element={<Gifts />} />
        <Route path="categories" element={<Categories />} />
        <Route path="campaigns" element={<Campaigns />} />
        <Route path="orders" element={<Orders />} />
        <Route path="reports" element={<Reports />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}