import React, { useState } from 'react';
import { Box, IconButton, Typography, alpha, TextField, InputAdornment, Slide, Paper, Chip } from '@mui/material';
import { MessageCircle, X, Send, Sparkles, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { glassStyle } from '../../Theme/RafiqTheme';
import axios from 'axios';
import { RichCard } from './RichCard';

export function ChatWidget({ type }: { type: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    { id: 1, text: 'أهلاً بك! أنا مساعدك الذكي. كيف يمكنني مساعدتك اليوم؟', sender: 'ai' },
  ]);
  const [input, setInput] = useState('');

const handleSend = async () => {
  if (!input.trim() || isLoading) return;

  const userText = input;
  const userMsg = { id: Date.now(), text: userText, sender: 'user' };
  setMessages(prev => [...prev, userMsg]);
  setInput('');
  setIsLoading(true);

  try {
    const response = await axios.post(
      `${type === 'admin' ? '/admin/tickets/trigger' : '/api/ticket/ai'}`,
      { message: userText }
    );

    const rawData = response?.data?.data;

    let parsedData: any = null;

    if (typeof rawData === 'string') {
      try {
        parsedData = JSON.parse(rawData);
      } catch {
        parsedData = { reply: rawData };
      }
    } else if (rawData?.text && typeof rawData.text === 'string') {
      try {
        parsedData = JSON.parse(rawData.text);
      } catch {
        parsedData = { reply: rawData.text };
      }
    } else if (rawData?.messages?.[0]?.content && typeof rawData.messages[0].content === 'string') {
      try {
        parsedData = JSON.parse(rawData.messages[0].content);
      } catch {
        parsedData = { reply: rawData.messages[0].content };
      }
    } else if (rawData && typeof rawData === 'object') {
      parsedData = rawData;
    }

    if (!parsedData) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          text: 'جرب تفصيل المشكلة أكثر حتى أتمكن من مساعدتك.',
          sender: 'ai',
        },
      ]);
      return;
    }

    if (type === 'admin') {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          text: parsedData.reply || 'تم تحليل الرسالة بنجاح.',
          sender: 'ai',
        },
        {
          id: Date.now() + 2,
          sender: 'ai',
          isRichCard: true,
          aiData: parsedData,
        },
      ]);
    } else {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          text: parsedData.reply || 'شكراً لتواصلك معنا، سأقوم بمساعدتك.',
          sender: 'ai',
        },
      ]);
    }
  } catch (error) {
    console.error('Chat Error:', error);
    setMessages(prev => [
      ...prev,
      {
        id: Date.now() + 1,
        text: 'عذراً، حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.',
        sender: 'ai',
      },
    ]);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <Box sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 2000 }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <Paper
              sx={{
                width: { xs: 'calc(100vw - 64px)', sm: 400 },
                height: 600,
                mb: 2,
                borderRadius: 4,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                ...glassStyle(0.8, 20),
              }}
              elevation={0}
            >
              {/* Header */}
              <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: alpha('#9fcaff', 0.1) }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: '#9fcaff', color: '#003259' }}>
                    <Sparkles size={20} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>المساعد الذكي</Typography>
                    <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700 }}>• متصل الآن</Typography>
                  </Box>
                </Box>
                <IconButton onClick={() => setIsOpen(false)} sx={{ color: 'text.secondary' }}>
                  <X size={20} />
                </IconButton>
              </Box>

              {/* Messages */}
              <Box sx={{ flexGrow: 1, p: 3, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
                {messages?.map((msg) => (
                  <Box
                    key={msg.id}
                    sx={{
                      alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '85%',
                    }}
                  >
                    {msg.isRichCard ? (
                      <RichCard type="ai_analysis" {...msg.aiData} />
                    ) : (
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 3,
                          bgcolor: msg.sender === 'user' ? '#2f3542' : alpha('#9fcaff', 0.15),
                          color: msg.sender === 'user' ? '#dde2f3' : '#9fcaff',
                          backdropFilter: msg.sender === 'ai' ? 'blur(10px)' : 'none',
                          border: msg.sender === 'ai' ? `1px solid ${alpha('#9fcaff', 0.2)}` : 'none',
                          boxShadow: 'none',
                        }}
                      >
                        <Typography variant="body2" sx={{ lineHeight: 1.6, fontWeight: 500 }}>
                          {msg.text}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                ))}
                {isLoading && (
                  <Box sx={{ alignSelf: 'flex-start', display: 'flex', gap: 1, p: 2, borderRadius: 3, bgcolor: alpha('#9fcaff', 0.05) }}>
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, times: [0, 0.5, 1] }}>•</motion.div>
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2, times: [0, 0.5, 1] }}>•</motion.div>
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4, times: [0, 0.5, 1] }}>•</motion.div>
                  </Box>
                )}
              </Box>

              {/* Input */}
              <Box sx={{ p: 3, borderTop: `1px solid ${alpha('#ffffff', 0.05)}` }}>

                <TextField
                  fullWidth
                  placeholder="اكتب سؤالك هنا..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  InputProps={{
                    sx: {
                      borderRadius: 3,
                      bgcolor: '#080e1a',
                      '& fieldset': { border: 'none' },
                    },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleSend} sx={{ color: 'primary.main', bgcolor: alpha('#9fcaff', 0.1), '&:hover': { bgcolor: alpha('#9fcaff', 0.2) } }}>
                          <Send size={18} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <IconButton
          onClick={() => setIsOpen(!isOpen)}
          sx={{
            width: 64,
            height: 64,
            bgcolor: '#9fcaff',
            color: '#003259',
            boxShadow: '0 8px 32px ' + alpha('#3182ce', 0.4),
            '&:hover': { bgcolor: '#8ecdff' },
          }}
        >
          {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        </IconButton>
      </motion.div>
    </Box>
  );
}
