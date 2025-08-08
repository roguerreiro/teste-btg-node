import { User } from '../../models/User';

export interface UserDatabase {
    registerUser(username: string, otp_secret: string): Promise<number>;
    getUserByUsername(username: string): Promise<User | null>;
}