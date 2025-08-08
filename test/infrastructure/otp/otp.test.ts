import { TOTPManager } from '../../../src/infrastructure/otp/TOTPManager';

describe('TOTP Manager', () => {
    let totpManager: TOTPManager;

    beforeAll(() => {
        totpManager = new TOTPManager(5, 6);
    });

    test('should generate a TOTP token', async () => {
        const secret = 'testsecret';
        const token = await totpManager.generateTOTP(secret);
        expect(token).toBeDefined();
    });

    test('should verify a valid TOTP token', async () => {
        const secret = 'testsecret';
        const token = await totpManager.generateTOTP(secret);
        const isValid = await totpManager.verifyTOTP(token, secret);
        expect(isValid).toBe(true);
    });

    test('should not verify an invalid TOTP token', async () => {
        const secret = 'testsecret';
        const isValid = await totpManager.verifyTOTP('invalidtoken', secret);
        expect(isValid).toBe(false);
    });

    test('should not verify an expired TOTP token', async () => {
        const secret = 'testsecret';
        const token = await totpManager.generateTOTP(secret);
        await new Promise(resolve => setTimeout(resolve, 6000));
        const isValid = await totpManager.verifyTOTP(token, secret);
        expect(isValid).toBe(false);
    }, 8000);

    test('should generate a secret', async () => {
        const secret = await totpManager.generateSecret();
        expect(secret).toBeDefined();
    });

    test('should verify a valid TOTP token with newly generated secret', async () => {
        const secret = await totpManager.generateSecret();
        const token = await totpManager.generateTOTP(secret);
        const isValid = await totpManager.verifyTOTP(token, secret);
        expect(isValid).toBe(true);
    });

});
