// setup Database
const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const execute = async (query) => {
    try {
        await client.connect();     // gets connection
        await client.query(query);  // sends queries
        return true;
    } catch (error) {
        console.error(error.stack);
        return false;
    } finally {
        await client.end();         // closes connection
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

const initDB = async ()=> {
    Promise.all([
        execute(createUserTabel),
        execute(createTagTabel),
        execute(createStoreTable),
        execute(createReceiptTable)
    ]).then(() => {
        console.log('Create Table Success');
    }).catch(() =>{
        console.log('Create Table Fail');
    })

}
export {execute, initDB}