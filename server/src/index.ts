import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB, getDbInfo } from './config/db';
import { ensureSuperAdmin, seedData, shouldAutoSeed } from './seeder';
import { errorHandler } from './middlewares/errorHandler';

import authRoutes from './routes/authRoutes';
import categoryRoutes from './routes/categoryRoutes';
import materialRoutes from './routes/materialRoutes';
import adminRoutes from './routes/adminRoutes';
import commentRoutes from './routes/commentRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// Middlewares
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (
        origin === CLIENT_URL ||
        origin.endsWith('.github.io') ||
        origin.endsWith('.vercel.app') ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1')
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Serverless DB Connection Middleware
app.use(async (req, res, next) => {
  if (req.path === '/api/health') return next();
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('[Server] DB middleware connection error:', err);
    res.status(503).json({ message: 'Database tạm thời không khả dụng. Vui lòng thử lại sau.' });
  }
});

// Routes
app.get('/api/health', (req, res) => {
  const db = getDbInfo();
  res.json({
    status: 'ok',
    service: 'Flipped Classroom API',
    uptime: Math.floor(process.uptime()),
    database: db.connected ? 'connected' : 'disconnected',
    databaseInfo: {
      mode: db.mode, // remote | local | memory | disconnected
      host: db.host,
      name: db.name,
      persistent: db.persistent,
    },
    ...(db.mode === 'memory' && {
      warning: 'Đang dùng in-memory MongoDB — dữ liệu sẽ mất khi server restart!',
    }),
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/comments', commentRoutes);

// Error Handling
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    await ensureSuperAdmin();

    if (shouldAutoSeed()) {
      await seedData(false);
    } else {
      console.log('[Server] Auto-seed disabled (production/remote DB). Set AUTO_SEED=true to force.');
    }

    app.listen(PORT, () => {
      console.log(`[Server] Flipped Classroom Backend running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('[Server] Startup error:', err);
    // Thoát với mã lỗi để Render/PM2 đánh dấu deploy thất bại thay vì chạy âm thầm không có DB
    process.exit(1);
  }
};

// Only listen when running standalone (not inside Vercel serverless functions)
if (!process.env.VERCEL) {
  startServer();
}

export default app;
