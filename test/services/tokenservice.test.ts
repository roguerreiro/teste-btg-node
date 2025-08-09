import { generateToken } from '../../src/services/generateToken';
import { validateToken } from '../../src/services/validateToken';
import { SqlUserDatabase } from '../../src/infrastructure/database/SqlUserDatabase';
import { TOTPManager } from '../../src/infrastructure/otp/TOTPManager';
import path from 'path';
import fs from 'fs';

const dbSchema = path.resolve(__dirname, '../../src/infrastructure/database/init.sql');
const dbLocation = path.resolve(__dirname, './test.db');

describe('Token Generation', () => {
    const schemaPath = './test/infrastructure/database/init.sql';

    let totpManager: TOTPManager;
    let userDatabase: SqlUserDatabase;

    beforeAll(() => {
        totpManager = new TOTPManager(5, 6);
        if (fs.existsSync(dbLocation)) fs.unlinkSync(dbLocation);
        userDatabase = new SqlUserDatabase(dbSchema);
        userDatabase.initialize(dbLocation);
    });

    test('should generate a TOTP token', async () => {
        const username = 'testuser';
        const token = await generateToken(username, userDatabase, totpManager);
        expect(token).toBeDefined();
    });

    test('should not create new secret if already exists', async () => {
        const username = 'testuser';
        const user = await userDatabase.getUserByUsername(username);
        const secret = user ? user.getSecret() : null;
        expect(secret).toBeDefined();

        const token = await generateToken(username, userDatabase, totpManager);
        expect(token).toBeDefined();

        const newUser = await userDatabase.getUserByUsername(username);
        const newSecret = newUser ? newUser.getSecret() : null;
        expect(newSecret).toBe(secret);
    });

    test('should validate token if and only if it is correct', async () => {
        const username = 'newtestuser';
        const token = await generateToken(username, userDatabase, totpManager);
        expect(token).toBeDefined();

        const isValid = await validateToken(username, token!, userDatabase, totpManager);
        expect(isValid).toBe(true);

        const isWrongValid = await validateToken(username, '123456', userDatabase, totpManager);
        expect(isWrongValid).toBe(false);
    });

    test('should not validate an incorrect token or username', async () => {
        const username = 'newtestuser2';
        const correctToken = await generateToken(username, userDatabase, totpManager);
        const fakeUsername = 'fakeuser';
        const fakeUsernameValid = await validateToken(fakeUsername, correctToken!, userDatabase, totpManager);
        expect(fakeUsernameValid).toBe(false);

        const fakeToken = 'abcdefg';
        const fakeTokenValid = await validateToken(username, fakeToken, userDatabase, totpManager);
        expect(fakeTokenValid).toBe(false);


    });

});
