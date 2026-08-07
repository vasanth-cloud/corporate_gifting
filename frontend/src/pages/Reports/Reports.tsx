import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CircularProgress,
  Alert,
  Paper,
} from "@mui/material";

import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TableViewIcon from "@mui/icons-material/TableView";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CampaignIcon from "@mui/icons-material/Campaign";
import PeopleIcon from "@mui/icons-material/People";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import {
  getOrderReport,
  getCampaignReport,
  getEmployeeReport,
  getRevenueReport,
} from "../../api/report";
import type {
  OrderReportData,
  CampaignReportData,
  EmployeeReportData,
  RevenueReportData,
} from "../../api/report";
import { exportOrdersExcel, exportOrdersPdf } from "../../api/export";

const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#3B82F6", "#8B5CF6", "#EF4444"];

export default function Reports() {
  const [orderReport, setOrderReport] = useState<OrderReportData | null>(null);
  const [campaignReport, setCampaignReport] = useState<CampaignReportData | null>(null);
  const [employeeReport, setEmployeeReport] = useState<EmployeeReportData | null>(null);
  const [revenueReport, setRevenueReport] = useState<RevenueReportData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exportingExcel, setExportingExcel] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);

  const loadReports = async () => {
    setLoading(true);
    setError("");
    try {
      const [ordRes, campRes, empRes, revRes] = await Promise.all([
        getOrderReport().catch(() => null),
        getCampaignReport().catch(() => null),
        getEmployeeReport().catch(() => null),
        getRevenueReport().catch(() => null),
      ]);
      setOrderReport(ordRes);
      setCampaignReport(campRes);
      setEmployeeReport(empRes);
      setRevenueReport(revRes);
    } catch (err: any) {
      console.error(err);
      setError("Failed to load analytics reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleExportExcel = async () => {
    setExportingExcel(true);
    try {
      const blob = await exportOrdersExcel();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Orders_Report.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      alert("Failed to export Excel report.");
    } finally {
      setExportingExcel(false);
    }
  };

  const handleExportPdf = async () => {
    setExportingPdf(true);
    try {
      const blob = await exportOrdersPdf();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Orders_Report.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      alert("Failed to export PDF report.");
    } finally {
      setExportingPdf(false);
    }
  };

  const orderStatusData = orderReport
    ? [
        { name: "Pending", value: orderReport.pending_orders },
        { name: "Approved", value: orderReport.approved_orders },
        { name: "Processing", value: orderReport.processing_orders },
        { name: "Shipped", value: orderReport.shipped_orders },
        { name: "Delivered", value: orderReport.delivered_orders },
        { name: "Cancelled", value: orderReport.cancelled_orders },
      ].filter((item) => item.value > 0)
    : [];

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#0F172A" }}>
            Reports & Data Export
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748B" }}>
            Download comprehensive business reports in Excel and PDF formats or view fulfillment trends.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button
            variant="outlined"
            startIcon={exportingExcel ? <CircularProgress size={18} /> : <TableViewIcon />}
            onClick={handleExportExcel}
            disabled={exportingExcel}
            sx={{
              borderRadius: 2.5,
              textTransform: "none",
              fontWeight: 600,
              color: "#10B981",
              borderColor: "#10B981",
              "&:hover": { borderColor: "#059669", bgcolor: "rgba(16,185,129,0.04)" },
            }}
          >
            Export Excel
          </Button>
          <Button
            variant="contained"
            startIcon={exportingPdf ? <CircularProgress size={18} /> : <PictureAsPdfIcon />}
            onClick={handleExportPdf}
            disabled={exportingPdf}
            sx={{
              borderRadius: 2.5,
              textTransform: "none",
              fontWeight: 600,
              bgcolor: "#6366F1",
              "&:hover": { bgcolor: "#4F46E5" },
            }}
          >
            Export PDF Report
          </Button>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Summary Stat Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #E2E8F0", p: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box sx={{ width: 48, height: 48, borderRadius: 2.5, bgcolor: "rgba(99,102,241,0.1)", color: "#6366F1", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ShoppingCartIcon />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 12, color: "#64748B", fontWeight: 600 }}>Total Orders</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: "#0F172A" }}>
                      {orderReport?.total_orders || 0}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #E2E8F0", p: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box sx={{ width: 48, height: 48, borderRadius: 2.5, bgcolor: "rgba(16,185,129,0.1)", color: "#10B981", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <AttachMoneyIcon />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 12, color: "#64748B", fontWeight: 600 }}>Total Revenue</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: "#0F172A" }}>
                      ${Number(revenueReport?.total_revenue || orderReport?.total_revenue || 0).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #E2E8F0", p: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box sx={{ width: 48, height: 48, borderRadius: 2.5, bgcolor: "rgba(245,158,11,0.1)", color: "#F59E0B", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <CampaignIcon />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 12, color: "#64748B", fontWeight: 600 }}>Active Campaigns</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: "#0F172A" }}>
                      {campaignReport?.active_campaigns || 0} / {campaignReport?.total_campaigns || 0}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #E2E8F0", p: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box sx={{ width: 48, height: 48, borderRadius: 2.5, bgcolor: "rgba(139,92,246,0.1)", color: "#8B5CF6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <PeopleIcon />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 12, color: "#64748B", fontWeight: 600 }}>Enrolled Employees</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: "#0F172A" }}>
                      {employeeReport?.total_employees || 0}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          </Grid>

          {/* Visual Analytics */}
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #E2E8F0" }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#0F172A", mb: 2 }}>
                  Order Status Breakdown
                </Typography>
                <Box sx={{ width: "100%", height: 320 }}>
                  {orderStatusData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={orderStatusData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis dataKey="name" stroke="#64748B" fontSize={12} />
                        <YAxis stroke="#64748B" fontSize={12} />
                        <RechartsTooltip />
                        <Bar dataKey="value" fill="#6366F1" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <Box sx={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center" }}>
                      <Typography color="#94A3B8">No status data available.</Typography>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #E2E8F0" }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#0F172A", mb: 2 }}>
                  Fulfillment Status Distribution
                </Typography>
                <Box sx={{ width: "100%", height: 320, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {orderStatusData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={orderStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {orderStatusData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <Typography color="#94A3B8">No distribution data.</Typography>
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
}
