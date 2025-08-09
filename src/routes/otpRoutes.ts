import express from 'express';

import { generateToken } from '../services/generateToken';
import { validateToken } from '../services/validateToken';
import { UserDatabase } from '../infrastructure/database/UserDatabase';
import { OTPManager } from '../infrastructure/otp/OTPManager';

export function otpRoutes(database: UserDatabase, otpService: OTPManager) {
    const router = express.Router();

    router.post('/generate', async (req, res) => {
        const { username } = req.body;
        try {
            const token = await generateToken(username, database, otpService);
            res.json({ token });
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    });

    router.post('/validate', async (req, res) => {
        const { username, token } = req.body;
        try {
            const isValid = await validateToken(username, token, database, otpService);
            res.json({ valid: isValid });
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    });

    return router;
}