import express from 'express';
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

const otpManager = new TOTPManager();

app.use('/otp', otpRoutes(userDatabase, otpManager));

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
