import express from 'express';
import fs from 'fs';
import path from 'path';
import { otpRoutes } from './routes/otpRoutes';
import { SqlUserDatabase } from './infrastructure/database/SqlUserDatabase';
import { TOTPManager } from './infrastructure/otp/TOTPManager';

const app = express();
app.use(express.json());

const dbSchema = path.resolve(__dirname, './infrastructure/database/init.sql');
const dbLocation = path.resolve(__dirname, './infrastructure/database/users.db');
const userDatabase = new SqlUserDatabase(dbSchema);
userDatabase.initialize(dbLocation);

const configPath = path.resolve(__dirname, './otp_config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
const otpManager = new TOTPManager(config.otpValidity, config.otpLength);

app.use('/otp', otpRoutes(userDatabase, otpManager));

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
