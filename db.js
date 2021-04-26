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
        await client.query(query);  // sends queries
        return true;
    } catch (error) {
        console.error(error.stack);
        return false;
    } finally {
        await client.release();         // closes connection
    }
};

let createUserTabel = `
    CREATE TABLE IF NOT EXISTS "users" (
        "id" SERIAL,
        "name" VARCHAR(100) NOT NULL,
        "passord" VARCHAR(100) NOT NULL,
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
        "date" TIMESTAME NOT NULL,
        "total" VARCHAR(50),
        "tag" references tags(id),
        "store" reference stores(id),
        PRIMARY KEY ("receipt_id")
    );`;

const initDB = ()=> {
    execute(createUserTabel).then(() => {
        execute(createTagTabel).then(() => {
            execute.then(() => {
                execute(createStoreTable).then(() => {
                    execute(createReceiptTable).then((result) => {
                        if(result) {
                            console.log('Create Table Success')
                        }
                    })
                })
            })
        })
    })
        
        
        

}
module.exports = {execute, initDB}