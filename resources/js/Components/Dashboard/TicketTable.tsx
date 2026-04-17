import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Box, alpha
} from '@mui/material';
import { MoreHorizontal } from 'lucide-react';

interface Props {
  tickets?: any[];
}

const priorityStyles: any = {
  Urgent: { color: '#ff5252' },
  High: { color: '#ffb74d' },
  Medium: { color: '#9fcaff' },
  Low: { color: '#8b919c' },
};

export function TicketTable({ tickets = [] }: Props) {
  console.log(tickets);

  return (
    <Box sx={{ mt: 4 }}>
      <Box
        sx={{
          mb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          أحدث التذاكر
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: 'primary.main', cursor: 'pointer', fontWeight: 600 }}
        >
          عرض الكل
        </Typography>
      </Box>

      <TableContainer
        component={Paper}
        sx={{ bgcolor: 'transparent', boxShadow: 'none' }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow
              sx={{
                '& th': {
                  borderBottom: '1px solid ' + alpha('#414751', 0.15),
                  py: 2,
                  fontWeight: 700,
                  color: 'text.secondary',
                },
              }}
            >
              <TableCell>الموضوع</TableCell>
              <TableCell>الوصف</TableCell>
              <TableCell>القسم</TableCell>
              <TableCell>الحالة</TableCell>
              <TableCell>الأولوية</TableCell>
              <TableCell>التاريخ</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {tickets.length > 0 ? (
              tickets.map((ticket, index) => {
                const priorityKey = ticket?.priority || 'Low';
                const priorityStyle =
                  priorityStyles[priorityKey] || { color: '#8b919c' };

                const statusText =
                  ticket?.status === 'open'
                    ? 'مفتوحة'
                    : ticket?.status === 'Pending'
                    ? 'قيد الانتظار'
                    : 'تم الحل';

                return (
                  <TableRow
                    key={ticket?.id ?? index}
                    sx={{
                      '& td': {
                        borderBottom: '1px solid ' + alpha('#414751', 0.1),
                        py: 2.5,
                      },
                      '&:last-child td': { border: 0 },
                      '&:hover': { bgcolor: alpha('#9fcaff', 0.02) },
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {ticket?.subject ?? '-'}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {ticket?.description ?? '-'}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {ticket?.department ?? '-'}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 1,
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                        }}
                      >
                        <Typography variant="caption" sx={{ fontWeight: 700 }}>
                          {statusText}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            bgcolor: priorityStyle.color,
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            color: priorityStyle.color,
                            fontWeight: 600,
                            fontSize: '0.85rem',
                          }}
                        >
                          {ticket?.priority ?? '-'}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: 500, color: 'text.secondary' }}
                      >
                        {ticket?.updated_at ?? '-'}
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      <MoreHorizontal
                        size={18}
                        style={{ opacity: 0.5, cursor: 'pointer' }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    لا توجد تذاكر حالياً
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}