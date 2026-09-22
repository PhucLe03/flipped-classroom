import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/flipped_classroom';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.warn(`[MongoDB] Local MongoDB connection at ${mongoUri} failed: ${(error as Error).message}`);
    console.log('[MongoDB] Starting in-memory MongoDB instance for local development...');
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(`[MongoDB] Connected to in-memory MongoDB at: ${memoryUri}`);
    } catch (memErr) {
      console.error('[MongoDB] Failed to initialize in-memory MongoDB:', memErr);
    }
  }
};
