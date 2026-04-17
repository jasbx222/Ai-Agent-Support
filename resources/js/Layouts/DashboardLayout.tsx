import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import { Box, CssBaseline } from '@mui/material';
import { nexusTheme } from '../Theme/NexusTheme';
import { Sidebar } from '../Components/Dashboard/Sidebar';
import { ChatWidget } from '../Components/Chat/ChatWidget';
import { usePage } from '@inertiajs/react';
// Create RTL cache
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

interface Props {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  const { auth } = usePage().props as any;
  const isAdmin = auth.user.role === 'admin';
  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={nexusTheme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
          <Sidebar />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              width: { sm: `calc(100% - 280px)` },
              minHeight: '100vh',
              overflow: 'auto',
            }}
          >
            {children}
          </Box>
          <ChatWidget type={isAdmin ? 'admin' : 'customer'} />
        </Box>
      </ThemeProvider>
    </CacheProvider>
  );
}
