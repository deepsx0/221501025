import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert, Button } from '@mui/material';
import { urlShortenerService } from '../utils/urlShortener';
import { logger } from '../utils/logger';

export const RedirectHandler: React.FC = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  useEffect(() => {
    const handleRedirect = async () => {
      if (!shortCode) {
        setError('Invalid short code');
        setLoading(false);
        return;
      }

      try {
        const originalUrl = await urlShortenerService.handleRedirect(shortCode);
        setRedirectUrl(originalUrl);
        
        // Redirect after a short delay
        setTimeout(() => {
          window.location.href = originalUrl;
        }, 2000);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setError(errorMessage);
        logger.error('Redirect failed', { shortCode, error: errorMessage });
      } finally {
        setLoading(false);
      }
    };

    handleRedirect();
  }, [shortCode]);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fff8e1 0%, #ffecb3 25%, #ffe0b2 50%, #ffcc80 75%, #ffb74d 100%)',
        textAlign: 'center',
        px: 4,
      }}>
        <Box sx={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '24px',
          p: 8,
          backdropFilter: 'blur(20px)',
          border: '2px solid rgba(255, 255, 255, 0.4)',
          boxShadow: '0 16px 48px rgba(255, 143, 0, 0.25)',
          maxWidth: '600px',
        }}>
          <CircularProgress 
            size={100} 
            sx={{ 
              color: '#ff8f00',
              mb: 4,
            }} 
          />
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 800,
              background: 'linear-gradient(135deg, #ff8f00 0%, #ff9800 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '2.5rem',
              mb: 2,
            }}
          >
            Redirecting...
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.3rem', fontWeight: 500 }}>
            Please wait while we redirect you to your destination
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fff8e1 0%, #ffecb3 25%, #ffe0b2 50%, #ffcc80 75%, #ffb74d 100%)',
        textAlign: 'center',
        px: 4,
      }}>
        <Box sx={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '24px',
          p: 8,
          backdropFilter: 'blur(20px)',
          border: '2px solid rgba(255, 255, 255, 0.4)',
          boxShadow: '0 16px 48px rgba(255, 143, 0, 0.25)',
          maxWidth: '600px',
        }}>
          <Alert 
            severity="error" 
            sx={{ 
              mb: 4,
              borderRadius: '14px',
              fontSize: '1.2rem',
              fontWeight: 500,
              p: 3,
            }}
          >
            {error}
          </Alert>
          <Button
            variant="contained"
            onClick={() => window.location.href = '/'}
            sx={{
              borderRadius: '14px',
              px: 5,
              py: 2,
              fontSize: '1.2rem',
              fontWeight: 700,
            }}
          >
            Go to Home
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fff8e1 0%, #ffecb3 25%, #ffe0b2 50%, #ffcc80 75%, #ffb74d 100%)',
      textAlign: 'center',
      px: 4,
    }}>
      <Box sx={{
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '24px',
        p: 8,
        backdropFilter: 'blur(20px)',
        border: '2px solid rgba(255, 255, 255, 0.4)',
        boxShadow: '0 16px 48px rgba(255, 143, 0, 0.25)',
        maxWidth: '700px',
      }}>
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{
            fontWeight: 800,
            background: 'linear-gradient(135deg, #ff8f00 0%, #ff9800 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 3,
            fontSize: '2.5rem',
          }}
        >
          Redirecting to:
        </Typography>
        <Typography 
          variant="h6" 
          color="primary" 
          gutterBottom
          sx={{ 
            wordBreak: 'break-all',
            fontSize: '1.4rem',
            fontWeight: 600,
            mb: 4,
          }}
        >
          {redirectUrl}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.2rem', fontWeight: 500 }}>
          If you are not redirected automatically, click{' '}
          <a 
            href={redirectUrl!} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              color: '#ff8f00',
              textDecoration: 'none',
              fontWeight: 700,
            }}
          >
            here
          </a>
        </Typography>
      </Box>
    </Box>
  );
};