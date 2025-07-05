import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Alert,
  CircularProgress,
  Chip,
  Divider,
} from '@mui/material';
import { Add, Clear, Link as LinkIcon } from '@mui/icons-material';
import { urlShortenerService } from '../utils/urlShortener';
import { CreateUrlRequest, ShortUrl } from '../types';
import { logger } from '../utils/logger';

interface UrlFormData {
  originalUrl: string;
  customShortCode: string;
  validityMinutes: string;
}

export const UrlShortenerForm: React.FC = () => {
  const [forms, setForms] = useState<UrlFormData[]>([
    { originalUrl: '', customShortCode: '', validityMinutes: '' },
  ]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ShortUrl[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const addForm = () => {
    if (forms.length < 5) {
      setForms([...forms, { originalUrl: '', customShortCode: '', validityMinutes: '' }]);
    }
  };

  const removeForm = (index: number) => {
    if (forms.length > 1) {
      const newForms = forms.filter((_, i) => i !== index);
      setForms(newForms);
    }
  };

  const updateForm = (index: number, field: keyof UrlFormData, value: string) => {
    const newForms = [...forms];
    newForms[index][field] = value;
    setForms(newForms);
  };

  const validateForm = (form: UrlFormData): string | null => {
    if (!form.originalUrl.trim()) {
      return 'URL is required';
    }

    try {
      new URL(form.originalUrl);
    } catch {
      return 'Invalid URL format';
    }

    if (form.validityMinutes && (isNaN(Number(form.validityMinutes)) || Number(form.validityMinutes) <= 0)) {
      return 'Validity must be a positive number';
    }

    if (form.customShortCode && !/^[a-zA-Z0-9_-]{1,20}$/.test(form.customShortCode)) {
      return 'Invalid shortcode format (alphanumeric, underscore, dash, max 20 chars)';
    }

    return null;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrors([]);
    setResults([]);

    const validForms = forms.filter(form => form.originalUrl.trim());
    if (validForms.length === 0) {
      setErrors(['At least one URL is required']);
      setLoading(false);
      return;
    }

    const newErrors: string[] = [];
    const newResults: ShortUrl[] = [];

    for (let i = 0; i < validForms.length; i++) {
      const form = validForms[i];
      const validationError = validateForm(form);
      
      if (validationError) {
        newErrors.push(`Form ${i + 1}: ${validationError}`);
        continue;
      }

      try {
        const request: CreateUrlRequest = {
          originalUrl: form.originalUrl,
          customShortCode: form.customShortCode || undefined,
          validityMinutes: form.validityMinutes ? Number(form.validityMinutes) : undefined,
        };

        const result = await urlShortenerService.createShortUrl(request);
        newResults.push(result);
      } catch (error) {
        newErrors.push(`Form ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    setErrors(newErrors);
    setResults(newResults);
    setLoading(false);

    if (newResults.length > 0) {
      logger.info('URLs shortened successfully', { count: newResults.length });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

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
          URL Shortener
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
          Create up to 5 shortened URLs at once. Set custom validity periods or use the default 30 minutes.
        </Typography>
      </Box>

      {/* Form Section Card with softly-rounded design and drop shadows */}
      <Paper sx={{ 
        p: 6, 
        mb: 5, 
        position: 'relative', 
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #ffffff 0%, #fffde7 100%)',
        boxShadow: '0 12px 40px rgba(255, 143, 0, 0.2)',
        borderRadius: '20px',
      }}>
        {/* Top gradient bar */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '8px',
          background: 'linear-gradient(90deg, #ff8f00 0%, #ff9800 50%, #ffa726 100%)',
        }} />
        
        {/* Well-spaced form cards */}
        {forms.map((form, index) => (
          <Box 
            key={index} 
            sx={{ 
              mb: 5, 
              p: 5, 
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,249,196,0.6) 100%)',
              borderRadius: '18px',
              border: '2px solid rgba(255, 143, 0, 0.25)',
              position: 'relative',
              '&:hover': {
                borderColor: 'rgba(255, 143, 0, 0.5)',
                transform: 'translateY(-3px)',
                boxShadow: '0 12px 32px rgba(255, 143, 0, 0.25)',
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{
                  p: 2,
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #ff8f00 0%, #ff9800 100%)',
                  color: 'white',
                  boxShadow: '0 4px 16px rgba(255, 143, 0, 0.4)',
                }}>
                  <LinkIcon sx={{ fontSize: '1.8rem' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.5rem', color: '#3e2723' }}>
                  URL {index + 1}
                </Typography>
              </Box>
              {forms.length > 1 && (
                <Button
                  size="medium"
                  color="error"
                  onClick={() => removeForm(index)}
                  startIcon={<Clear />}
                  sx={{
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 3,
                    py: 1,
                  }}
                >
                  Remove
                </Button>
              )}
            </Box>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Original URL"
                  value={form.originalUrl}
                  onChange={(e) => updateForm(index, 'originalUrl', e.target.value)}
                  placeholder="https://example.com"
                  required
                  sx={{
                    '& .MuiInputLabel-root': {
                      fontWeight: 600,
                      fontSize: '1.1rem',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Custom Short Code (optional)"
                  value={form.customShortCode}
                  onChange={(e) => updateForm(index, 'customShortCode', e.target.value)}
                  placeholder="my-link"
                  helperText="Alphanumeric, underscore, dash (max 20 chars)"
                  sx={{
                    '& .MuiInputLabel-root': {
                      fontWeight: 600,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Validity (minutes)"
                  type="number"
                  value={form.validityMinutes}
                  onChange={(e) => updateForm(index, 'validityMinutes', e.target.value)}
                  placeholder="30"
                  helperText="Default: 30 minutes"
                  sx={{
                    '& .MuiInputLabel-root': {
                      fontWeight: 600,
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        ))}

        <Divider sx={{ my: 5, borderColor: 'rgba(255, 143, 0, 0.4)', borderWidth: '2px' }} />

        {/* Action Buttons with equal spacing and alignment */}
        <Box sx={{ 
          display: 'flex', 
          gap: 4, 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          '@media (max-width: 600px)': {
            flexDirection: 'column',
            gap: 3,
          }
        }}>
          {forms.length < 5 && (
            <Button
              variant="outlined"
              onClick={addForm}
              startIcon={<Add />}
              sx={{
                borderRadius: '14px',
                px: 5,
                py: 2.5,
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '1.1rem',
                minWidth: '200px',
              }}
            >
              Add Another URL
            </Button>
          )}
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              borderRadius: '14px',
              px: 6,
              py: 2.5,
              fontSize: '1.3rem',
              fontWeight: 700,
              minWidth: '220px',
            }}
          >
            {loading ? <CircularProgress size={32} color="inherit" /> : 'Shorten URLs'}
          </Button>
        </Box>
      </Paper>

      {/* Error Messages */}
      {errors.length > 0 && (
        <Box sx={{ mb: 5 }}>
          {errors.map((error, index) => (
            <Alert 
              key={index} 
              severity="error" 
              sx={{ 
                mb: 2,
                borderRadius: '14px',
                fontSize: '1.1rem',
                fontWeight: 500,
                p: 3,
              }}
            >
              {error}
            </Alert>
          ))}
        </Box>
      )}

      {/* Results Section with bright background highlight */}
      {results.length > 0 && (
        <Paper sx={{ 
          p: 6, 
          position: 'relative', 
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%)',
          boxShadow: '0 12px 40px rgba(76, 175, 80, 0.2)',
          borderRadius: '20px',
        }}>
          {/* Top gradient bar */}
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '8px',
            background: 'linear-gradient(90deg, #4caf50 0%, #66bb6a 100%)',
          }} />
          
          <Typography 
            variant="h5" 
            gutterBottom
            sx={{
              fontWeight: 700,
              color: '#2e7d32',
              mb: 5,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              fontSize: '2rem',
            }}
          >
            <Box sx={{
              p: 2,
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
              color: 'white',
              boxShadow: '0 4px 16px rgba(76, 175, 80, 0.4)',
            }}>
              <LinkIcon sx={{ fontSize: '1.8rem' }} />
            </Box>
            Shortened URLs
          </Typography>
          
          {results.map((result, index) => (
            <Box 
              key={result.id} 
              sx={{ 
                mb: 4, 
                p: 5, 
                background: 'linear-gradient(135deg, rgba(76,175,80,0.15) 0%, rgba(139,195,74,0.15) 100%)',
                borderRadius: '18px',
                border: '2px solid rgba(76, 175, 80, 0.3)',
                '&:hover': {
                  borderColor: 'rgba(76, 175, 80, 0.5)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 12px 32px rgba(76, 175, 80, 0.25)',
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontSize: '1.1rem', mb: 3, fontWeight: 500 }}>
                <strong>Original:</strong> {result.originalUrl}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, mb: 4, flexWrap: 'wrap' }}>
                <Typography 
                  variant="h6" 
                  color="primary"
                  sx={{
                    fontWeight: 600,
                    fontSize: '1.4rem',
                    wordBreak: 'break-all',
                    flex: 1,
                    minWidth: '300px',
                  }}
                >
                  {result.shortUrl}
                </Typography>
                <Button
                  size="large"
                  variant="contained"
                  onClick={() => copyToClipboard(result.shortUrl)}
                  sx={{
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 700,
                    minWidth: '120px',
                    px: 4,
                    py: 1.5,
                  }}
                >
                  Copy
                </Button>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip
                  label={`Expires: ${result.expiresAt.toLocaleString()}`}
                  size="medium"
                  variant="outlined"
                  sx={{ 
                    borderRadius: '10px',
                    fontWeight: 600,
                    borderColor: '#4caf50',
                    color: '#2e7d32',
                    fontSize: '0.9rem',
                    px: 1,
                  }}
                />
                {result.isCustom && (
                  <Chip
                    label="Custom"
                    size="medium"
                    color="primary"
                    sx={{ 
                      borderRadius: '10px', 
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      px: 1,
                    }}
                  />
                )}
              </Box>
            </Box>
          ))}
        </Paper>
      )}
    </Box>
  );
};