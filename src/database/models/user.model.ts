import { Document, model, Schema } from "mongoose";
import { compareValue, hashValue } from "../../common/utils/bcrypt";

interface UserPreferences {
    enable2FA: boolean;
    emailNotification: boolean;
    twoFactorSecret?: string;
}

export interface UserDocument extends Document {
    name: string;
    email: string;
    password: string;
    isEmailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    userPreferences: UserPreferences;
    comparePassword(value: string): Promise<boolean>;
}

const userPreferencesSchema = new Schema<UserPreferences>({
    enable2FA: { type: Boolean, default: false },
    emailNotification: { type: Boolean, default: false },
    twoFactorSecret: { type: String, required: false },
})

const userSchema = new Schema<UserDocument>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    userPreferences: {
        type: userPreferencesSchema,
        default: {}
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true,
    toJSON: {}
});

userSchema.pre<UserDocument>('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await hashValue(this.password);
    }
    next();
});

userSchema.methods.comparePassword = async function (value: string): Promise<boolean> {
    return await compareValue(value, this.password);
}

userSchema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret.password;
        delete ret.userPreferences.twoFactorSecret;
        return ret;
    }
})

const UserModel = model<UserDocument>('User', userSchema);
export default UserModel;