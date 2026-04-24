import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import { Box, CssBaseline, Typography } from '@mui/material';
import { rafiqTheme } from '../Theme/RafiqTheme';
import { Sidebar } from '../Components/Dashboard/Sidebar';
import { ChatWidget } from '../Components/Chat/ChatWidget';
import { usePage } from '@inertiajs/react';
import { NotificationBell } from '../Components/Notifications/NotificationBell';
import { NotificationToast } from '../Components/Notifications/NotificationToast';
import { useNotifications } from '../Hooks/useNotifications';

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
  const { lastToast, setLastToast } = useNotifications();

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={rafiqTheme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#07090f' }}>
          <Sidebar />

          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
            }}
          >
            {/* TopBar */}
            <Box
              sx={{
                h: 70,
                px: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                bgcolor: 'rgba(13, 20, 36, 0.4)',
                backdropFilter: 'blur(10px)',
                position: 'sticky',
                top: 0,
                zIndex: 1100,
              }}
            >
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>
                Dashboard
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <NotificationBell />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 2, pl: 2, borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography sx={{ color: 'white', fontSize: '0.85rem', fontWeight: 600 }}>{auth.user.name}</Typography>
                    <Typography sx={{ color: 'gray', fontSize: '0.75rem' }}>{auth.user.role}</Typography>
                  </Box>
                  <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', fontWeight: 700 }}>
                    {auth.user.name.charAt(0)}
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: 3,
                width: '100%',
                overflow: 'auto',
              }}
            >
              {children}
            </Box>
          </Box>

          <NotificationToast notification={lastToast} onClose={() => setLastToast(null)} />
          <ChatWidget type={isAdmin ? 'admin' : 'customer'} />
        </Box>
      </ThemeProvider>
    </CacheProvider>
  );
}
