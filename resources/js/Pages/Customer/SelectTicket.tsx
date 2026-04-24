import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent,
  Button,
  alpha,
  Chip
} from '@mui/material';
import { Ticket, MessageCircle, Clock, AlertCircle } from 'lucide-react';
import { useForm } from '@inertiajs/react';

interface User {
  id: number;
  name: string;
}

interface TicketModel {
  id: number;
  subject: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Closed';
  priority: 'Low' | 'Medium' | 'High';
  created_at: string;
}

interface Props {
  tickets: TicketModel[];
}

export default function SelectTicket({ tickets }: Props) {
  const { post } = useForm();

  const handleSelectTicket = (ticketId: number) => {
    post(route('customer.chat.with', { ticket_id: ticketId }));
  };

  const handleCreateNew = () => {
    post(route('customer.chat.new'));
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-IQ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: '#f8fafc',
      py: 4,
      px: 2
    }}>
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: '#1e293b' }}>
            اختر تذكرتك
          </Typography>
          <Typography variant="body1" color="text.secondary">
            اختر تذكرة سابقة أو ابدأ محادثة جديدة
          </Typography>
        </Box>

        {/* زر إنشاء تذكرة جديدة */}
        <Card 
          sx={{ 
            mb: 3, 
            borderRadius: 3, 
            cursor: 'pointer',
            transition: 'all 0.2s',
            border: '2px solid',
            borderColor: alpha('#4894e2', 0.3),
            '&:hover': {
              borderColor: '#4894e2',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(72, 148, 226, 0.15)'
            }
          }}
          onClick={handleCreateNew}
        >
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 3 }}>
            <Box sx={{ 
              width: 56, 
              height: 56, 
              borderRadius: 2, 
              bgcolor: alpha('#4894e2', 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Ticket size={28} color="#4894e2" />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                محادثة جديدة
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ابدأ محادثة جديدة مع الدعم الفني
              </Typography>
            </Box>
            <Button variant="contained" size="small">
              ابدأ
            </Button>
          </CardContent>
        </Card>

        {/* قائمة التذاكر السابقة */}
        {tickets.length > 0 && (
          <>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#1e293b' }}>
              تذاكرك السابقة
            </Typography>
            
            {tickets.map((ticket) => (
              <Card 
                key={ticket.id}
                sx={{ 
                  mb: 2, 
                  borderRadius: 3,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': {
                    borderColor: '#4894e2',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
                  }
                }}
                onClick={() => handleSelectTicket(ticket.id)}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Box sx={{ 
                      width: 44, 
                      height: 44, 
                      borderRadius: 2, 
                      bgcolor: alpha('#4894e2', 0.08),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <MessageCircle size={22} color="#4894e2" />
                    </Box>
                    
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b' }}>
                          {ticket.subject}
                        </Typography>
                        <Chip 
                          label={ticket.status === 'Open' ? 'مفتوحة' : ticket.status === 'In Progress' ? 'قيد العمل' : 'مغلقة'}
                          color={getStatusColor(ticket.status) as any}
                          size="small"
                          sx={{ height: 22, fontSize: '0.7rem', fontWeight: 600 }}
                        />
                        <Chip 
                          label={ticket.priority === 'High' ? 'عالية' : ticket.priority === 'Medium' ? 'متوسطة' : 'منخفضة'}
                          color={getPriorityColor(ticket.priority) as any}
                          size="small"
                          variant="outlined"
                          sx={{ height: 22, fontSize: '0.7rem', fontWeight: 600 }}
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ 
                        mb: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {ticket.description}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                          <Clock size={14} />
                          <Typography variant="caption">{formatDate(ticket.created_at)}</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </>
        )}

        {tickets.length === 0 && (
          <Card sx={{ borderRadius: 3, p: 4, textAlign: 'center' }}>
            <AlertCircle size={48} color="#94a3b8" sx={{ mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              لا توجد تذاكر سابقة
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ابدأ محادثة جديدة أعلاه
            </Typography>
          </Card>
        )}
      </Box>
    </Box>
  );
}