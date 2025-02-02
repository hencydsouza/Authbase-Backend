import mongoose, { Document, Schema } from "mongoose";
import { thirtyDaysFromNow } from "../../common/utils/date-time";

export interface SessionDocument extends Document {
    userId: mongoose.Types.ObjectId;
    userAgent?: string;
    expiresAt: Date;
    createdAt: Date;
}

const sessionSchema = new mongoose.Schema<SessionDocument>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true,
        ref: 'User'
    },
    userAgent: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        required: true,
        default: thirtyDaysFromNow
    }
}, {
    timestamps: true
})

const SessionModel = mongoose.model<SessionDocument>('Session', sessionSchema);

export default SessionModel;