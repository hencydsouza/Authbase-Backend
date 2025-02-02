import mongoose from 'mongoose';
import { config } from '../config/app.config';

const connectDatabase = async () => {
    try {
        await mongoose.connect(config.MONGODB_URI);
        console.log('Database connected successfully');
    } catch (error) {
        console.log('Database connection failed');
        process.exit(1);
    }
}

export default connectDatabase;