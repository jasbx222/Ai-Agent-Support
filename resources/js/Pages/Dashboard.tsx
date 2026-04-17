import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import { Head } from '@inertiajs/react';
import { Plus } from 'lucide-react';

import DashboardLayout from '../Layouts/DashboardLayout';
import { StatsOverview } from '../Components/Dashboard/StatsOverview';
import { TicketTable } from '../Components/Dashboard/TicketTable';

interface Props {
  stats?: any[];
  tickets?: any[];
}

export default function Dashboard({ stats = [], tickets = [] }: Props) {
  return (
    <DashboardLayout>
      <Head title="Dashboard" />

      <Box
        sx={{
          mb: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            أهلاً بك، وكيل الدعم
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: 'text.secondary', fontWeight: 500 }}
          >
            إليك نظرة سريعة على ما يحدث في نظام الدعم الخاص بك اليوم.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Plus size={20} />}
          sx={{ height: 48, px: 3 }}
        >
          تذكرة جديدة
        </Button>
      </Box>

      <StatsOverview stats={stats} />
      <TicketTable tickets={tickets} />
    </DashboardLayout>
  );
}