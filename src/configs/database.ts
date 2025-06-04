import mongoose from "mongoose";
import { env } from '~/configs/env';
import { logger } from '~/utilities/logger.untility';

class MongoDatabase {
    private static instance: MongoDatabase;
    private retryCount = env.mongodb.retryCount;
    private retryDelay = env.mongodb.retryDelay;
    private isConnected = false;

    private constructor() { }

    public static getInstance(): MongoDatabase {
        if (!MongoDatabase.instance) {
            MongoDatabase.instance = new MongoDatabase();
        }
        return MongoDatabase.instance;
    }

    private async connectWithRetry(attempt: number = 1): Promise<void> {
        try {
            await mongoose.connect(`${env.mongodb.url}/backend`);
            
            this.isConnected = true;
            logger.info('MongoDB connected successfully');
            
            mongoose.connection.on('error', (error) => {
                logger.error(`MongoDB connection error: ${error}`);
                this.isConnected = false;
                this.reconnect();
            });
            
            mongoose.connection.on('disconnected', () => {
                logger.warn('MongoDB disconnected');
                this.isConnected = false;
                this.reconnect();
            });
            
        } catch (error) {
            if (attempt <= this.retryCount) {
                logger.warn(`MongoDB connection attempt ${attempt} failed. Retrying in ${this.retryDelay}ms...`);
                setTimeout(() => {
                    this.connectWithRetry(attempt + 1);
                }, this.retryDelay);
            } else {
                logger.error(`MongoDB connection failed after ${this.retryCount} attempts: ${error}`);
                throw error;
            }
        }
    }

    private reconnect(): void {
        if (!this.isConnected) {
            logger.info('Attempting to reconnect to MongoDB...');
            this.connectWithRetry();
        }
    }

    public async connect(): Promise<void> {
        if (!this.isConnected) {
            await this.connectWithRetry();
        }
    }

    public async disconnect(): Promise<void> {
        if (this.isConnected) {
            await mongoose.disconnect();
            this.isConnected = false;
            logger.info('MongoDB disconnected');
        }
    }

    public getConnectionStatus(): boolean {
        return this.isConnected;
    }
}

export const database = MongoDatabase.getInstance();