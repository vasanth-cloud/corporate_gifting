import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  CircularProgress,
  Alert,
  Tooltip,
  Grid,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { getOrders, createOrder, updateOrder, deleteOrder, downloadInvoice } from "../../api/order";
import type { Order } from "../../api/order";
import { getCompanies } from "../../api/company";
import { getEmployees } from "../../api/employee";
import { getCampaigns } from "../../api/campaign";
import { createPaymentOrder, verifyPayment } from "../../api/payment";

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  // Modal State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [saving, setSaving] = useState(false);

  // Payment Checkout Modal State
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [payingOrder, setPayingOrder] = useState<Order | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("CARD");
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const [formValues, setFormValues] = useState({
    order_number: "",
    company_id: "",
    employee_id: "",
    campaign_id: "",
    order_date: new Date().toISOString().split("T")[0],
    total_amount: "",
    status: "PENDING" as any,
  });

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [ordRes, compRes, empRes, campRes] = await Promise.all([
        getOrders().catch(() => []),
        getCompanies().catch(() => []),
        getEmployees().catch(() => []),
        getCampaigns().catch(() => []),
      ]);
      setOrders(Array.isArray(ordRes) ? ordRes : []);
      setCompanies(Array.isArray(compRes) ? compRes : []);
      setEmployees(Array.isArray(empRes) ? empRes : []);
      setCampaigns(Array.isArray(campRes) ? campRes : []);
    } catch (err: any) {
      console.error(err);
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenModal = (ord?: Order) => {
    if (ord) {
      setEditingOrder(ord);
      setFormValues({
        order_number: ord.order_number,
        company_id: String(ord.company_id),
        employee_id: String(ord.employee_id),
        campaign_id: String(ord.campaign_id),
        order_date: String(ord.order_date),
        total_amount: String(ord.total_amount),
        status: ord.status,
      });
    } else {
      setEditingOrder(null);
      const randNo = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
      const firstComp = companies.length > 0 ? String(companies[0].id) : "1";
      const compEmps = employees.filter((e) => String(e.company_id) === firstComp);
      const compCamps = campaigns.filter((c) => String(c.company_id) === firstComp);

      setFormValues({
        order_number: randNo,
        company_id: firstComp,
        employee_id: compEmps.length > 0 ? String(compEmps[0].id) : employees.length > 0 ? String(employees[0].id) : "1",
        campaign_id: compCamps.length > 0 ? String(compCamps[0].id) : campaigns.length > 0 ? String(campaigns[0].id) : "1",
        order_date: new Date().toISOString().split("T")[0],
        total_amount: "250.00",
        status: "PENDING",
      });
    }
    setDialogOpen(true);
  };

  const handleCompanyChange = (companyId: string) => {
    const compEmps = employees.filter((e) => String(e.company_id) === companyId);
    const compCamps = campaigns.filter((c) => String(c.company_id) === companyId);

    setFormValues((prev) => ({
      ...prev,
      company_id: companyId,
      employee_id: compEmps.length > 0 ? String(compEmps[0].id) : prev.employee_id,
      campaign_id: compCamps.length > 0 ? String(compCamps[0].id) : prev.campaign_id,
    }));
  };

  const handleCloseModal = () => {
    setDialogOpen(false);
    setEditingOrder(null);
  };

  const handleOpenPayment = (ord: Order) => {
    setPayingOrder(ord);
    setPaymentSuccess(false);
    setPaymentOpen(true);
  };

  const handleProcessPayment = async () => {
    if (!payingOrder?.id) return;
    setProcessingPayment(true);
    try {
      const orderRes = await createPaymentOrder(payingOrder.id, paymentMethod);
      await verifyPayment(orderRes.gateway_payment_id, payingOrder.id, "SUCCESS");
      setPaymentSuccess(true);
      loadData();
    } catch (err) {
      console.error(err);
      alert("Payment processing failed.");
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload: Order = {
      order_number: formValues.order_number,
      company_id: parseInt(formValues.company_id, 10) || 1,
      employee_id: parseInt(formValues.employee_id, 10) || 1,
      campaign_id: parseInt(formValues.campaign_id, 10) || 1,
      order_date: formValues.order_date,
      total_amount: parseFloat(formValues.total_amount) || 0,
      status: formValues.status,
    };

    try {
      if (editingOrder && editingOrder.id) {
        await updateOrder(editingOrder.id, payload);
      } else {
        await createOrder(payload);
      }
      handleCloseModal();
      loadData();
    } catch (err) {
      console.error(err);
      alert("Error saving order. Please verify that company, employee and campaign are selected.");
    } finally {
      setSaving(false);
    }
  };

  const handleStatusQuickUpdate = async (ord: Order, newStatus: string) => {
    if (!ord.id) return;
    try {
      await updateOrder(ord.id, { status: newStatus as any });
      loadData();
    } catch (err) {
      console.error(err);
      alert("Failed to update order status.");
    }
  };

  const handleDownloadInvoice = async (orderId: number, orderNum: string) => {
    setDownloadingId(orderId);
    try {
      const blob = await downloadInvoice(orderId);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Invoice_${orderNum}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      alert("Failed to download PDF invoice.");
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await deleteOrder(id);
      loadData();
    } catch (err) {
      console.error(err);
      alert("Failed to delete order.");
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch = o.order_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const availableEmployees = employees.filter(
    (e) => !formValues.company_id || String(e.company_id) === formValues.company_id
  );

  const availableCampaigns = campaigns.filter(
    (c) => !formValues.company_id || String(c.company_id) === formValues.company_id
  );

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "text.primary" }}>
            Orders & Fulfillments
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Track gift orders, invoice generation, status workflows, and payment checkouts.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal()}
          sx={{
            bgcolor: "#6366F1",
            borderRadius: 2.5,
            px: 3,
            py: 1.2,
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "0 4px 14px rgba(99, 102, 241, 0.3)",
            "&:hover": { bgcolor: "#4F46E5" },
          }}
        >
          Create New Order
        </Button>
      </Box>

      {/* Filter Bar */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <TextField
          placeholder="Search by order #..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{ width: { xs: "100%", sm: 280 } }}
        />

        <TextField
          select
          size="small"
          label="Order Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ width: { xs: "100%", sm: 180 } }}
        >
          <MenuItem value="ALL">All Statuses</MenuItem>
          <MenuItem value="PENDING">Pending</MenuItem>
          <MenuItem value="APPROVED">Approved</MenuItem>
          <MenuItem value="PROCESSING">Processing</MenuItem>
          <MenuItem value="SHIPPED">Shipped</MenuItem>
          <MenuItem value="DELIVERED">Delivered</MenuItem>
          <MenuItem value="CANCELLED">Cancelled</MenuItem>
        </TextField>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 8 }}>
          <CircularProgress />
        </Box>
      ) : filteredOrders.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: "center", borderRadius: 3, border: "1px dashed #CBD5E1" }}>
          <ShoppingCartIcon sx={{ fontSize: 48, color: "#94A3B8", mb: 1 }} />
          <Typography variant="h6" sx={{ color: "text.secondary" }}>
            No orders found
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Click "Create New Order" to initiate a corporate gift shipment.
          </Typography>
        </Paper>
      ) : (
        <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
          <Table>
            <TableHead sx={{ bgcolor: "background.paper" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Order #</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Company</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Recipient Employee</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Order Date</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((ord) => {
                const comp = companies.find((c) => c.id === ord.company_id);
                const emp = employees.find((e) => e.id === ord.employee_id);
                const empName = emp
                  ? (emp.full_name || `${emp.first_name || ""} ${emp.last_name || ""}`.trim() || emp.work_email)
                  : `Employee #${ord.employee_id}`;

                return (
                  <TableRow key={ord.id} hover>
                    <TableCell>
                      <Typography sx={{ fontWeight: 700, color: "text.primary" }}>
                        {ord.order_number}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: 13.5, fontWeight: 500 }}>
                        {comp ? comp.name : `Company #${ord.company_id}`}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: 13.5 }}>
                        {empName}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: 13 }}>{ord.order_date}</TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 700, color: "#6366F1" }}>
                        ${Number(ord.total_amount).toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <TextField
                        select
                        size="small"
                        value={ord.status}
                        onChange={(e) => handleStatusQuickUpdate(ord, e.target.value)}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            fontSize: 12,
                            fontWeight: 600,
                          },
                        }}
                      >
                        <MenuItem value="PENDING">Pending</MenuItem>
                        <MenuItem value="APPROVED">Approved</MenuItem>
                        <MenuItem value="PROCESSING">Processing</MenuItem>
                        <MenuItem value="SHIPPED">Shipped</MenuItem>
                        <MenuItem value="DELIVERED">Delivered</MenuItem>
                        <MenuItem value="CANCELLED">Cancelled</MenuItem>
                      </TextField>
                    </TableCell>
                    <TableCell align="right">
                      {ord.status === "PENDING" && (
                        <Tooltip title="Pay Now / Checkout">
                          <IconButton size="small" sx={{ color: "#22C55E" }} onClick={() => handleOpenPayment(ord)}>
                            <CreditCardIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Download PDF Invoice">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => ord.id && handleDownloadInvoice(ord.id, ord.order_number)}
                          disabled={downloadingId === ord.id}
                        >
                          {downloadingId === ord.id ? (
                            <CircularProgress size={18} />
                          ) : (
                            <PictureAsPdfIcon fontSize="small" />
                          )}
                        </IconButton>
                      </Tooltip>
                      <IconButton size="small" onClick={() => handleOpenModal(ord)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => ord.id && handleDelete(ord.id)} sx={{ color: "#EF4444" }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* Payment Gateway Modal */}
      <Dialog open={paymentOpen} onClose={() => setPaymentOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          Payment Checkout Simulation
        </DialogTitle>
        <DialogContent dividers>
          {paymentSuccess ? (
            <Box sx={{ textAlign: "center", py: 2 }}>
              <CheckCircleIcon sx={{ fontSize: 60, color: "#22C55E", mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Payment Successful!
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Order #{payingOrder?.order_number} status updated to APPROVED.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ py: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                Order Total: ${Number(payingOrder?.total_amount).toFixed(2)}
              </Typography>
              <TextField
                select
                fullWidth
                label="Payment Method"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                sx={{ mb: 2 }}
              >
                <MenuItem value="CARD">Credit / Debit Card</MenuItem>
                <MenuItem value="UPI">UPI / NetBanking</MenuItem>
              </TextField>
              <TextField
                fullWidth
                label={paymentMethod === "CARD" ? "Card Number (Dummy)" : "UPI ID (Dummy)"}
                defaultValue={paymentMethod === "CARD" ? "4242 •••• •••• 4242" : "user@upi"}
                sx={{ mb: 2 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setPaymentOpen(false)}>
            {paymentSuccess ? "Close" : "Cancel"}
          </Button>
          {!paymentSuccess && (
            <Button
              variant="contained"
              disabled={processingPayment}
              onClick={handleProcessPayment}
              sx={{ bgcolor: "#22C55E" }}
            >
              {processingPayment ? <CircularProgress size={24} color="inherit" /> : "Pay Now"}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Create / Edit Modal */}
      <Dialog open={dialogOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <form onSubmit={handleSave}>
          <DialogTitle sx={{ fontWeight: 700 }}>
            {editingOrder ? "Edit Order Details" : "Create New Order"}
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid size={6}>
                <TextField
                  fullWidth
                  label="Order Number"
                  required
                  value={formValues.order_number}
                  onChange={(e) => setFormValues({ ...formValues, order_number: e.target.value })}
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Order Date"
                  slotProps={{ inputLabel: { shrink: true } }}
                  value={formValues.order_date}
                  onChange={(e) => setFormValues({ ...formValues, order_date: e.target.value })}
                />
              </Grid>

              {/* Company Selection */}
              <Grid size={12}>
                <TextField
                  select
                  fullWidth
                  label="Company"
                  value={formValues.company_id}
                  onChange={(e) => handleCompanyChange(e.target.value)}
                >
                  {companies.map((c) => (
                    <MenuItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Filtered Recipient Employee */}
              <Grid size={6}>
                <TextField
                  select
                  fullWidth
                  label="Recipient Employee"
                  value={formValues.employee_id}
                  onChange={(e) => setFormValues({ ...formValues, employee_id: e.target.value })}
                >
                  {availableEmployees.length === 0 ? (
                    <MenuItem value="" disabled>No employees for this company</MenuItem>
                  ) : (
                    availableEmployees.map((emp) => {
                      const empName = emp.full_name || `${emp.first_name || ""} ${emp.last_name || ""}`.trim() || emp.work_email;
                      return (
                        <MenuItem key={emp.id} value={String(emp.id)}>
                          {empName}
                        </MenuItem>
                      );
                    })
                  )}
                </TextField>
              </Grid>

              {/* Filtered Campaign */}
              <Grid size={6}>
                <TextField
                  select
                  fullWidth
                  label="Campaign"
                  value={formValues.campaign_id}
                  onChange={(e) => setFormValues({ ...formValues, campaign_id: e.target.value })}
                >
                  {availableCampaigns.length === 0 ? (
                    <MenuItem value="" disabled>No campaigns for this company</MenuItem>
                  ) : (
                    availableCampaigns.map((camp) => (
                      <MenuItem key={camp.id} value={String(camp.id)}>
                        {camp.title}
                      </MenuItem>
                    ))
                  )}
                </TextField>
              </Grid>

              <Grid size={6}>
                <TextField
                  fullWidth
                  label="Total Amount ($)"
                  type="number"
                  required
                  value={formValues.total_amount}
                  onChange={(e) => setFormValues({ ...formValues, total_amount: e.target.value })}
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  select
                  fullWidth
                  label="Initial Order Status"
                  value={formValues.status}
                  onChange={(e) => setFormValues({ ...formValues, status: e.target.value as any })}
                >
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="APPROVED">Approved</MenuItem>
                  <MenuItem value="PROCESSING">Processing</MenuItem>
                  <MenuItem value="SHIPPED">Shipped</MenuItem>
                  <MenuItem value="DELIVERED">Delivered</MenuItem>
                  <MenuItem value="CANCELLED">Cancelled</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={handleCloseModal} disabled={saving}>
              Cancel
            </Button>
            <Button variant="contained" type="submit" disabled={saving} sx={{ bgcolor: "#6366F1" }}>
              {saving ? <CircularProgress size={24} color="inherit" /> : editingOrder ? "Save Changes" : "Place Order"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
