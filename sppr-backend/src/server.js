import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import pool from './config/db.js';
import projectRoutes from './routes/project.routes.js';
import alternativeRoutes from './routes/alternative.routes.js';
import criterionRoutes from './routes/criterion.routes.js';
import evaluationRoutes from './routes/evaluation.routes.js';
import analysisRoutes from './routes/analysis.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running!' });
});

app.use('/api/projects', projectRoutes);
app.use('/api/alternatives', alternativeRoutes);
app.use('/api/criteria', criterionRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/analysis', analysisRoutes);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  res.status(status).json({ error: message });
});

const server = app.listen(config.port, () => {
  console.log(`Server started at http://localhost:${config.port}`);
});

const gracefulShutdown = async () => {
  console.log('Initiating graceful shutdown...');
  server.close(async () => {
    console.log('HTTP server closed.');
    try {
      await pool.end();
      console.log('Database pool closed.');
      process.exit(0);
    } catch (err) {
      console.error('Error closing database pool:', err);
      process.exit(1);
    }
  });
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
