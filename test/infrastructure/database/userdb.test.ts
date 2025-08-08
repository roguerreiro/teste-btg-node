import { SqlUserDatabase } from '../../../src/infrastructure/database/SqlUserDatabase';
import fs from 'fs';
import path from 'path';

const dbSchema = path.resolve(__dirname, '../../../src/infrastructure/database/init.sql');
const dbLocation = path.resolve(__dirname, './usertest.db');

describe('SQL Database', () => {
    let db: SqlUserDatabase;

    beforeAll(() => {
        if (fs.existsSync(dbLocation)) fs.unlinkSync(dbLocation);
        db = new SqlUserDatabase(dbSchema);
        db.initialize(dbLocation);
    });

    test('should initialize the user database', () => {
        const result = db.initialize(dbLocation);
        expect(result).toBe(true);
    });

    test('should add two users to the database', async () => {
        const username = 'testuser';
        const result = await db.registerUser(username);
        expect(result).toBe(1);

        const username2 = 'testusertwo';
        const result2 = await db.registerUser(username2);
        expect(result2).toBe(2);
    });

    test('should return a User object from a given username, be null otherwise', async () => {
        const username = 'testuser';
        const user = await db.getUserByUsername(username);
        expect(user).toBeDefined();
        expect(user?.getUsername()).toBe(username);
        expect(user?.getId()).toBe(1);

        const nonExistentUser = await db.getUserByUsername('nonexistent');
        expect(nonExistentUser).toBeNull();
    });    


    afterAll(async () => {
        await db.close();
    });
});

