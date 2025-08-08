import { SqlDatabase } from '../src/database/SqlDatabase';
import fs from 'fs';
import path from 'path';

const dbSchema = path.resolve(__dirname, '../src/database/init.sql');
const dbLocation = path.resolve(__dirname, './test.db');

describe('SQL Database', () => {
    let db: SqlDatabase;

    beforeAll(() => {
        if (fs.existsSync(dbLocation)) fs.unlinkSync(dbLocation);
        db = new SqlDatabase(dbSchema);
        db.initialize(dbLocation);
    });

    test('should initialize the database', () => {
        const result = db.initialize(dbLocation);
        expect(result).toBe(true);
    });

    test('should add data to a table', async () => {
        const data = { username: 'testuser', otp_secret: '2' };
        const result = await db.addToTable('users', data);
        expect(result).toBe(true);
    });

    test('should read data from a table', async () => {
        const criteria = { username: 'testuser' };
        const result = await db.readFromTable('users', criteria);
        expect(result).toBeDefined();
        expect(result.length).toBeGreaterThan(0);
        expect(result[0].username).toBe('testuser');
        expect(result[0].otp_secret).toBe('2');
    });    


    afterAll(async () => {
        await db.close();
    });
});

