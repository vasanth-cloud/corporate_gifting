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

import HrManagers from "../pages/CompanyAdmin/HrManagers";
import Recipients from "../pages/CompanyAdmin/Recipients";
import Budgets from "../pages/CompanyAdmin/Budgets";
import Approvals from "../pages/CompanyAdmin/Approvals";
import Deliveries from "../pages/Deliveries/Deliveries";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/claim-gift" element={<ClaimGift />} />

      {/* Default Protected Shell */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        
        {/* Super Admin Panel */}
        <Route path="super-admin/dashboard" element={<Dashboard />} />
        <Route path="super-admin/companies" element={<Companies />} />
        <Route path="super-admin/vendors" element={<Vendors />} />
        <Route path="super-admin/products" element={<Gifts />} />
        <Route path="super-admin/categories" element={<Categories />} />
        <Route path="super-admin/campaigns" element={<Campaigns />} />
        <Route path="super-admin/orders" element={<Orders />} />
        <Route path="super-admin/deliveries" element={<Deliveries />} />
        <Route path="super-admin/reports" element={<Reports />} />

        {/* Company Admin Panel */}
        <Route path="company/dashboard" element={<Dashboard />} />
        <Route path="company/hr-managers" element={<HrManagers />} />
        <Route path="company/employees" element={<Employees />} />
        <Route path="company/campaigns" element={<Campaigns />} />
        <Route path="company/recipients" element={<Recipients />} />
        <Route path="company/budgets" element={<Budgets />} />
        <Route path="company/approvals" element={<Approvals />} />
        <Route path="company/orders" element={<Orders />} />
        <Route path="company/deliveries" element={<Deliveries />} />
        <Route path="company/reports" element={<Reports />} />

        {/* HR Manager Panel */}
        <Route path="hr/dashboard" element={<Dashboard />} />
        <Route path="hr/employees" element={<Employees />} />
        <Route path="hr/campaigns" element={<Campaigns />} />
        <Route path="hr/recipients" element={<Recipients />} />
        <Route path="hr/addresses" element={<Recipients />} />
        <Route path="hr/orders" element={<Orders />} />
        <Route path="hr/deliveries" element={<Deliveries />} />

        {/* Employee Panel */}
        <Route path="employee/dashboard" element={<Dashboard />} />
        <Route path="employee/gifts" element={<Gifts />} />
        <Route path="employee/orders" element={<Orders />} />
        <Route path="employee/address" element={<ClaimGift />} />

        {/* Vendor Panel */}
        <Route path="vendor/dashboard" element={<Dashboard />} />
        <Route path="vendor/products" element={<Gifts />} />
        <Route path="vendor/inventory" element={<Gifts />} />
        <Route path="vendor/orders" element={<Orders />} />
        <Route path="vendor/shipping" element={<Deliveries />} />
        <Route path="vendor/deliveries" element={<Deliveries />} />
        <Route path="vendor/reports" element={<Reports />} />

        {/* Core Alias Routes */}
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