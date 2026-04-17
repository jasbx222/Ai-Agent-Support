import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import { Box, CssBaseline, AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { rafiqTheme } from '../Theme/RafiqTheme';
import { ChatWidget } from '../Components/Chat/ChatWidget';
import { Link, usePage } from '@inertiajs/react';

const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

interface Props {
  children: React.ReactNode;
}

export default function CustomerLayout({ children }: Props) {
  const { props } = usePage();
  const user = (props.auth as any)?.user;

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={rafiqTheme}>
        <CssBaseline />
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#07090f' }}>

          <AppBar
            position="fixed"
            elevation={0}
            sx={{
              bgcolor: 'rgba(13, 20, 36, 0.75)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
            }}
          >
            <Container maxWidth="lg">
              <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 0 }, py: 0.5 }}>

                {/* Logo */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 16px rgba(59,130,246,0.4)',
                    }}
                  >
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        bgcolor: 'white',
                        mask: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='12' cy='7' r='4'/%3E%3C/svg%3E") no-repeat center`,
                        maskSize: 'contain',
                      }}
                    />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 800,
                      fontSize: 18,
                      color: 'white',
                      letterSpacing: '-0.3px',
                    }}
                  >
                    Rafiq{' '}
                    <Box component="span" sx={{ color: '#60a5fa' }}>AI</Box>
                  </Typography>
                </Box>

                {/* Actions */}
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                  {user ? (
                    <>
                      {(user.role === 'admin' || user.role === 'employee') && (
                        <Button
                          component={Link}
                          href="/dashboard"
                          variant="outlined"
                          size="small"
                          sx={{
                            color: 'rgba(255,255,255,0.8)',
                            borderColor: 'rgba(255,255,255,0.15)',
                            borderRadius: 2,
                            fontSize: 13,
                            fontWeight: 600,
                            px: 2.5,
                            '&:hover': {
                              borderColor: '#3b82f6',
                              bgcolor: 'rgba(59,130,246,0.08)',
                              color: 'white',
                            },
                          }}
                        >
                          لوحة التحكم
                        </Button>
                      )}
                      <Button
                        component={Link}
                        href="/logout"
                        method="post"
                        as="button"
                        size="small"
                        sx={{
                          color: 'rgba(255,255,255,0.5)',
                          fontSize: 13,
                          fontWeight: 600,
                          borderRadius: 2,
                          px: 2,
                          '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.06)' },
                        }}
                      >
                        تسجيل الخروج
                      </Button>
                    </>
                  ) : (
                    <Button
                      component={Link}
                      href="/login"
                      variant="contained"
                      size="small"
                      sx={{
                        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                        boxShadow: '0 0 20px rgba(59,130,246,0.35)',
                        borderRadius: 2,
                        fontSize: 13,
                        fontWeight: 700,
                        px: 3,
                        py: 1,
                        '&:hover': {
                          boxShadow: '0 0 30px rgba(59,130,246,0.55)',
                          transform: 'translateY(-1px)',
                        },
                        transition: 'all 0.25s',
                      }}
                    >
                      تسجيل الدخول
                    </Button>
                  )}
                </Box>

              </Toolbar>
            </Container>
          </AppBar>

          <Box component="main" sx={{ flexGrow: 1 }}>
            {children}
          </Box>

          <ChatWidget type="customer" />
        </Box>
      </ThemeProvider>
    </CacheProvider>
  );
}