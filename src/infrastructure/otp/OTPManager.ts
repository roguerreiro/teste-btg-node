export interface OTPManager {
    generateTOTP(secret: string): Promise<string>;
    verifyTOTP(token: string, secret: string): Promise<boolean>;
}