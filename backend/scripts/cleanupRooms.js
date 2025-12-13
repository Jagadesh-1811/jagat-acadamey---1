import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const cleanupStaleRooms = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // End all active rooms
        const result = await mongoose.connection.db.collection('voicerooms').updateMany(
            { status: 'active' },
            {
                $set: {
                    status: 'completed',
                    endTime: new Date()
                }
            }
        );

        console.log(`Cleaned up ${result.modifiedCount} stale rooms`);

        // Also clean up any pending call requests older than 1 hour
        const requestResult = await mongoose.connection.db.collection('callrequests').updateMany(
            {
                status: 'pending',
                createdAt: { $lt: new Date(Date.now() - 60 * 60 * 1000) }
            },
            {
                $set: { status: 'expired' }
            }
        );

        console.log(`Cleaned up ${requestResult.modifiedCount} expired call requests`);

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

cleanupStaleRooms();
