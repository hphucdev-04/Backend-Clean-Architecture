import dotenv from 'dotenv';
import path from 'path';

const envPath = path.resolve(__dirname, '../../.env');

dotenv.config({ path: envPath });

export const env = {
	node: process.env.NODE_ENV || 'development',
	isProduction: process.env.NODE_ENV === 'production',
	isTest: process.env.NODE_ENV === 'test',
	isDevelopment: process.env.NODE_ENV === 'development',
	app: {
		port: Number(process.env.PORT) || 3000,
		apiPrefix: process.env.API_PREFIX || '/api/v1',
	},
	jwt: {
		secret: process.env.JWT_SECRET || 'your_jwt_secret_key',
		expiresIn: process.env.JWT_EXPIRES_IN || '15m',
		refreshSecret: process.env.JWT_REFRESH_SECRET || 'your_refresh_secret_key',
		refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
		issuer: process.env.JWT_ISSUER || 'your-app-name',
		audience: process.env.JWT_AUDIENCE || 'your-app-users',
		algorithm: process.env.JWT_ALGORITHM || 'HS256',
	},
	cookie: {
		secret: process.env.COOKIE_SECRET || 'your_cookie_secret',
		maxAge: Number(process.env.COOKIE_MAX_AGE) || 24 * 60 * 60 * 1000, // 24 hours in milliseconds
		domain: process.env.COOKIE_DOMAIN || undefined, // undefined for localhost
		secure: process.env.COOKIE_SECURE === 'true' || process.env.NODE_ENV === 'production',
		httpOnly: process.env.COOKIE_HTTP_ONLY !== 'false', // default true
		sameSite: (process.env.COOKIE_SAME_SITE as 'strict' | 'lax' | 'none') || 
			(process.env.NODE_ENV === 'production' ? 'strict' : 'lax'),
		path: process.env.COOKIE_PATH || '/',
		accessTokenName: process.env.ACCESS_TOKEN_COOKIE_NAME || 'accessToken',
		refreshTokenName: process.env.REFRESH_TOKEN_COOKIE_NAME || 'refreshToken',
		sessionName: process.env.SESSION_COOKIE_NAME || 'sessionId',
		preferenceName: process.env.PREFERENCE_COOKIE_NAME || 'userPreference',
	},
	mongodb: {
		url: process.env.MONGODB_URL || 'mongodb+srv://admin123:admin123456@cluster0.d94ke.mongodb.net',
		retryCount: Number(process.env.MONGODB_RETRY_COUNT) || 3,
    	retryDelay: Number(process.env.MONGODB_RETRY_DELAY) || 5000, 
	},
}
