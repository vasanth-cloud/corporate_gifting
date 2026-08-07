import { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Stack,
} from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  Building2,
  Users,
  ShoppingBag,
  Wallet,
  Gift,
  Briefcase,
  Ticket,
} from "lucide-react";
import {
  getDashboardSummary,
  getMonthlyOrders,
  getMonthlyRevenue,
  getTopGifts,
  getTopCompanies,
  getOrderStatus,
} from "../../api/dashboard";

// ---- Design tokens -------------------------------------------------------
const INK = "#1B1730";
const INK_SOFT = "#6B6785";
const SURFACE = "#FFFFFF";
const PAGE_BG = "linear-gradient(180deg, #F6F5FB 0%, #ECEAF6 100%)";
const PRIMARY = "#4C3A8C"; // royal violet
const GOLD = "#C9982F"; // ribbon gold
const GREEN = "#2F8F5B"; // revenue green
const CORAL = "#E1604A"; // status accent
const BLUE = "#3E7CB1"; // secondary data

const PIE_COLORS = [PRIMARY, GOLD, GREEN, CORAL, BLUE];

const FONT_DISPLAY = "'Sora', sans-serif";
const FONT_BODY = "'Inter', sans-serif";
const FONT_MONO = "'JetBrains Mono', monospace";

// Inject Google Fonts once (purely cosmetic, no functional/backend change)
function useDashboardFonts() {
  useEffect(() => {
    const id = "dashboard-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@600;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

// ---- Small presentational helpers ---------------------------------------
function KpiCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  accent: string;
}) {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: "18px",
        border: "1px solid #E7E4F2",
        borderTop: `3px solid ${accent}`,
        background: SURFACE,
        boxShadow: "0 2px 14px rgba(27, 23, 48, 0.05)",
        height: "100%",
      }}
    >
      <CardContent sx={{ p: 2.75 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" mb={1.5}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: `${accent}1A`,
              color: accent,
            }}
          >
            {icon}
          </Box>
          <Typography
            sx={{
              fontFamily: FONT_BODY,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: INK_SOFT,
            }}
          >
            {label}
          </Typography>
        </Stack>
        <Typography
          sx={{
            fontFamily: FONT_MONO,
            fontWeight: 700,
            fontSize: 30,
            color: INK,
            lineHeight: 1.1,
          }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

function ChartCard({
  icon,
  title,
  accent,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: "18px",
        border: "1px solid #E7E4F2",
        background: SURFACE,
        boxShadow: "0 2px 14px rgba(27, 23, 48, 0.05)",
        height: "100%",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" spacing={1.25} alignItems="center" mb={2.5}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "9px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: `${accent}1A`,
              color: accent,
            }}
          >
            {icon}
          </Box>
          <Typography
            sx={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 700,
              fontSize: 16,
              color: INK,
            }}
          >
            {title}
          </Typography>
        </Stack>
        {children}
      </CardContent>
    </Card>
  );
}

