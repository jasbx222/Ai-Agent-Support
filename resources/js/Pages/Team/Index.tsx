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
  alpha
} from '@mui/material';
import { Plus, UserPlus, Pencil, Trash2, Mail, Shield } from 'lucide-react';
import { useForm } from '@inertiajs/react';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'employee' | 'user';
}

interface Props {
  team: User[];
}

export default function TeamIndex({ team }: Props) {
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);

  const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
    name: '',
    email: '',
    password: '',
    role: 'employee',
  });

  const handleOpen = (user?: User) => {
    if (user) {
      setEditUser(user);
      setData({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role as any,
      });
    } else {
      setEditUser(null);
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
    if (editUser) {
      put(route('team.update', editUser.id), {
        onSuccess: () => handleClose(),
      });
    } else {
      post(route('team.store'), {
        onSuccess: () => handleClose(),
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا الموظف؟')) {
      destroy(route('team.destroy', id));
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>فريق الدعم</Typography>
          <Typography variant="body1" color="text.secondary">إدارة موظفي الدعم والصلاحيات</Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<UserPlus size={18} />}
          onClick={() => handleOpen()}
          sx={{ py: 1.5, px: 3 }}
        >
          إضافة موظف
        </Button>
      </Box>

      <TableContainer component={Card} sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Table>
          <TableHead sx={{ bgcolor: alpha('#9fcaff', 0.05) }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>اسم الموظف</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>البريد الإلكتروني</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>الصلاحية</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {team.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ 
                      w: 40, h: 40, borderRadius: '50%', 
                      bgcolor: alpha('#9fcaff', 0.1), 
                      display: 'flex', alignItems: 'center', justifyContent: 'center' 
                    }}>
                      <Typography variant="subtitle2" color="primary">{user.name[0]}</Typography>
                    </Box>
                    <Typography variant="subtitle2">{user.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Mail size={16} color="#64748b" />
                    {user.email}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    icon={<Shield size={14} />}
                    label={user.role === 'admin' ? 'مدير' : 'موظف'} 
                    color={user.role === 'admin' ? 'primary' : 'default'}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpen(user)} color="inherit" size="small">
                    <Pencil size={18} />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(user.id)} color="error" size="small">
                    <Trash2 size={18} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={{ fontWeight: 800 }}>
            {editUser ? 'تحديث بيانات الموظف' : 'إضافة موظف جديد'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
              <TextField 
                label="الاسم" 
                fullWidth 
                value={data.name}
                onChange={e => setData('name', e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
              />
              <TextField 
                label="البريد الإلكتروني" 
                fullWidth 
                disabled={!!editUser}
                value={data.email}
                onChange={e => setData('email', e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
              />
              {!editUser && (
                <TextField 
                  label="كلمة المرور" 
                  type="password"
                  fullWidth 
                  value={data.password}
                  onChange={e => setData('password', e.target.value)}
                  error={!!errors.password}
                  helperText={errors.password}
                />
              )}
              <TextField 
                select 
                label="الصلاحية" 
                fullWidth
                value={data.role}
                onChange={e => setData('role', e.target.value as any)}
                error={!!errors.role}
                helperText={errors.role}
              >
                <MenuItem value="employee">موظف عادي</MenuItem>
                <MenuItem value="admin">مدير</MenuItem>
              </TextField>
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
