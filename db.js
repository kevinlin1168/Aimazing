// setup Database
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const execute = async (query) => {
    try {
        const client = await pool.connect();     // gets connection
        const result = await client.query(query);  // sends queries
        client.release();
        return result;
    } catch (error) {
        console.error(error.stack);
        return error.stack;
    }
};

let createUserTabel = `
    CREATE TABLE IF NOT EXISTS "users" (
        "id" SERIAL,
        "name" VARCHAR(100) NOT NULL,
        "password" VARCHAR(100) NOT NULL,
        "role" INTEGER DEFAULT 1 NOT NULL,
        PRIMARY KEY ("id")
    );`;

let createTagTabel = `
    CREATE TABLE IF NOT EXISTS "tags" (
        "id" SERIAL,
        "name" VARCHAR(100) NOT NULL,
        PRIMARY KEY ("id")
    );`;

let createStoreTable = `
    CREATE TABLE IF NOT EXISTS "stores" (
        "id" SERIAL,
        "name" VARCHAR(100) NOT NULL,
        "tel" VARCHAR(50),
        "gst_reg" VARCHAR(50),
        PRIMARY KEY ("id")
    );`;

let createReceiptTable = `
    CREATE TABLE IF NOT EXISTS "receipts" (
        "receipt_id" VARCHAR(100) NOT NULL,
        "date" TIMESTAMP NOT NULL,
        "total" VARCHAR(50),
        "tag_id" SERIAL,
        "store_id" SERIAL,
        FOREIGN KEY (tag_id) REFERENCES tags (id),
        FOREIGN KEY (store_id) REFERENCES stores (id),
        PRIMARY KEY ("receipt_id")
    );`;

const initDB = ()=> {
    execute(createUserTabel+createTagTabel+createStoreTable+createReceiptTable).then(() => {
        console.log('Create Table Success');
    })
        
        
        

}
module.exports = {execute, initDB}