import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Abhi@99',
};

const dbName = process.env.DB_NAME || 'commerce_db';

async function setupDatabase() {
  let connection;
  try {
    console.log('📦 Connecting to MySQL server...');
    
    // Connect to MySQL server (without selecting a database)
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to MySQL server');

    // Create database
    console.log(`📁 Creating database: ${dbName}`);
    await connection.execute(
      `CREATE DATABASE IF NOT EXISTS ${dbName} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    console.log(`✅ Database ${dbName} created/already exists`);

    // Switch to the new database
    await connection.changeUser({ database: dbName });
    console.log(`✅ Switched to database ${dbName}`);

    // Read and execute schema
    console.log('📄 Executing schema...');
    const schemaPath = path.join(__dirname, 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    
    // Split schema by semicolon and execute each statement
    const statements = schema.split(';').filter(stmt => stmt.trim());
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.execute(statement);
      }
    }
    console.log('✅ Schema created successfully');

    // Read and execute seed data
    console.log('📄 Executing seed data...');
    const seedPath = path.join(__dirname, 'database', 'seed.sql');
    if (fs.existsSync(seedPath)) {
      const seed = fs.readFileSync(seedPath, 'utf-8');
      const seedStatements = seed.split(';').filter(stmt => stmt.trim());
      for (const statement of seedStatements) {
        if (statement.trim()) {
          await connection.execute(statement);
        }
      }
      console.log('✅ Seed data inserted successfully');
    }

    console.log('\n✨ Database setup completed successfully!');
    console.log(`Database: ${dbName}`);
    console.log(`Host: ${dbConfig.host}:${dbConfig.port}`);
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('⚠️  MySQL server is not running. Please start MySQL service first.');
      console.error('   On Windows: Open PowerShell as Administrator and run: net start MySQL80');
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();
