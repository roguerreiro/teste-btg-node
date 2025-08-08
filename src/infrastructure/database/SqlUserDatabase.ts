import { UserDatabase } from './UserDatabase';
import { SqlDatabase } from './SqlDatabase';
import { User } from '../../models/User';

export class SqlUserDatabase extends SqlDatabase implements UserDatabase {
    async registerUser(username: string, otp_secret: string): Promise<number> {
        super.addToTable('users', {
            username: username,
            otp_secret: otp_secret
        });

        return super.readFromTable('users', { 'username': username }).then((rows) => {
            if (rows.length > 0) {
                return rows[0].id;
            }
            throw new Error('User registration failed');
        });
    }

    async getUserByUsername(username: string): Promise<User | null> {
        return super.readFromTable('users', { 'username': username }).then((rows) => {
            if (rows.length > 0) {
                const userData = rows[0];
                const user = new User(userData.username, userData.id, userData.otp_secret);
                return user;
            }
            return null;
        });
    }

    async close(): Promise<void> {
        return super.close();
    }
}