function RankedList({
  items,
  nameKey,
  valueKey,
  accent,
  emptyLabel,
}: {
  items: any[];
  nameKey: string;
  valueKey: string;
  accent: string;
  emptyLabel: string;
}) {
  if (items.length === 0) {
    return (
      <Typography sx={{ fontFamily: FONT_BODY, color: INK_SOFT, fontSize: 14 }}>
        {emptyLabel}
      </Typography>
    );
  }

  const max = Math.max(...items.map((i) => Number(i[valueKey]) || 0), 1);

  return (
    <Stack spacing={2}>
      {items.map((item, index) => {
        const value = Number(item[valueKey]) || 0;
        const pct = Math.max((value / max) * 100, 4);
        return (
          <Box key={index}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={0.75}
            >
              <Stack direction="row" spacing={1.25} alignItems="center">
                <Box
                  sx={{
                    width: 22,
                    height: 22,
                    borderRadius: "7px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: `${accent}1A`,
                    color: accent,
                    fontFamily: FONT_MONO,
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {index + 1}
                </Box>
                <Typography
                  sx={{ fontFamily: FONT_BODY, fontSize: 14, color: INK, fontWeight: 500 }}
                >
                  {item[nameKey]}
                </Typography>
              </Stack>
              <Typography
                sx={{ fontFamily: FONT_MONO, fontSize: 14, fontWeight: 700, color: INK }}
              >
                {value}
              </Typography>
            </Stack>
            <Box
              sx={{
                height: 6,
                borderRadius: 999,
                backgroundColor: "#EFEDF7",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  width: `${pct}%`,
                  height: "100%",
                  borderRadius: 999,
                  backgroundColor: accent,
                }}
              />
            </Box>
          </Box>
        );
      })}
    </Stack>
  );
}

// ---- Main component (logic untouched) ------------------------------------
export default function Dashboard() {
  useDashboardFonts();

  const [summary, setSummary] = useState<any>({});
  const [monthlyOrders, setMonthlyOrders] = useState<any[]>([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState<any[]>([]);
  const [topGifts, setTopGifts] = useState<any[]>([]);
  const [topCompanies, setTopCompanies] = useState<any[]>([]);
  const [orderStatus, setOrderStatus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [summaryData, orderData, revenueData, giftsData, companiesData, statusData] =
        await Promise.all([
          getDashboardSummary(),
          getMonthlyOrders(),
          getMonthlyRevenue(),
          getTopGifts(),
          getTopCompanies(),
          getOrderStatus(),
        ]);

      setSummary(summaryData);
      setMonthlyOrders(orderData);
      setMonthlyRevenue(revenueData);
      setTopGifts(giftsData);
      setTopCompanies(companiesData);
      setOrderStatus(statusData);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const totalOrderStatusCount = orderStatus.reduce(
    (sum, s: any) => sum + (Number(s.count) || 0),
    0
  );

  if (loading) {
    return (
      <Box
        sx={{
          height: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: PAGE_BG,
        }}
      >
        <CircularProgress sx={{ color: PRIMARY }} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", background: PAGE_BG }}>
      <Box p={4}>
        <Stack direction="row" spacing={1.5} alignItems="center" mb={0.5}>
          <Gift size={26} color={PRIMARY} />
          <Typography
            sx={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 800,
              fontSize: 30,
              color: INK,
              letterSpacing: "-0.02em",
            }}
          >
            Dashboard
          </Typography>
        </Stack>
        <Typography
          sx={{
            fontFamily: FONT_BODY,
            fontSize: 14,
            color: INK_SOFT,
            mb: 4,
          }}
        >
          A snapshot of orders, revenue, and gifting activity across your companies
        </Typography>

        <Grid container spacing={3}>
          {/* Summary Cards */}
          <Grid item xs={12} sm={6} md={3}>
            <KpiCard
              icon={<Building2 size={20} />}
              label="Total Companies"
              value={summary.total_companies ?? "—"}
              accent={PRIMARY}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <KpiCard
              icon={<Users size={20} />}
              label="Total Employees"
              value={summary.total_employees ?? "—"}
              accent={BLUE}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <KpiCard
              icon={<ShoppingBag size={20} />}
              label="Total Orders"
              value={summary.total_orders ?? "—"}
              accent={GOLD}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <KpiCard
              icon={<Wallet size={20} />}
              label="Total Revenue"
              value={`₹ ${summary.total_revenue ?? "—"}`}
              accent={GREEN}
            />
          </Grid>

          {/* Monthly Orders Chart */}
          <Grid item xs={12} md={6}>
            <ChartCard icon={<ShoppingBag size={17} />} title="Monthly Orders" accent={PRIMARY}>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={monthlyOrders}>
                  <defs>
                    <linearGradient id="ordersFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={PRIMARY} stopOpacity={1} />
                      <stop offset="100%" stopColor={PRIMARY} stopOpacity={0.55} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EFEDF7" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontFamily: FONT_BODY, fontSize: 12, fill: INK_SOFT }}
                    axisLine={{ stroke: "#E7E4F2" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontFamily: FONT_BODY, fontSize: 12, fill: INK_SOFT }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 10,
                      border: "1px solid #E7E4F2",
                      fontFamily: FONT_BODY,
                      fontSize: 13,
                    }}
                  />
                  <Bar dataKey="orders" fill="url(#ordersFill)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>

          {/* Monthly Revenue Chart */}
          <Grid item xs={12} md={6}>
            <ChartCard icon={<Wallet size={17} />} title="Monthly Revenue" accent={GREEN}>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={monthlyRevenue}>
                  <defs>
                    <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={GREEN} stopOpacity={1} />
                      <stop offset="100%" stopColor={GREEN} stopOpacity={0.55} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EFEDF7" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontFamily: FONT_BODY, fontSize: 12, fill: INK_SOFT }}
                    axisLine={{ stroke: "#E7E4F2" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontFamily: FONT_BODY, fontSize: 12, fill: INK_SOFT }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 10,
                      border: "1px solid #E7E4F2",
                      fontFamily: FONT_BODY,
                      fontSize: 13,
                    }}
                  />
                  <Bar dataKey="revenue" fill="url(#revenueFill)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>

          {/* Top Gifts */}
          <Grid item xs={12} md={6}>
            <ChartCard icon={<Gift size={17} />} title="Top Gifts" accent={GOLD}>
              <RankedList
                items={topGifts}
                nameKey="gift_name"
                valueKey="total_orders"
                accent={GOLD}
                emptyLabel="No data yet"
              />
            </ChartCard>
          </Grid>

          {/* Top Companies */}
          <Grid item xs={12} md={6}>
            <ChartCard icon={<Briefcase size={17} />} title="Top Companies" accent={BLUE}>
              <RankedList
                items={topCompanies}
                nameKey="company_name"
                valueKey="orders"
                accent={BLUE}
                emptyLabel="No data yet"
              />
            </ChartCard>
          </Grid>

          {/* Order Status */}
          <Grid item xs={12}>
            <ChartCard icon={<Ticket size={17} />} title="Order Status" accent={CORAL}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={7}>
                  <Box sx={{ position: "relative" }}>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={orderStatus}
                          dataKey="count"
                          nameKey="status"
                          innerRadius={80}
                          outerRadius={125}
                          paddingAngle={2}
                          cornerRadius={6}
                        >
                          {orderStatus.map((_: any, index: number) => (
                            <Cell
                              key={index}
                              fill={PIE_COLORS[index % PIE_COLORS.length]}
                              stroke="none"
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            borderRadius: 10,
                            border: "1px solid #E7E4F2",
                            fontFamily: FONT_BODY,
                            fontSize: 13,
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <Box
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        textAlign: "center",
                        pointerEvents: "none",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: FONT_MONO,
                          fontWeight: 700,
                          fontSize: 26,
                          color: INK,
                        }}
                      >
                        {totalOrderStatusCount}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: FONT_BODY,
                          fontSize: 12,
                          color: INK_SOFT,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                        }}
                      >
                        Orders
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={5}>
                  <Stack spacing={1.5}>
                    {orderStatus.map((s: any, index: number) => {
                      const pct = totalOrderStatusCount
                        ? Math.round((Number(s.count) / totalOrderStatusCount) * 100)
                        : 0;
                      return (
                        <Stack
                          key={index}
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Stack direction="row" spacing={1.25} alignItems="center">
                            <Box
                              sx={{
                                width: 10,
                                height: 10,
                                borderRadius: "3px",
                                backgroundColor: PIE_COLORS[index % PIE_COLORS.length],
                              }}
                            />
                            <Typography
                              sx={{ fontFamily: FONT_BODY, fontSize: 14, color: INK }}
                            >
                              {s.status}
                            </Typography>
                          </Stack>
                          <Typography
                            sx={{
                              fontFamily: FONT_MONO,
                              fontSize: 13,
                              fontWeight: 700,
                              color: INK_SOFT,
                            }}
                          >
                            {s.count} · {pct}%
                          </Typography>
                        </Stack>
                      );
                    })}
                  </Stack>
                </Grid>
              </Grid>
            </ChartCard>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}