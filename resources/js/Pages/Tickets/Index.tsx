import React, { useState } from 'react';
import DashboardLayout from '../../Layouts/DashboardLayout';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  IconButton, 
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  alpha,
  CardContent,
  Grid
} from '@mui/material';
import { Plus, Ticket, Pencil, Trash2, User, Clock, AlertCircle } from 'lucide-react';
import { useForm } from '@inertiajs/react';

interface User {
  id: number;
  name: string;
}

interface TicketModel {
  id: number;
  user_id: number;
  subject: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Closed';
  priority: 'Low' | 'Medium' | 'High';
  user?: User;
}

interface Props {
  tickets: TicketModel[];
  customers: User[];
}

export default function TicketsIndex({ tickets, customers }: Props) {
  const [open, setOpen] = useState(false);
  const [editTicket, setEditTicket] = useState<TicketModel | null>(null);

  const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
    user_id: '',
    subject: '',
    description: '',
    status: 'Open',
    priority: 'Medium',
  });

  const handleOpen = (ticket?: TicketModel) => {
    if (ticket) {
      setEditTicket(ticket);
      setData({
        user_id: ticket.user_id.toString(),
        subject: ticket.subject,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
      });
    } else {
      setEditTicket(null);
      reset();
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editTicket) {
      put(route('tickets.dashboard.update', editTicket.id), {
        onSuccess: () => handleClose(),
      });
    } else {
      post(route('tickets.dashboard.store'), {
        onSuccess: () => handleClose(),
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذه التذكرة؟')) {
      destroy(route('tickets.dashboard.destroy', id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'success';
      case 'In Progress': return 'warning';
      case 'Closed': return 'error';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'info';
      default: return 'default';
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>التذاكر</Typography>
          <Typography variant="body1" color="text.secondary">عرض وإدارة تذاكر الدعم الفني</Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<Plus size={18} />}
          onClick={() => handleOpen()}
          sx={{ py: 1.5, px: 3 }}
        >
          إنشاء تذكرة
        </Button>
      </Box>

      <TableContainer component={Card} sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Table>
          <TableHead sx={{ bgcolor: alpha('#9fcaff', 0.05) }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>الموضوع</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>العميل</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>الحالة</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>الأولوية</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.id} hover>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{ticket.subject}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ 
                    display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' 
                  }}>
                    {ticket.description}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <User size={14} />
                    {ticket.user?.name || 'مستخدم غير معروف'}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={ticket.status === 'Open' ? 'مفتوحة' : ticket.status === 'In Progress' ? 'قيد العمل' : 'مغلقة'} 
                    color={getStatusColor(ticket.status) as any}
                    size="small"
                    variant="outlined"
                    sx={{ fontWeight: 700 }}
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={ticket.priority === 'High' ? 'عالية' : ticket.priority === 'Medium' ? 'متوسطة' : 'منخفضة'} 
                    color={getPriorityColor(ticket.priority) as any}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpen(ticket)} color="inherit" size="small">
                    <Pencil size={18} />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(ticket.id)} color="error" size="small">
                    <Trash2 size={18} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={{ fontWeight: 800 }}>
            {editTicket ? 'تعديل التذكرة' : 'إنشاء تذكرة جديدة'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
              {!editTicket && (
                <TextField 
                  select 
                  label="العميل" 
                  fullWidth
                  value={data.user_id}
                  onChange={e => setData('user_id', e.target.value)}
                  error={!!errors.user_id}
                  helperText={errors.user_id}
                >
                  {customers.map(c => (
                    <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                  ))}
                </TextField>
              )}
              
              {!editTicket && (
                <TextField 
                  label="الموضوع" 
                  fullWidth 
                  value={data.subject}
                  onChange={e => setData('subject', e.target.value)}
                  error={!!errors.subject}
                  helperText={errors.subject}
                />
              )}

              {!editTicket && (
                <TextField 
                  label="الوصف" 
                  multiline
                  rows={4}
                  fullWidth 
                  value={data.description}
                  onChange={e => setData('description', e.target.value)}
                  error={!!errors.description}
                  helperText={errors.description}
                />
              )}

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField 
                    select 
                    label="الحالة" 
                    fullWidth
                    value={data.status}
                    onChange={e => setData('status', e.target.value as any)}
                  >
                    <MenuItem value="Open">مفتوحة</MenuItem>
                    <MenuItem value="In Progress">قيد العمل</MenuItem>
                    <MenuItem value="Closed">مغلقة</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField 
                    select 
                    label="الأولوية" 
                    fullWidth
                    value={data.priority}
                    onChange={e => setData('priority', e.target.value as any)}
                  >
                    <MenuItem value="Low">منخفضة</MenuItem>
                    <MenuItem value="Medium">متوسطة</MenuItem>
                    <MenuItem value="High">عالية</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleClose} color="inherit">إلغاء</Button>
            <Button type="submit" variant="contained" disabled={processing}>حفظ</Button>
          </DialogActions>
        </form>
      </Dialog>
    </DashboardLayout>
  );
}
