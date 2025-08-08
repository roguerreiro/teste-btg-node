export interface OTPManager {
    generateSecret(): Promise<string>;
    generateOTP(secret: string): Promise<string>;
    verifyOTP(token: string, secret: string): Promise<boolean>;
}