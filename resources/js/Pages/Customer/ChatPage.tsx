import React, { useState, useRef, useEffect } from 'react';
import CustomerLayout from '../../Layouts/CustomerLayout';
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  IconButton, 
  Paper, 
  alpha,
  Avatar,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'أهلاً بك في الدعم الفني الذكي. كيف يمكنني مساعدتك اليوم؟', sender: 'ai' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/ticket/ai', { message: input });
      const aiData = response.data.data;
      
      // TicketAssistant might return just text or an object with content, or stringified JSON in 'text'
      let aiReply = 'شكراً لتواصلك معنا، سأقوم بمساعدتك.';
      
      if (typeof aiData === 'string') {
        aiReply = aiData;
      } else if (aiData.text) {
        try {
          // Parse if text field has stringified JSON schema
          const parsed = JSON.parse(aiData.text);
          aiReply = parsed.reply || aiData.text;
        } catch (e) {
          aiReply = aiData.text;
        }
      } else {
        aiReply = aiData.content || aiData.reply || aiReply;
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
      setIsLoading(true);
      // Brief delay to simulate thinking if needed, but here we just reset
      setIsLoading(false);
    }
  };

  return (
    <CustomerLayout>
      <Box sx={{ 
        height: 'calc(100vh - 64px)', 
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: '#f8fafc' 
      }}>
        <Container maxWidth="md" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', py: 4, overflow: 'hidden' }}>
          
          <Paper 
            elevation={0}
            sx={{ 
              flexGrow: 1, 
              mb: 3, 
              borderRadius: 4, 
              display: 'flex', 
              flexDirection: 'column',
              overflow: 'hidden',
              bgcolor: 'white',
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }}
          >
            {/* Header */}
            <Box sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2, bgcolor: alpha('#4894e2', 0.02) }}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <Sparkles size={20} />
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Nexus AI Assistant</Typography>
                <Typography variant="caption" color="success.main" sx={{ fontWeight: 700 }}>متصل الآن - جاهز للمساعدة</Typography>
              </Box>
            </Box>

            {/* Message Area */}
            <Box sx={{ flexGrow: 1, p: 3, overflowY: 'auto' }}>
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
                placeholder="اكتب سؤالك هنا..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                disabled={isLoading}
                InputProps={{
                  sx: { borderRadius: 4, bgcolor: '#f1f5f9', '& fieldset': { border: 'none' } },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton 
                        onClick={handleSend} 
                        color="primary" 
                        disabled={!input.trim() || isLoading}
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
          
          <Typography variant="caption" align="center" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            يستخدم هذا النظام تقنيات الذكاء الاصطناعي. قد تختلف النتائج بناءً على سياق المحادثة.
          </Typography>
        </Container>
      </Box>
    </CustomerLayout>
  );
}
