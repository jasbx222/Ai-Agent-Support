import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Box, alpha, Tooltip, Chip
} from '@mui/material';
import { Network, Bot, Cpu } from 'lucide-react';

interface Props {
  logs?: any[];
}

export function AiUsageTable({ logs = [] }: Props) {
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
          سجل عمليات الذكاء الاصطناعي
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: 'primary.main', cursor: 'pointer', fontWeight: 600 }}
        >
          عرض التفاصيل
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
              <TableCell>م</TableCell>
              <TableCell>الأمر (Prompt)</TableCell>
              <TableCell>نموذج الذكاء</TableCell>
              <TableCell>الحالة</TableCell>
              <TableCell>التكلفة والاستهلاك</TableCell>
              <TableCell>التاريخ</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {logs.length > 0 ? (
              logs.map((log) => {
                const truncatedPrompt = log?.prompt && log.prompt.length > 50
                  ? log.prompt.substring(0, 50) + '...'
                  : (log.prompt || 'أمر غير معروف');

                return (
                  <TableRow
                    key={log?.id}
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
                      <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                        #{log?.id}
                      </Typography>
                    </TableCell>

                    <TableCell sx={{ maxWidth: 300 }}>
                      <Tooltip title={log?.prompt || ''} placement="top" arrow>
                         <Typography variant="body2" sx={{ fontWeight: 500, cursor: 'help' }}>
                          {truncatedPrompt}
                         </Typography>
                      </Tooltip>
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Bot size={16} color="#8ecdff" />
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#dde2f3' }}>
                          {log?.model || 'غير محدد'}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                       <Chip 
                          label={log?.status === 'success' ? 'نجاح' : (log?.status === 'pending' ? 'قيد المعالجة' : 'فشل')}
                          size="small"
                          sx={{
                              bgcolor: log?.status === 'success' 
                                 ? alpha('#4caf50', 0.1) 
                                 : (log?.status === 'pending' ? alpha('#ffb74d', 0.1) : alpha('#ff5252', 0.1)),
                              color: log?.status === 'success' 
                                 ? '#4caf50' 
                                 : (log?.status === 'pending' ? '#ff9800' : '#ff5252'),
                              fontWeight: 700
                          }}
                       />
                    </TableCell>

                    <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                               <Cpu size={14} color="#9fcaff" />
                               <Typography variant="caption" sx={{ fontWeight: 700, color: '#9fcaff' }}>
                                 {log?.usage?.total_tokens || 0} Tokens
                               </Typography>
                            </Box>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                              ${log?.usage?.cost_usd ? Number(log.usage.cost_usd).toFixed(5) : '0.00000'}
                            </Typography>
                        </Box>
                    </TableCell>

                    <TableCell>
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: 500, color: 'text.secondary' }}
                      >
                        {log?.started_at ? new Date(log.started_at).toLocaleString('ar-SA') : '-'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    لا توجد سجلات ذكاء اصطناعي تفصيلية حالياً
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
