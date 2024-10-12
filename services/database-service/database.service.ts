import mysql, { Connection } from 'mysql2/promise';
import { configDB } from '../../test-data/login.data';

export class DataBase {
    private connection: Connection | null;

    constructor() {
        this.connection = null;
    }

    async connect(): Promise<void> {
        this.connection = await mysql.createConnection({
            host: configDB.db_host,
            user: configDB.db_user,
            password: configDB.db_password,
            database: configDB.db_database,
            port: configDB.db_port,
        });
    }

    async executeQuery(query: string): Promise<any> {
        if (!this.connection) {
            throw new Error('Database connection is not established.');
        }

        const [results] = await this.connection.execute(query);
        return results;
    }

    async disconnect(): Promise<void> {
        if (this.connection) {
            await this.connection.end();
            this.connection = null;
        }
    }

    async removeUserLogs(userId: string): Promise<void> {
        const query = `DELETE FROM \`edit_lock\` WHERE \`userId\` = '${userId}'`;
        await this.executeQuery(query);
    }
}