export interface ShortUrl {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  createdAt: Date;
  expiresAt: Date;
  isCustom: boolean;
  clicks: ClickData[];
  isExpired: boolean;
}

export interface ClickData {
  id: string;
  timestamp: Date;
  source: string;
  location: string;
  userAgent: string;
  referrer: string;
}

export interface CreateUrlRequest {
  originalUrl: string;
  customShortCode?: string;
  validityMinutes?: number;
}

export interface LogEntry {
  timestamp: Date;
  level: 'info' | 'warn' | 'error';
  message: string;
  data?: any;
}