import { createTheme, alpha } from '@mui/material/styles';

const nexusPalette = {
  primary: {
    main: '#9fcaff',
    light: '#d2e4ff',
    dark: '#4894e2',
    contrastText: '#003259',
  },
  secondary: {
    main: '#c1c6d7',
    light: '#dde2f3',
    dark: '#434957',
    contrastText: '#161c27',
  },
  background: {
    default: '#0d131f',
    paper: '#161c27', // surface_container_low
  },
  surface: {
    base: '#0d131f',
    low: '#161c27',
    high: '#242a36',
    highest: '#2f3542',
    lowest: '#080e1a',
  },
  text: {
    primary: '#dde2f3',
    secondary: '#c0c7d3',
  },
  outline: {
    main: '#8b919c',
    variant: alpha('#414751', 0.15),
  }
};

export const nexusTheme = createTheme({
  direction: 'rtl', // Default to RTL for Arabic
  palette: {
    mode: 'dark',
    primary: nexusPalette.primary,
    secondary: nexusPalette.secondary,
    background: nexusPalette.background,
    text: nexusPalette.text,
  },
  typography: {
    fontFamily: '"Tajawal", "Inter", sans-serif',
    h1: { fontFamily: '"Manrope", sans-serif', fontWeight: 700 },
    h2: { fontFamily: '"Manrope", sans-serif', fontWeight: 600 },
    h3: { fontFamily: '"Manrope", sans-serif', fontWeight: 600 },
    h4: { fontFamily: '"Manrope", sans-serif', fontWeight: 600 },
    h5: { fontFamily: '"Manrope", sans-serif', fontWeight: 500 },
    h6: { fontFamily: '"Manrope", sans-serif', fontWeight: 500 },
    button: {
      textTransform: 'none',
      fontWeight: 'bold',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 0 15px ' + alpha(nexusPalette.primary.main, 0.3),
          },
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${nexusPalette.primary.main} 0%, ${nexusPalette.primary.dark} 100%)`,
          color: nexusPalette.primary.contrastText,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: nexusPalette.surface.low,
          backgroundImage: 'none',
          border: 'none',
          boxShadow: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: nexusPalette.surface.low,
          backgroundImage: 'none',
        },
      },
    },
  },
});

// Helper for Glassmorphism
export const glassStyle = (opacity = 0.7, blur = 12) => ({
  backgroundColor: alpha(nexusPalette.surface.low, opacity),
  backdropFilter: `blur(${blur}px)`,
  WebkitBackdropFilter: `blur(${blur}px)`,
  border: `1px solid ${alpha('#ffffff', 0.05)}`,
});
