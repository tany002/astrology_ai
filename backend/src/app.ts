import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();

app.set('trust proxy', 1);

function normalizeOrigin(url: string): string {
  return url.trim().replace(/\/+$/, '');
}

const allowedOrigins: string[] = [];

if (process.env.FRONTEND_URL) {
  // Browser Origin never has a trailing slash.
  // FRONTEND_URL=https://astrology-ai-iota.vercel.app/ must match
  // Origin https://astrology-ai-iota.vercel.app
  allowedOrigins.push(normalizeOrigin(process.env.FRONTEND_URL));
} else {
  console.warn(
    '[CORS] WARNING: FRONTEND_URL is not set. ' +
    'Only localhost origins are allowed. All production browser requests will be rejected.'
  );
}

// Allow localhost only outside production (local dev and test environments)
if (process.env.NODE_ENV !== 'production') {
  allowedOrigins.push('http://localhost:3000', 'http://localhost:3001');
}

console.log(`[CORS] Allowed origins: ${allowedOrigins.join(', ') || '(none)'}`);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      const normalized = normalizeOrigin(origin);
      if (allowedOrigins.includes(normalized)) {
        callback(null, true);
        return;
      }

      console.warn(
        `[CORS] Rejected origin "${origin}". Allowed: ${allowedOrigins.join(', ') || '(none)'}`
      );
      // Do not throw — throwing skips CORS headers and surfaces as a browser CORS / network error.
      callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204,
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.use((req, _res, next) => {
  const start = Date.now();
  _res.on('finish', () => {
    console.log(`[${req.method}] ${req.path} ${_res.statusCode} ${Date.now() - start}ms`);
  });
  next();
});

// Liveness probes for Northflank / load balancers.
// Default probes hit `/` or `/health`, not `/api/health`. A 404 here marks the
// service unhealthy and the proxy returns 503 to the browser even though Express is up.
app.get('/', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
