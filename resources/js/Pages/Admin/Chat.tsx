import React, { useState, useRef, useEffect } from 'react';
import DashboardLayout from '../../Layouts/DashboardLayout';
import { 
  Box, 
  Typography, 
  TextField, 
  IconButton, 
  Paper, 
  alpha,
  Avatar,
  InputAdornment,
  CircularProgress,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Card,
  CardContent
} from '@mui/material';
import { Send, Bot, User, Sparkles, ArrowLeft, Ticket as TicketIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { router, usePage } from '@inertiajs/react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

interface TicketInfo {
  id: number;
  subject: string;
  description: string;
  status: string;
  priority: string;
  user?: {
    id: number;
    name: string;
  };
}

interface Props {
  tickets: TicketInfo[];
  selectedTicket?: TicketInfo;
}

export default function AdminChat({ tickets, selectedTicket }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'أهلاً بك في لوحة الدعم الفني. اختر تذكرة للبدء أو أرسل رسالة.', sender: 'ai' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentTicketId, setCurrentTicketId] = useState<number | null>(selectedTicket?.id ?? null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (selectedTicket) {
      setCurrentTicketId(selectedTicket.id);
    }
  }, [selectedTicket]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const payload: { message: string; ticket_id?: number } = { message: input };
      if (currentTicketId) {
        payload.ticket_id = currentTicketId;
      }

      const response = await axios.post('/admin/tickets/trigger', payload);
      const aiData = response.data.data;
      
      let aiReply = 'شكراً لتواصلكم، سأقوم بمساعدتكم.';
      
      if (typeof aiData === 'string') {
        aiReply = aiData;
      } else if (aiData.reply) {
        aiReply = aiData.reply;
      } else if (aiData.text) {
        try {
          const parsed = JSON.parse(aiData.text);
          aiReply = parsed.reply || aiData.text;
        } catch (e) {
          aiReply = aiData.text;
        }
      }

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: aiReply,
        sender: 'ai'
      }]);
    } catch (error) {
      console.error('Chat Error:', error);
      setMessages(prev => [...prev, {
        id: Date.now() + 2,
        text: 'عذراً، حدث خطأ أثناء التواصل مع المساعد. يرجى المحاولة مرة أخرى.',
        sender: 'ai'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTicketChange = (ticketId: number) => {
    setCurrentTicketId(ticketId);
    setMessages([
      { id: 1, text: 'تم اختيار تذكرة جديدة. كيف يمكنني مساعدتك؟', sender: 'ai' },
    ]);
    router.visit(route('admin.chat', { ticket_id: ticketId }));
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
      <Box sx={{ display: 'flex', height: 'calc(100vh - 100px)', gap: 3 }}>
        {/* قائمة التذاكر */}
        <Paper sx={{ width: 300, p: 2, borderRadius: 3, overflow: 'auto' }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
            التذاكر
          </Typography>
          
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>اختر تذكرة</InputLabel>
            <Select
              value={currentTicketId || ''}
              label="اختر تذكرة"
              onChange={(e) => handleTicketChange(e.target.value as number)}
            >
              {tickets.map((ticket) => (
                <MenuItem key={ticket.id} value={ticket.id}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {ticket.subject}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                      <Chip 
                        label={ticket.status === 'Open' ? 'مفتوحة' : ticket.status === 'In Progress' ? 'قيد العمل' : 'مغلقة'}
                        color={getStatusColor(ticket.status) as any}
                        size="small"
                        sx={{ height: 18, fontSize: '0.65rem' }}
                      />
                      <Chip 
                        label={ticket.priority}
                        color={getPriorityColor(ticket.priority) as any}
                        size="small"
                        variant="outlined"
                        sx={{ height: 18, fontSize: '0.65rem' }}
                      />
                    </Box>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* قائمة التذاكر */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {tickets.map((ticket) => (
              <Card 
                key={ticket.id}
                sx={{ 
                  cursor: 'pointer',
                  border: currentTicketId === ticket.id ? '2px solid' : '1px solid',
                  borderColor: currentTicketId === ticket.id ? 'primary.main' : 'divider',
                  '&:hover': { bgcolor: alpha('#9fcaff', 0.05) }
                }}
                onClick={() => handleTicketChange(ticket.id)}
              >
                <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {ticket.subject}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ 
                    display: '-webkit-box',
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {ticket.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, mt: 1 }}>
                    <Chip 
                      label={ticket.status === 'Open' ? 'مفتوحة' : ticket.status === 'In Progress' ? 'قيد العمل' : 'مغلقة'}
                      color={getStatusColor(ticket.status) as any}
                      size="small"
                      sx={{ height: 16, fontSize: '0.6rem' }}
                    />
                    <Chip 
                      label={ticket.priority}
                      color={getPriorityColor(ticket.priority) as any}
                      size="small"
                      variant="outlined"
                      sx={{ height: 16, fontSize: '0.6rem' }}
                    />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Paper>

        {/* منطقة المحادثة */}
        <Paper sx={{ flex: 1, borderRadius: 3, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Header */}
          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2, bgcolor: alpha('#4894e2', 0.02) }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <Sparkles size={20} />
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Rafiq AI Assistant</Typography>
              <Typography variant="caption" color="success.main" sx={{ fontWeight: 700 }}>متصل الآن</Typography>
            </Box>
            {currentTicketId && (
              <Chip 
                label={`تذكرة #${currentTicketId}`}
                size="small"
                sx={{ ml: 'auto' }}
              />
            )}
          </Box>

          {/* Message Area */}
          <Box sx={{ flex: 1, p: 3, overflowY: 'auto' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ 
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '80%'
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 1.5, 
                    flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row' 
                  }}>
                    <Avatar 
                      sx={{ 
                        width: 32, 
                        height: 32, 
                        bgcolor: msg.sender === 'user' ? 'secondary.main' : 'primary.main',
                        display: { xs: 'none', sm: 'flex' }
                      }}
                    >
                      {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </Avatar>
                    <Box sx={{ 
                      p: 2, 
                      borderRadius: msg.sender === 'user' ? '20px 20px 0 20px' : '20px 20px 20px 0',
                      bgcolor: msg.sender === 'user' ? 'primary.main' : alpha('#9fcaff', 0.1),
                      color: msg.sender === 'user' ? 'white' : 'text.primary',
                      boxShadow: msg.sender === 'user' ? '0 4px 10px ' + alpha('#3182ce', 0.3) : 'none'
                    }}>
                      <Typography variant="body1" sx={{ lineHeight: 1.6 }}>{msg.text}</Typography>
                    </Box>
                  </Box>
                </motion.div>
              ))}
              {isLoading && (
                <Box sx={{ alignSelf: 'flex-start', display: 'flex', gap: 1, p: 2, borderRadius: 3, bgcolor: alpha('#9fcaff', 0.05) }}>
                  <CircularProgress size={16} thickness={6} />
                  <Typography variant="caption">جاري التفكير...</Typography>
                </Box>
              )}
              <div ref={messagesEndRef} />
            </Box>
          </Box>

          {/* Footer Input */}
          <Box sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider' }}>
            <TextField
              fullWidth
              placeholder={currentTicketId ? "اكتب ردك للعميل هنا..." : "اختر تذكرة أولاً للبدء"}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              disabled={isLoading || !currentTicketId}
              InputProps={{
                sx: { borderRadius: 4, bgcolor: '#f1f5f9', '& fieldset': { border: 'none' } },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      onClick={handleSend} 
                      color="primary" 
                      disabled={!input.trim() || isLoading || !currentTicketId}
                      sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
                    >
                      <Send size={18} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Box>
        </Paper>
      </Box>
    </DashboardLayout>
  );
}