import React from 'react';
import { Box, Typography, alpha, LinearProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { Chip } from '@mui/material';
interface RichCardProps {
  type?: 'ai_analysis' | 'order_status';
  title?: string;
  status?: string;
  progress?: number;
  details?: string;
  // AI specific
  department?: string;
  priority?: string;
  sentiment?: string;
  summary?: string;
}

export function RichCard({ type = 'ai_analysis', title, status, progress, details, department, priority, sentiment, summary }: RichCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <Box
        sx={{
          mt: 1,
          p: 2,
          borderRadius: 3,
          bgcolor: '#161c27',
          border: `1px solid ${alpha('#9fcaff', 0.1)}`,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#9fcaff' }}>
            {type === 'ai_analysis' ? 'تحليل الذكاء الاصطناعي' : title}
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ 
              px: 1, 
              py: 0.2, 
              borderRadius: 0.5, 
              bgcolor: alpha(priority === 'urgent' ? '#ff5252' : '#9fcaff', 0.1), 
              color: priority === 'urgent' ? '#ff5252' : '#9fcaff', 
              fontWeight: 700,
              textTransform: 'uppercase'
            }}
          >
            {type === 'ai_analysis' ? priority : status}
          </Typography>
        </Box>

        {type === 'ai_analysis' ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip label={department} size="small" sx={{ bgcolor: alpha('#9fcaff', 0.1), color: '#9fcaff', fontWeight: 700 }} />
              <Chip label={sentiment} size="small" sx={{ bgcolor: alpha('#9fcaff', 0.1), color: '#9fcaff', fontWeight: 700 }} />
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.85rem', lineHeight: 1.5 }}>
              {summary}
            </Typography>
          </Box>
        ) : (
          <>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" sx={{ opacity: 0.6 }}>التقدم</Typography>
                <Typography variant="caption" sx={{ fontWeight: 700 }}>{progress}%</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: alpha('#9fcaff', 0.05),
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 3,
                    background: 'linear-gradient(90deg, #3182ce 0%, #9fcaff 100%)',
                  }
                }}
              />
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.8rem' }}>
              {details}
            </Typography>
          </>
        )}
      </Box>
    </motion.div>
  );
}
