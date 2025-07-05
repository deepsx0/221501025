import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Divider,
} from '@mui/material';
import { BarChart, Schedule, Public, TrendingUp } from '@mui/icons-material';
import { ExternalLink } from 'lucide-react';
import { urlShortenerService } from '../utils/urlShortener';
import { ShortUrl } from '../types';
import { logger } from '../utils/logger';

export const StatisticsPage: React.FC = () => {
  const [urls, setUrls] = useState<ShortUrl[]>([]);
  const [selectedUrl, setSelectedUrl] = useState<ShortUrl | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    loadUrls();
  }, []);

  const loadUrls = () => {
    const allUrls = urlShortenerService.getAllUrls();
    setUrls(allUrls);
    logger.info('Statistics loaded', { count: allUrls.length });
  };

  const handleViewDetails = (url: ShortUrl) => {
    setSelectedUrl(url);
    setDialogOpen(true);
  };

  const handleRedirect = async (shortCode: string) => {
    try {
      const originalUrl = await urlShortenerService.handleRedirect(shortCode);
      window.open(originalUrl, '_blank');
      // Refresh the statistics to show the new click
      loadUrls();
    } catch (error) {
      logger.error('Redirect failed', error);
    }
  };

  const getStatusColor = (url: ShortUrl) => {
    if (url.isExpired || new Date() > url.expiresAt) {
      return 'error';
    }
    return 'success';
  };

  const getStatusText = (url: ShortUrl) => {
    if (url.isExpired || new Date() > url.expiresAt) {
      return 'Expired';
    }
    return 'Active';
  };

  const getTotalClicks = () => {
    return urls.reduce((total, url) => total + url.clicks.length, 0);
  };

  const getActiveUrls = () => {
    return urls.filter(url => !url.isExpired && new Date() <= url.expiresAt).length;
  };

  const getMostClickedUrl = () => {
    if (urls.length === 0) return null;
    return urls.reduce((max, url) => 
      url.clicks.length > max.clicks.length ? url : max
    );
  };

  if (urls.length === 0) {
    return (
      <Box>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h4" 
            gutterBottom
            sx={{
              background: 'linear-gradient(135deg, #ff8f00 0%, #ff9800 50%, #ffa726 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 800,
              fontSize: '3.5rem',
              mb: 3,
            }}
          >
            Statistics Dashboard
          </Typography>
        </Box>
        <Alert 
          severity="info"
          sx={{
            borderRadius: '14px',
            fontSize: '1.2rem',
            fontWeight: 500,
            p: 4,
          }}
        >
          No shortened URLs found. Create some URLs first to see statistics.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Section Header with larger font and color contrast */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{
            background: 'linear-gradient(135deg, #ff8f00 0%, #ff9800 50%, #ffa726 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 800,
            fontSize: '3.5rem',
            mb: 3,
            textShadow: '0 4px 12px rgba(255, 143, 0, 0.3)',
          }}
        >
          Statistics Dashboard
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ 
            fontSize: '1.3rem',
            maxWidth: '800px',
            mx: 'auto',
            lineHeight: 1.7,
            fontWeight: 500,
          }}
        >
          Overview of all your shortened URLs and their performance metrics.
        </Typography>
      </Box>

      {/* Summary Cards with bright backgrounds and equal spacing */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ 
            height: '100%',
            background: 'linear-gradient(135deg, #ff8f00 0%, #ff9800 100%)',
            color: 'white',
            borderRadius: '18px',
            boxShadow: '0 8px 32px rgba(255, 143, 0, 0.3)',
          }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <Box sx={{
                  p: 2.5,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                }}>
                  <BarChart sx={{ fontSize: '2.5rem' }} />
                </Box>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 800, fontSize: '3rem', mb: 1 }}>
                    {urls.length}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                    Total URLs
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ 
            height: '100%',
            background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
            color: 'white',
            borderRadius: '18px',
            boxShadow: '0 8px 32px rgba(76, 175, 80, 0.3)',
          }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <Box sx={{
                  p: 2.5,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                }}>
                  <TrendingUp sx={{ fontSize: '2.5rem' }} />
                </Box>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 800, fontSize: '3rem', mb: 1 }}>
                    {getTotalClicks()}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                    Total Clicks
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ 
            height: '100%',
            background: 'linear-gradient(135deg, #2196f3 0%, #42a5f5 100%)',
            color: 'white',
            borderRadius: '18px',
            boxShadow: '0 8px 32px rgba(33, 150, 243, 0.3)',
          }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <Box sx={{
                  p: 2.5,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                }}>
                  <Schedule sx={{ fontSize: '2.5rem' }} />
                </Box>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 800, fontSize: '3rem', mb: 1 }}>
                    {getActiveUrls()}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                    Active URLs
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ 
            height: '100%',
            background: 'linear-gradient(135deg, #e91e63 0%, #f06292 100%)',
            color: 'white',
            borderRadius: '18px',
            boxShadow: '0 8px 32px rgba(233, 30, 99, 0.3)',
          }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <Box sx={{
                  p: 2.5,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                }}>
                  <Public sx={{ fontSize: '2.5rem' }} />
                </Box>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 800, fontSize: '3rem', mb: 1 }}>
                    {getMostClickedUrl()?.clicks.length || 0}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                    Most Clicked
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* URL List with well-spaced cards */}
      <Paper sx={{ 
        p: 6, 
        position: 'relative', 
        overflow: 'hidden',
        borderRadius: '20px',
        boxShadow: '0 12px 40px rgba(255, 143, 0, 0.2)',
      }}>
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '8px',
          background: 'linear-gradient(90deg, #ff8f00 0%, #ff9800 50%, #ffa726 100%)',
        }} />
        
        <Typography 
          variant="h5" 
          gutterBottom
          sx={{
            fontWeight: 700,
            color: '#3e2723',
            mb: 4,
            fontSize: '2rem',
          }}
        >
          All Shortened URLs
        </Typography>
        
        <Divider sx={{ mb: 5, borderColor: 'rgba(255, 143, 0, 0.4)', borderWidth: '2px' }} />
        
        <Grid container spacing={4}>
          {urls.map((url) => (
            <Grid item xs={12} key={url.id}>
              <Card 
                variant="outlined"
                sx={{
                  borderRadius: '18px',
                  border: '2px solid rgba(255, 143, 0, 0.2)',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 12px 32px rgba(255, 143, 0, 0.25)',
                    borderColor: 'rgba(255, 143, 0, 0.4)',
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography 
                        variant="h6" 
                        gutterBottom
                        sx={{
                          fontWeight: 700,
                          color: '#ff8f00',
                          fontSize: '1.4rem',
                          wordBreak: 'break-all',
                          mb: 2,
                        }}
                      >
                        {url.shortUrl}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        gutterBottom
                        sx={{ 
                          fontSize: '1.1rem',
                          wordBreak: 'break-all',
                          mb: 3,
                          fontWeight: 500,
                        }}
                      >
                        {url.originalUrl}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                        <Chip
                          label={getStatusText(url)}
                          color={getStatusColor(url)}
                          size="medium"
                          sx={{ 
                            fontWeight: 600,
                            borderRadius: '10px',
                            fontSize: '0.9rem',
                          }}
                        />
                        <Chip
                          label={`${url.clicks.length} clicks`}
                          size="medium"
                          variant="outlined"
                          sx={{ 
                            fontWeight: 600,
                            borderRadius: '10px',
                            fontSize: '0.9rem',
                            borderColor: '#ff8f00',
                            color: '#ff8f00',
                          }}
                        />
                        {url.isCustom && (
                          <Chip
                            label="Custom"
                            size="medium"
                            color="primary"
                            sx={{ 
                              fontWeight: 600,
                              borderRadius: '10px',
                              fontSize: '0.9rem',
                            }}
                          />
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '1rem' }}>
                        <strong>Created:</strong> {url.createdAt.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem' }}>
                        <strong>Expires:</strong> {url.expiresAt.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, ml: 3, flexDirection: 'column' }}>
                      <Button
                        size="medium"
                        variant="outlined"
                        onClick={() => handleViewDetails(url)}
                        sx={{
                          borderRadius: '12px',
                          textTransform: 'none',
                          fontWeight: 600,
                          px: 3,
                          py: 1.5,
                          minWidth: '140px',
                        }}
                      >
                        View Details
                      </Button>
                      <Button
                        size="medium"
                        variant="contained"
                        onClick={() => handleRedirect(url.shortCode)}
                        startIcon={<ExternalLink size={18} />}
                        disabled={url.isExpired || new Date() > url.expiresAt}
                        sx={{
                          borderRadius: '12px',
                          textTransform: 'none',
                          fontWeight: 600,
                          px: 3,
                          py: 1.5,
                          minWidth: '140px',
                        }}
                      >
                        Visit
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Details Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #fffde7 0%, #fff8e1 100%)',
          }
        }}
      >
        <DialogTitle sx={{ 
          fontWeight: 700, 
          fontSize: '1.8rem',
          color: '#ff8f00',
          borderBottom: '3px solid rgba(255, 143, 0, 0.3)',
          p: 4,
        }}>
          URL Details: {selectedUrl?.shortCode}
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          {selectedUrl && (
            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#ff8f00', fontSize: '1.4rem', mb: 3 }}>
                Basic Information
              </Typography>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                    Original URL
                  </Typography>
                  <Typography variant="body1" sx={{ wordBreak: 'break-all', fontSize: '1.2rem', mt: 1 }}>
                    {selectedUrl.originalUrl}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                    Short URL
                  </Typography>
                  <Typography variant="body1" sx={{ wordBreak: 'break-all', fontSize: '1.2rem', mt: 1 }}>
                    {selectedUrl.shortUrl}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                    Total Clicks
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: '1.2rem', fontWeight: 600, color: '#ff8f00', mt: 1 }}>
                    {selectedUrl.clicks.length}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                    Created
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: '1.2rem', mt: 1 }}>
                    {selectedUrl.createdAt.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                    Expires
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: '1.2rem', mt: 1 }}>
                    {selectedUrl.expiresAt.toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 4, borderColor: 'rgba(255, 143, 0, 0.4)', borderWidth: '2px' }} />

              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#ff8f00', fontSize: '1.4rem', mb: 3 }}>
                Click History
              </Typography>
              {selectedUrl.clicks.length > 0 ? (
                <TableContainer 
                  component={Paper} 
                  variant="outlined"
                  sx={{
                    borderRadius: '14px',
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: '2px solid rgba(255, 143, 0, 0.2)',
                  }}
                >
                  <Table size="medium">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: 'rgba(255, 143, 0, 0.1)' }}>
                        <TableCell sx={{ fontWeight: 700, fontSize: '1rem' }}>Timestamp</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: '1rem' }}>Source</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: '1rem' }}>Location</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: '1rem' }}>Referrer</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedUrl.clicks.map((click) => (
                        <TableRow key={click.id} sx={{ '&:hover': { backgroundColor: 'rgba(255, 143, 0, 0.05)' } }}>
                          <TableCell sx={{ fontSize: '0.95rem' }}>{click.timestamp.toLocaleString()}</TableCell>
                          <TableCell sx={{ fontSize: '0.95rem' }}>{click.source}</TableCell>
                          <TableCell sx={{ fontSize: '0.95rem' }}>{click.location}</TableCell>
                          <TableCell sx={{ fontSize: '0.95rem' }}>{click.referrer}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Alert 
                  severity="info"
                  sx={{
                    borderRadius: '14px',
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    fontSize: '1.1rem',
                    p: 3,
                  }}
                >
                  No clicks recorded yet.
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 4, borderTop: '3px solid rgba(255, 143, 0, 0.3)' }}>
          <Button 
            onClick={() => setDialogOpen(false)}
            variant="contained"
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};