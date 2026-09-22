import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { seedData } from './seeder';
import { errorHandler } from './middlewares/errorHandler';

import authRoutes from './routes/authRoutes';
import categoryRoutes from './routes/categoryRoutes';
import materialRoutes from './routes/materialRoutes';
import adminRoutes from './routes/adminRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// Middlewares
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
  cors({
    origin: [CLIENT_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Flipped Classroom API', time: new Date() });
});

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling
app.use(errorHandler);

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    // Auto-seed default accounts, categories & study materials if database is empty
    await seedData(false);

    app.listen(PORT, () => {
      console.log(`[Server] Flipped Classroom Backend running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('[Server] Startup error:', err);
  }
};

startServer();

export default app;
