import { UserDatabase } from "../infrastructure/database/UserDatabase";
import { OTPManager } from "../infrastructure/otp/OTPManager";

export async function generateToken(
    username: string,
    userDatabase: UserDatabase,
    otpManager: OTPManager
) {
    let user = await userDatabase.getUserByUsername(username);
    if (!user) {
        const otpSecret = await otpManager.generateSecret();
        await userDatabase.registerUser(username, otpSecret);
        user = await userDatabase.getUserByUsername(username);
    }

    if (!user) {
        throw new Error("User could not be found or created.");
    }

    return otpManager.generateOTP(user.getSecret());

}