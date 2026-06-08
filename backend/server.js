import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import { createServer } from 'http';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { rateLimit } from './src/middleware/rateLimit.js';
import authRoutes from './src/routes/auth.js';
import pool, { initializeDatabase } from './src/config/database.js';
import logger from './src/config/logger.js';
import { initializeDatabaseSchema } from './src/models/schema.js';
import onboardingRoutes from './src/routes/onboarding.js';
import marketRoutes from './src/routes/market.js';
import iposRoutes from './src/routes/ipos.js';
import portfolioRoutes from './src/routes/portfolio.js';
import stocksRoutes from './src/routes/stocks.js';
import secondaryRoutes from './src/routes/secondary.js';
import mutualfundsRoutes from './src/routes/mutualfunds.js';
import v1MockRoutes from './src/routes/v1MockRoutes.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { startJobs } from './src/jobs/dataJobs.js';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'], credentials: true },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const swaggerPath = path.join(__dirname, 'swagger.yaml');
let swaggerDocument;
try {
  swaggerDocument = YAML.load(swaggerPath);
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (err) {
  logger.warn('Swagger load failed:', err.message);
}

app.use(cors());
app.use(express.json());
app.use(rateLimit(60000, 100)); // 100 req/min per IP

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.use('/api/auth', authRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/ipos', iposRoutes);
app.use('/api/stocks', stocksRoutes);
app.use('/api/secondary', secondaryRoutes);
app.use('/api/mutualfunds', mutualfundsRoutes);
app.use('/api/v1', v1MockRoutes);

io.on('connection', (socket) => {
  logger.info(`Socket connected: ${socket.id}`);
  socket.on('disconnect', () => {
    logger.info(`Socket disconnected: ${socket.id}`);
  });
});

app.use((err, req, res, next) => {
  logger.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

async function start() {
  const dbConnected = await initializeDatabase();
  if (!dbConnected) {
    logger.error('Database connection failed');
    process.exit(1);
  }

  await initializeDatabaseSchema(pool);

  try {
    startJobs(pool, io);
  } catch (err) {
    logger.warn('Data jobs failed:', err.message);
  }

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    logger.info(`BHARATNIVESH API on port ${PORT}`);
  });
}

start();

export { app, io };

