import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Layout } from './components/Layout';
import { UrlShortenerForm } from './components/UrlShortenerForm';
import { StatisticsPage } from './components/StatisticsPage';
import { RedirectHandler } from './components/RedirectHandler';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff8f00', // Bright orange
      light: '#ffb74d',
      dark: '#e65100',
    },
    secondary: {
      main: '#ffc107', // Amber
      light: '#fff350',
      dark: '#ff8f00',
    },
    background: {
      default: '#fff8e1', // Soft cream
      paper: '#fffde7', // Light cream for cards
    },
    text: {
      primary: '#3e2723', // Dark brown for contrast
      secondary: '#5d4037', // Medium brown
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
    },
    info: {
      main: '#2196f3',
      light: '#64b5f6',
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
    },
    error: {
      main: '#f44336',
      light: '#e57373',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 800,
      fontSize: '2.5rem',
      color: '#3e2723',
    },
    h5: {
      fontWeight: 700,
      fontSize: '1.8rem',
      color: '#3e2723',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.3rem',
      color: '#3e2723',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.9rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #fffde7 0%, #fff8e1 100%)',
          boxShadow: '0 8px 24px rgba(255, 143, 0, 0.15)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 193, 7, 0.2)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #ffffff 0%, #fffde7 100%)',
          boxShadow: '0 6px 20px rgba(255, 143, 0, 0.12)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 193, 7, 0.15)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 32px rgba(255, 143, 0, 0.2)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          borderRadius: '12px',
          textTransform: 'none',
          fontWeight: 700,
          fontSize: '1rem',
          padding: '12px 24px',
          background: 'linear-gradient(135deg, #ff8f00 0%, #ff9800 100%)',
          boxShadow: '0 6px 20px rgba(255, 143, 0, 0.4)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            background: 'linear-gradient(135deg, #e65100 0%, #ff8f00 100%)',
            boxShadow: '0 8px 28px rgba(255, 143, 0, 0.5)',
            transform: 'translateY(-2px)',
          },
        },
        outlined: {
          borderRadius: '12px',
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '1rem',
          padding: '12px 24px',
          borderWidth: '2px',
          borderColor: '#ff8f00',
          color: '#ff8f00',
          background: 'rgba(255, 143, 0, 0.05)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            borderWidth: '2px',
            background: 'rgba(255, 143, 0, 0.1)',
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 16px rgba(255, 143, 0, 0.2)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '12px',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#ff8f00',
                borderWidth: '2px',
              },
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#ff8f00',
                borderWidth: '2px',
              },
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          fontWeight: 600,
          fontSize: '0.85rem',
        },
        colorPrimary: {
          background: 'linear-gradient(135deg, #ff8f00 0%, #ff9800 100%)',
          color: 'white',
        },
        colorSuccess: {
          background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
          color: 'white',
        },
        colorInfo: {
          background: 'linear-gradient(135deg, #2196f3 0%, #42a5f5 100%)',
          color: 'white',
        },
        colorError: {
          background: 'linear-gradient(135deg, #f44336 0%, #ef5350 100%)',
          color: 'white',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          fontSize: '1rem',
          fontWeight: 500,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/:shortCode" element={<RedirectHandler />} />
          <Route path="/" element={
            <Layout>
              <UrlShortenerForm />
            </Layout>
          } />
          <Route path="/statistics" element={
            <Layout>
              <StatisticsPage />
            </Layout>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;