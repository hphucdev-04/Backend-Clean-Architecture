import 'reflect-metadata';
import { App } from './app';
import { database } from '~/configs/database';
import { logger } from '~/utilities/logger.untility';

const startServer = async () => {
    try {
        // Connect to MongoDB database
        await database.connect();
        logger.info('Database connection established');

        const app = new App();
        app.listen();
        
        const shutdownGracefully = async () => {
            logger.info('Received shutdown signal, closing server and database connections...');
            await database.disconnect();
            process.exit(0);
        };

        process.on('SIGTERM', shutdownGracefully);
        process.on('SIGINT', shutdownGracefully);
        
    } catch (error) {
        logger.error(`Unable to start server: ${error}`);
        process.exit(1);
    }
};

startServer();