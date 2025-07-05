import { ShortUrl, CreateUrlRequest, ClickData } from '../types';
import { logger } from './logger';

class UrlShortenerService {
  private storageKey = 'url-shortener-data';
  private urls: Map<string, ShortUrl> = new Map();

  constructor() {
    this.loadFromStorage();
    logger.info('URL Shortener Service initialized');
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        this.urls = new Map(
          data.map((url: any) => [
            url.shortCode,
            {
              ...url,
              createdAt: new Date(url.createdAt),
              expiresAt: new Date(url.expiresAt),
              clicks: url.clicks.map((click: any) => ({
                ...click,
                timestamp: new Date(click.timestamp),
              })),
            },
          ])
        );
        logger.info('Loaded URLs from storage', { count: this.urls.size });
      }
    } catch (error) {
      logger.error('Failed to load URLs from storage', error);
    }
  }

  private saveToStorage() {
    try {
      const data = Array.from(this.urls.values());
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      logger.info('Saved URLs to storage', { count: data.length });
    } catch (error) {
      logger.error('Failed to save URLs to storage', error);
    }
  }

  private generateShortCode(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private isValidShortCode(shortCode: string): boolean {
    const regex = /^[a-zA-Z0-9_-]{1,20}$/;
    return regex.test(shortCode);
  }

  private getGeolocation(): Promise<string> {
    return new Promise((resolve) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve(`${position.coords.latitude.toFixed(2)}, ${position.coords.longitude.toFixed(2)}`);
          },
          () => {
            resolve('Unknown');
          }
        );
      } else {
        resolve('Unknown');
      }
    });
  }

  async createShortUrl(request: CreateUrlRequest): Promise<ShortUrl> {
    logger.info('Creating short URL', request);

    // Validation
    if (!this.isValidUrl(request.originalUrl)) {
      const error = 'Invalid URL format';
      logger.error(error, { url: request.originalUrl });
      throw new Error(error);
    }

    const validityMinutes = request.validityMinutes || 30;
    if (validityMinutes <= 0) {
      const error = 'Validity must be greater than 0';
      logger.error(error, { validity: validityMinutes });
      throw new Error(error);
    }

    // Handle shortcode
    let shortCode = request.customShortCode;
    if (shortCode) {
      if (!this.isValidShortCode(shortCode)) {
        const error = 'Invalid shortcode format';
        logger.error(error, { shortCode });
        throw new Error(error);
      }
      if (this.urls.has(shortCode)) {
        const error = 'Shortcode already exists';
        logger.error(error, { shortCode });
        throw new Error(error);
      }
    } else {
      // Generate unique shortcode
      do {
        shortCode = this.generateShortCode();
      } while (this.urls.has(shortCode));
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + validityMinutes * 60 * 1000);

    const shortUrl: ShortUrl = {
      id: crypto.randomUUID(),
      originalUrl: request.originalUrl,
      shortCode,
      shortUrl: `http://localhost:3000/${shortCode}`,
      createdAt: now,
      expiresAt,
      isCustom: Boolean(request.customShortCode),
      clicks: [],
      isExpired: false,
    };

    this.urls.set(shortCode, shortUrl);
    this.saveToStorage();

    logger.info('Short URL created successfully', { shortCode, originalUrl: request.originalUrl });
    return shortUrl;
  }

  async handleRedirect(shortCode: string): Promise<string> {
    logger.info('Handling redirect', { shortCode });

    const shortUrl = this.urls.get(shortCode);
    if (!shortUrl) {
      const error = 'Short URL not found';
      logger.error(error, { shortCode });
      throw new Error(error);
    }

    if (new Date() > shortUrl.expiresAt) {
      shortUrl.isExpired = true;
      this.saveToStorage();
      const error = 'Short URL has expired';
      logger.error(error, { shortCode });
      throw new Error(error);
    }

    // Record click
    const location = await this.getGeolocation();
    const clickData: ClickData = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      source: document.referrer || 'Direct',
      location,
      userAgent: navigator.userAgent,
      referrer: document.referrer || 'Direct',
    };

    shortUrl.clicks.push(clickData);
    this.saveToStorage();

    logger.info('Click recorded', { shortCode, clickData });
    return shortUrl.originalUrl;
  }

  getAllUrls(): ShortUrl[] {
    const urls = Array.from(this.urls.values());
    // Update expired status
    urls.forEach(url => {
      if (new Date() > url.expiresAt) {
        url.isExpired = true;
      }
    });
    return urls.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  getUrlByShortCode(shortCode: string): ShortUrl | undefined {
    return this.urls.get(shortCode);
  }

  deleteUrl(shortCode: string): boolean {
    const deleted = this.urls.delete(shortCode);
    if (deleted) {
      this.saveToStorage();
      logger.info('URL deleted', { shortCode });
    }
    return deleted;
  }
}

export const urlShortenerService = new UrlShortenerService();