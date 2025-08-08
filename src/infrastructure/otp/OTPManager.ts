export interface OTPManager {
    generateSecret(): Promise<string>;
    generateTOTP(secret: string): Promise<string>;
    verifyTOTP(token: string, secret: string): Promise<boolean>;
}