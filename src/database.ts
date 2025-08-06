import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/my-wallet';

if (!MONGODB_URI) {
	throw new Error('Please define the MONGODB_URI environment variable');
}

export async function connectToDatabase() {
	if (mongoose.connection.readyState === 1) {
		return mongoose;
	}
	await mongoose.connect(MONGODB_URI, {
		bufferCommands: false,
	});
	return mongoose;
}
