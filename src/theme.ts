import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'var(--font-ibm-plex-sans-thai), "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600 },
  },
  palette: {
    primary: {
      main: '#6366f1', // Modern Indigo
      light: '#818cf8',
      dark: '#4f46e5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ec4899', // Vibrant Pink
      light: '#f472b6',
      dark: '#db2777',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc', // Very light blue-grey
      paper: '#ffffff',
    },
    success: {
      main: '#10b981',
    },
    info: {
      main: '#0ea5e9',
    }
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 30, // Pill shape
          textTransform: 'none',
          padding: '10px 24px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
          '&.MuiButton-containedPrimary': {
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)',
            }
          },
          '&.MuiButton-containedSecondary': {
            background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #db2777 0%, #e11d48 100%)',
            }
          }
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 24,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          backgroundColor: '#e2e8f0',
        },
        bar: {
          borderRadius: 10,
          background: 'linear-gradient(90deg, #6366f1 0%, #ec4899 100%)',
        }
      }
    }
  },
});

export default theme;