import sqlite3 from 'sqlite3';
import fs from 'fs';

export class SqlDatabase {
    private schemaPath: string;
    private db!: sqlite3.Database;

    constructor(schemaPath: string) {
        this.schemaPath = schemaPath;
    }

    initialize(location: string): boolean {
        try {
            this.db = new sqlite3.Database(location);
            const schema = fs.readFileSync(this.schemaPath, 'utf8');
            this.db.exec(schema);
            return true;
        } catch (err) {
            console.error('Error initializing DB:', err);
            return false;
        }
    }

    async close(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err) {
                    console.error('Error closing DB:', err);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    addToTable(table: string, data: Record<string, any>): boolean {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const placeholders = keys.map(() => '?').join(', ');

        const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;

        try {
            this.db.run(sql, values);
            return true;
        } catch (err) {
            console.error('Error inserting:', err);
            return false;
        }
    }

    async readFromTable(table: string, criteria: Record<string, any>): Promise<any> {
        const whereClauses: string = Object.keys(criteria).map(key => `${key} = ?`).join(' AND ');
        const values: any[] = Object.values(criteria);

        const sql = `SELECT * FROM ${table} WHERE ${whereClauses}`;

        return new Promise((resolve, reject) => {
            this.db.all(sql, values, (err, rows) => {
                if (err) {
                    console.error('Error reading data:', err.message);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

}