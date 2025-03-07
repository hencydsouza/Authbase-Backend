import mongoose, { Document, Schema } from "mongoose";
import { VerificationEnum } from "../../common/enums/verification-code.enum";
import { generateUniqueCode } from "../../common/utils/uuid";


export interface VerificationCodeDocument extends Document {
    userId: mongoose.Types.ObjectId;
    code: string;
    type: VerificationEnum;
    expiresAt: Date;
    createdAt: Date;
}

const verificationCodeSchema = new mongoose.Schema<VerificationCodeDocument>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true,
        ref: 'User'
    },
    code: {
        type: String,
        unique: true,
        required: true,
        default: generateUniqueCode
    },
    type: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
})

const VerificationCodeModel = mongoose.model<VerificationCodeDocument>(
    'VerificationCode',
    verificationCodeSchema,
    "verification_codes"
);

export default VerificationCodeModel;