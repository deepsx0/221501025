import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
  IconButton,
} from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Link as LinkIcon, BarChart3 } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fff8e1 0%, #ffecb3 25%, #ffe0b2 50%, #ffcc80 75%, #ffb74d 100%)',
    }}>
      {/* Bold Orange Banner Navbar */}
      <AppBar 
        position="static" 
        sx={{ 
          background: 'linear-gradient(135deg, #ff8f00 0%, #ff9800 50%, #ffa726 100%)',
          boxShadow: '0 8px 32px rgba(255, 143, 0, 0.5)',
          borderBottom: '4px solid #e65100',
        }}
      >
        <Toolbar sx={{ py: 2.5, px: 4 }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="logo"
            sx={{ 
              mr: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '12px',
              p: 1.5,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.25)',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <LinkIcon size={32} />
          </IconButton>
          
          <Typography 
            variant="h4" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontWeight: 800,
              fontSize: '2rem',
              textShadow: '0 3px 10px rgba(0,0,0,0.3)',
              letterSpacing: '0.5px',
            }}
          >
            URL Shortener
          </Typography>
          
          {/* Right-aligned action buttons */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              color="inherit"
              component={RouterLink}
              to="/"
              variant={location.pathname === '/' ? 'contained' : 'outlined'}
              sx={{
                backgroundColor: location.pathname === '/' ? 'rgba(255,255,255,0.25)' : 'transparent',
                borderColor: location.pathname === '/' ? 'transparent' : 'rgba(255,255,255,0.6)',
                borderRadius: '12px',
                px: 4,
                py: 1.5,
                fontWeight: 700,
                fontSize: '1.1rem',
                textTransform: 'none',
                boxShadow: location.pathname === '/' ? '0 4px 16px rgba(0,0,0,0.2)' : 'none',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.25)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              Shorten URLs
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/statistics"
              variant={location.pathname === '/statistics' ? 'contained' : 'outlined'}
              sx={{
                backgroundColor: location.pathname === '/statistics' ? 'rgba(255,255,255,0.25)' : 'transparent',
                borderColor: location.pathname === '/statistics' ? 'transparent' : 'rgba(255,255,255,0.6)',
                borderRadius: '12px',
                px: 4,
                py: 1.5,
                fontWeight: 700,
                fontSize: '1.1rem',
                textTransform: 'none',
                boxShadow: location.pathname === '/statistics' ? '0 4px 16px rgba(0,0,0,0.2)' : 'none',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.25)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              startIcon={<BarChart3 size={22} />}
            >
              Statistics
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Main Content Container */}
      <Container maxWidth="lg" sx={{ flexGrow: 1, py: 5 }}>
        <Box sx={{
          background: 'rgba(255, 255, 255, 0.5)',
          borderRadius: '24px',
          p: 5,
          backdropFilter: 'blur(20px)',
          border: '2px solid rgba(255, 255, 255, 0.4)',
          boxShadow: '0 16px 48px rgba(255, 143, 0, 0.2)',
          minHeight: '75vh',
        }}>
          {children}
        </Box>
      </Container>
    </Box>
  );
};