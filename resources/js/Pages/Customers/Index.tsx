import React from 'react';
import { Head, Link } from '@inertiajs/react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, alpha, Chip, Button
} from '@mui/material';
import DashboardLayout from '../../Layouts/DashboardLayout';
import { Users, User as UserIcon, Calendar, ArrowLeft } from 'lucide-react';

interface Props {
  customers: any[];
}

export default function Index({ customers = [] }: Props) {
  return (
    <DashboardLayout>
      <Head title="العملاء والمحادثات" />

      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: alpha('#9fcaff', 0.1), color: '#9fcaff' }}>
          <Users size={28} />
        </Box>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            إدارة العملاء
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, mt: 0.5 }}>
            عرض حسابات العملاء ومراقبة محادثاتهم مع نظام الذكاء الاصطناعي ومع موظفي الدعم.
          </Typography>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ bgcolor: alpha('#161c27', 0.8), backdropFilter: 'blur(10px)', border: '1px solid ' + alpha('#9fcaff', 0.1) }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ '& th': { borderBottom: '1px solid ' + alpha('#9fcaff', 0.15), py: 2.5, fontWeight: 700, color: '#9fcaff' }}}>
              <TableCell>العميل</TableCell>
              <TableCell>البريد الإلكتروني</TableCell>
              <TableCell>تاريخ التسجيل</TableCell>
              <TableCell align="center">إجمالي التذاكر</TableCell>
              <TableCell align="center">عمليات AI</TableCell>
              <TableCell align="right">الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((user) => (
              <TableRow key={user.id} sx={{ '& td': { borderBottom: '1px solid ' + alpha('#414751', 0.1), py: 2 }, '&:hover': { bgcolor: alpha('#9fcaff', 0.03) }}}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: alpha('#4894e2', 0.2), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8ecdff' }}>
                      <UserIcon size={18} />
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {user.name}
                      {user.role === 'admin' && (
                         <Chip label="مشرف" size="small" sx={{ ml: 1, height: 20, fontSize: '0.7rem', bgcolor: alpha('#ffb74d', 0.1), color: '#ffb74d' }} />
                      )}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    {user.email}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Calendar size={14} color="#8b919c" />
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                      {new Date(user.created_at).toLocaleDateString('ar-SA')}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Chip label={user.tickets_count} size="small" sx={{ bgcolor: alpha('#9fcaff', 0.1), color: '#9fcaff', fontWeight: 800, minWidth: 40 }} />
                </TableCell>
                <TableCell align="center">
                  <Chip label={user.ai_runs_count} size="small" sx={{ bgcolor: alpha('#a55eea', 0.1), color: '#a55eea', fontWeight: 800, minWidth: 40 }} />
                </TableCell>
                <TableCell align="right">
                  <Button
                    component={Link}
                    href={`/customers/${user.id}`}
                    variant="outlined"
                    size="small"
                    endIcon={<ArrowLeft size={16} />}
                    sx={{ borderRadius: 2, borderColor: alpha('#9fcaff', 0.3) }}
                  >
                    عرض السجل
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            
            {customers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <Typography variant="body1" sx={{ color: 'text.secondary', mb: 1 }}>
                    لا يوجد عملاء حالياً
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </DashboardLayout>
  );
}
