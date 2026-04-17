import React from 'react';
import { Grid, Box, Typography, alpha } from '@mui/material';
import { TrendingUp, Clock, Zap, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap: any = {
  MessageCircle,
  Clock,
  Zap,
  TrendingUp,
};

interface Props {
  stats?: any[];
}

export function StatsOverview({ stats = [] }: Props) {
  return (
    <Grid container spacing={3}>
      {stats.map((stat, index) => {
        const Icon = iconMap?.[stat?.icon] || MessageCircle;
        const statColor = stat?.color || '#9fcaff';
        const statChange = String(stat?.change || '0%');
        const isPositive = statChange.startsWith('+');

        return (
          <Grid item xs={12} sm={6} md={3} key={stat?.title || index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.1,
                type: 'spring',
                stiffness: 300,
                damping: 30,
              }}
            >
              <Box
                sx={{
                  p: 3,
                  borderRadius: 4,
                  bgcolor: '#161c27',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '4px',
                    bgcolor: alpha(statColor, 0.3),
                  },
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: alpha(statColor, 0.1),
                      color: statColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={24} />
                  </Box>

                  <Typography
                    variant="caption"
                    sx={{
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      bgcolor: isPositive ? alpha('#4caf50', 0.1) : alpha('#f44336', 0.1),
                      color: isPositive ? '#81c784' : '#e57373',
                      fontWeight: 700,
                    }}
                  >
                    {statChange}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: '"Manrope", sans-serif' }}>
                    {stat?.value ?? 0}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.6, fontWeight: 500 }}>
                    {stat?.title || 'بدون عنوان'}
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          </Grid>
        );
      })}
    </Grid>
  );
}