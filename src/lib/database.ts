// lib/dbConnect.js
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
	throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Cache the connection outside the function scope.
 * This effectively makes it a module-level singleton.
 */
let cachedMongoose: typeof mongoose | null = null; // Store the Mongoose connection object
let cachedPromise: Promise<typeof mongoose> | null = null; // Store the promise of the connection

async function dbConnect() {
	if (cachedMongoose) {
		return cachedMongoose;
	}

	if (!cachedPromise) {
		const opts = {
			bufferCommands: false,
			// Consider adding these options for robustness if not already default in your Mongoose version
			// useNewUrlParser: true,
			// useUnifiedTopology: true,
			// serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
			// socketTimeoutMS: 45000,      // Close sockets after 45 seconds of inactivity
		};

		cachedPromise = mongoose
			.connect(MONGODB_URI, opts)
			.then((mongooseInstance) => {
				// Once connected, store the instance and nullify the promise
				cachedMongoose = mongooseInstance;
				cachedPromise = null; // Clear the promise to allow new connections if the old one fails later
				return mongooseInstance;
			})
			.catch((error) => {
				console.error('MongoDB connection error:', error);
				cachedPromise = null; // Clear the promise on error so a new attempt can be made
				throw error; // Re-throw the error so the caller knows the connection failed
			});
	}

	return await cachedPromise;
}

export default dbConnect;
