import { OTPManager } from './OTPManager';
import { authenticator } from 'otplib'; 

export class TOTPManager implements OTPManager {

    constructor(expirationTime: number = 30, digits: number = 6) {
        authenticator.options = {
            step: expirationTime,
            digits: digits,
        }
    }

    async generateTOTP(secret: string): Promise<string> {
        return authenticator.generate(secret);
    }

    async verifyTOTP(token: string, secret: string): Promise<boolean> {
        return authenticator.check(token, secret);
    }

}