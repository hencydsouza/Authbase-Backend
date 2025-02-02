import jwt, { SignOptions } from 'jsonwebtoken';
import { ErrorCode } from "../../common/enums/error-code.enum";
import { VerificationEnum } from "../../common/enums/verification-code.enum";
import { LoginDto, RegisterDto } from "../../common/interface/auth.interface";
import { BadRequestException } from "../../common/utils/catch-errors";
import { fourtyFiveMinutesFromNow } from "../../common/utils/date-time";
import SessionModel from "../../database/models/session.model";
import UserModel from "../../database/models/user.model";
import VerificationCodeModel from "../../database/models/verification.model";
import { config } from '../../config/app.config';

export class AuthService {
    public async register(registerData: RegisterDto) {
        const { name, email, password } = registerData;

        const existingUser = await UserModel.exists({
            email
        })

        if (existingUser) {
            throw new BadRequestException(
                'User already exists with this email',
                ErrorCode.AUTH_EMAIL_ALREADY_EXISTS
            );
        }

        const newUser = await UserModel.create({
            name,
            email,
            password,
        })

        const userId = newUser._id;

        const verificationCode = await VerificationCodeModel.create({
            userId,
            type: VerificationEnum.EMAIL_VERIFICATION,
            expiresAt: fourtyFiveMinutesFromNow()
        })

        // sending email verification code to user

        return {
            user: newUser,
        }
    }

    public async login(loginData: LoginDto) {
        const { email, password, userAgent } = loginData;

        const user = await UserModel.findOne({
            email
        })

        if (!user) {
            throw new BadRequestException(
                'Invalid email or password provided',
                ErrorCode.AUTH_USER_NOT_FOUND
            )
        }

        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            throw new BadRequestException(
                'Invalid email or password provided',
                ErrorCode.AUTH_USER_NOT_FOUND
            )
        }

        // check if the user enabled 2FA return user as null

        const session = await SessionModel.create({
            userId: user._id,
            userAgent,
        })

        const accessToken = jwt.sign(
            { userId: user._id, sessionId: session._id },
            config.JWT.SECRET,
            {
                audience: ["user"],
                expiresIn: config.JWT.EXPIRES_IN
            } as SignOptions
        )

        const refreshToken = jwt.sign(
            { sessionId: session._id },
            config.JWT.REFRESH_SECRET,
            {
                audience: ["user"],
                expiresIn: config.JWT.REFRESH_EXPIRES_IN
            } as SignOptions
        )

        return {
            user,
            accessToken,
            refreshToken,
            mfaRequired: false
        }
    }
}