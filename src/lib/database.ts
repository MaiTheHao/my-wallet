import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
	throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cachedMongoose: typeof mongoose | null = null;
let cachedPromise: Promise<typeof mongoose> | null = null;

async function dbConnect() {
	if (cachedMongoose) {
		return cachedMongoose;
	}

	if (!cachedPromise) {
		const opts = {
			bufferCommands: false,
		};

		cachedPromise = mongoose
			.connect(MONGODB_URI, opts)
			.then((mongooseInstance) => {
				cachedMongoose = mongooseInstance;
				cachedPromise = null;
				return mongooseInstance;
			})
			.catch((error) => {
				console.error('MongoDB connection error:', error);
				cachedPromise = null;
				throw error;
			});
	}

	return await cachedPromise;
}

export default dbConnect;
