import React from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, alpha } from '@mui/material';
import { LayoutDashboard, Ticket, Settings, Users, MessageSquare, BarChart3, HelpCircle } from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';

export function Sidebar() {
  const { url, props } = usePage();
  const user = (props.auth as any)?.user;
  const isAdmin = user?.role === 'admin';

  const menuItems = [
    { text: 'نظرة عامة', icon: LayoutDashboard, route: 'dashboard' },
    { text: 'التذاكر', icon: Ticket, route: 'tickets-dashboard' },
    { text: 'العملاء والمحادثات', icon: Users, route: 'customers' },
    // { text: 'المحادثات الذكية', icon: MessageSquare, route: 'chat' },
    ...(isAdmin ? [{ text: 'فريق الدعم', icon: Users, route: 'team' }] : []),
  ];

  const secondaryItems = [
    { text: 'الإعدادات', icon: Settings, route: 'settings' },
    { text: 'المساعدة', icon: HelpCircle, route: 'help' },
  ];

  const isActive = (route: string) => {
    // Basic active state logic for demonstration
    return url.includes(route) || (route === 'dashboard' && url === '/');
  };

  return (
    <Box
      sx={{
        width: 280,
        flexShrink: 0,
        bgcolor: '#161c27', // surface_container_low
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 1200,
      }}
    >
      <Box sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1.5,
            background: 'linear-gradient(135deg, #9fcaff 0%, #4894e2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ width: 24, height: 24, bgcolor: '#003259', mask: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2\'/%3E%3Ccircle cx=\'12\' cy=\'7\' r=\'4\'/%3E%3C/svg%3E") no-repeat center' }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: -0.5, color: '#9fcaff' }}>
            Rafiq AI
        </Typography>
      </Box>

      <Box sx={{ px: 2, flexGrow: 1 }}>
        <Typography variant="overline" sx={{ px: 2, opacity: 0.5, letterSpacing: 1, fontWeight: 700 }}>
          القائمة الرئيسية
        </Typography>
        <List sx={{ mt: 1 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                href={`/${item.route}`}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  position: 'relative',
                  bgcolor: isActive(item.route) ? alpha('#9fcaff', 0.08) : 'transparent',
                  color: isActive(item.route) ? '#9fcaff' : '#c0c7d3',
                  '&:hover': {
                    bgcolor: alpha('#9fcaff', 0.04),
                    color: '#9fcaff',
                  },
                  '&::after': isActive(item.route) ? {
                    content: '""',
                    position: 'absolute',
                    right: -16, // Assuming RTL, this stays on the outer edge
                    top: '20%',
                    height: '60%',
                    width: 4,
                    bgcolor: '#9fcaff',
                    borderRadius: '4px 0 0 4px',
                  } : {},
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                  <item.icon size={20} />
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive(item.route) ? 700 : 500,
                    fontSize: '0.95rem'
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ px: 2, pb: 4 }}>
        <List>
          {secondaryItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                sx={{
                  borderRadius: 2,
                  color: '#c0c7d3',
                  '&:hover': { color: '#9fcaff', bgcolor: alpha('#9fcaff', 0.04) }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                  <item.icon size={20} />
                </ListItemIcon>
                <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: '0.9rem' }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}
