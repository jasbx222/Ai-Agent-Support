import React, { useState } from 'react';
import { Typography, Box, Button } from '@mui/material';
import { Head } from '@inertiajs/react';
import { Plus } from 'lucide-react';

import DashboardLayout from '../Layouts/DashboardLayout';
import { StatsOverview } from '../Components/Dashboard/StatsOverview';
import { TicketTable } from '../Components/Dashboard/TicketTable';
import { CreateTicketModal } from '../Components/Dashboard/CreateTicketModal';
import { AiUsageTable } from '../Components/Dashboard/AiUsageTable';

interface Props {
  stats?: any[];
  tickets?: any[];
  aiLogs?: any[];
}

export default function Dashboard({ stats = [], tickets = [], aiLogs = [] }: Props) {
  const [modalOpen, setModalOpen] = useState(false);

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


      </Box>

      <StatsOverview stats={stats} />
      <TicketTable tickets={tickets} />
      <AiUsageTable logs={aiLogs} />

      <CreateTicketModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </DashboardLayout>
  );
}