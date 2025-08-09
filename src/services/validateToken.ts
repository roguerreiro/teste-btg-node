import { UserDatabase } from "../infrastructure/database/UserDatabase";
import { OTPManager } from "../infrastructure/otp/OTPManager";

export async function validateToken(
    username: string,
    token: string,
    userDatabase: UserDatabase,
    otpManager: OTPManager
) {
    const user = await userDatabase.getUserByUsername(username);
    if (!user) {
        return false;
    }

    return otpManager.verifyOTP(token, user.getSecret());

}