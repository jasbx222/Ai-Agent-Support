import { createTheme, alpha } from '@mui/material/styles';

const rafiqPalette = {
  primary: {
    main: '#3b82f6', // More vibrant blue for Rafiq
    light: '#60a5fa',
    dark: '#1d4ed8',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#f59e0b', // Gold accent
    light: '#fbbf24',
    dark: '#d97706',
    contrastText: '#000000',
  },
  background: {
    default: '#07090f',
    paper: '#0d1424',
  },
  surface: {
    base: '#07090f',
    low: '#0d1424',
    high: '#131d30',
    highest: '#1e293b',
    lowest: '#030408',
  },
  text: {
    primary: '#f8fafc',
    secondary: 'rgba(255,255,255,0.45)',
  },
  outline: {
    main: 'rgba(255,255,255,0.07)',
    variant: 'rgba(255,255,255,0.03)',
  }
};

export const rafiqTheme = createTheme({
  direction: 'rtl',
  palette: {
    mode: 'dark',
    primary: rafiqPalette.primary,
    secondary: rafiqPalette.secondary,
    background: rafiqPalette.background,
    text: rafiqPalette.text,
  },
  typography: {
    fontFamily: '"Cairo", "Inter", sans-serif',
    h1: { fontFamily: '"Cairo", sans-serif', fontWeight: 900 },
    h2: { fontFamily: '"Cairo", sans-serif', fontWeight: 800 },
    h3: { fontFamily: '"Cairo", sans-serif', fontWeight: 700 },
    h4: { fontFamily: '"Cairo", sans-serif', fontWeight: 700 },
    h5: { fontFamily: '"Cairo", sans-serif', fontWeight: 600 },
    h6: { fontFamily: '"Cairo", sans-serif', fontWeight: 600 },
    button: {
      textTransform: 'none',
      fontWeight: 'bold',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 0 20px ' + alpha(rafiqPalette.primary.main, 0.4),
          },
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${rafiqPalette.primary.main} 0%, ${rafiqPalette.primary.dark} 100%)`,
          color: rafiqPalette.primary.contrastText,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: rafiqPalette.surface.low,
          backgroundImage: 'none',
          border: `1px solid ${rafiqPalette.outline.main}`,
          boxShadow: 'none',
          borderRadius: 16,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: rafiqPalette.surface.low,
          backgroundImage: 'none',
          borderRadius: 16,
        },
      },
    },
  },
});

export const glassStyle = (opacity = 0.75, blur = 20) => ({
  backgroundColor: alpha(rafiqPalette.surface.low, opacity),
  backdropFilter: `blur(${blur}px)`,
  WebkitBackdropFilter: `blur(${blur}px)`,
  border: `1px solid ${rafiqPalette.outline.main}`,
});
