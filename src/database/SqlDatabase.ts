import sqlite3 from 'sqlite3';
import fs from 'fs';

export class SqlDatabase {
    private schemaPath: string;
    private db: sqlite3.Database | null = null;

    constructor(schemaPath: string) {
        this.schemaPath = schemaPath;
    }

    initialize(location: string): boolean {
        this.db = new sqlite3.Database(location, (err) => {
        if (err) {
            console.error('Failed to connect to database', err);
            return false;
        } else if (this.db){
            console.log('Database connected:', location);

            const schema = fs.readFileSync(this.schemaPath, 'utf8');
            this.db.exec(schema, (err) => {
            if (err) {
                console.error('Failed to initialize schema', err);
                return false;
            } else {
                console.log('Database schema good.');
            }
            });
        }
        });
        return (!this.db) ? false : true;
    }

    addToTable(table: string, data: Record<string, any>): boolean {
        if (!this.db) {
            console.error('Database not initialized');
            return false;
        }

        const columns: string = Object.keys(data).join(', ');
        const placeholders: string = Object.keys(data).map(() => '?').join(', ');
        const values: any[] = Object.values(data);

        const sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;

        this.db.run(sql, values, function(err) {
            if (err) {
                console.error('Error inserting data:', err.message);
                return false;
            } else {
                console.log(`Data inserted into ${table} with rowid ${this.lastID}`);
            }
        });

        this.db.close();
        return true;
    }

    readFromTable(table: string, criteria: Record<string, any>): Promise<any> {
        if (!this.db) {
            console.error('Database not initialized');
            return Promise.resolve([]);
        }

        const whereClauses: string = Object.keys(criteria).map(key => `${key} = ?`).join(' AND ');
        const values: any[] = Object.values(criteria);

        const sql = `SELECT * FROM ${table} WHERE ${whereClauses}`;

        this.db.all(sql, values, (err, rows) => {
            if (err) {
                console.error('Error reading data:', err.message);
                return Promise.resolve([]);
            } else {
                return Promise.resolve(rows);
            }
        });

        this.db.close();
        return Promise.resolve([]);
    }
}