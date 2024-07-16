import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";

import dotenv from 'dotenv';
dotenv.config();

const {
  VITE_PORT,
  VITE_QUERY_DELETE,
  VITE_QUERY_INSERT,
  VITE_QUERY_RETRIEVE,
  DB_SOURCE,
  TABLE_NAME,
// eslint-disable-next-line no-undef
} = process.env;

const app = express();
const port = VITE_PORT || 5412;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const TABLE = TABLE_NAME;
const COL_SNIPPET = "snippet";
const COL_CAT = "cat";
const COL_TAG = "tag";

/* import { open } from "sqlite";
async function openDB() {
  return open({
    filename: DB_SOURCE || "database.db",
    driver: sqlite3.Database,
  });
}
let db = await openDB();
console.log("type:", typeof db, ", db:", db);
db.close(); */

app.post(`/${VITE_QUERY_INSERT}`, async (req, res) => {
  const { snippet, cat, tag } = req.body;

  console.log("\n---> req.body:", req.body, "\n---");
  // res.json({ message: "some response: " + snippet +", "+ cat +", "+ tag });

  let db = new sqlite3.Database(DB_SOURCE);
  try {
    await db.run(
      `INSERT INTO ${TABLE} (${COL_SNIPPET}, ${COL_CAT}, ${COL_TAG}) VALUES (?, ?, ?)`,
      [snippet, cat, tag]
    );
    /* Chack if data was entered */ 
    db.get(`SELECT * FROM ${TABLE} ORDER BY id DESC LIMIT 1`, (err, row) => {
      if (err) {
        console.error( "Error checking inserted data:", err);
        return;
      }

      if (row) {
        console.log('Latest entry:', row);
      } else {
        console.log('No entries found in the database.');
      }

      // db.close();
    });
    /* Chack */ 
    
    res.status(200).json({ message: "Data must be inserted." });
  } catch (err) {
    console.error("Error inserting data:", err);
    res.status(500).json({ error: "Error inserting data!" });
  } finally {
    db.close();
  }
});

// app.delete("/delete/:id", async (req, res) => {
// const id = req.params.id;
app.delete(`/${VITE_QUERY_DELETE}`, async (req, res) => {
  const { id } = req.body;

  console.log("id:", id, "req.body:", req.body);

  let db = new sqlite3.Database(DB_SOURCE);
  try {
    await db.run(`DELETE FROM ${TABLE} WHERE id = ?`, [id]);
    res.status(200).json({ message: "Data deleted successfully!" });
  } catch (err) {
    console.error("Error deleting data:", err);
    res.status(500).json({ error: "Error deleting data!" });
  } finally {
    db.close();
  }
});

// request from the client
app.get(`/${VITE_QUERY_RETRIEVE}`, async (req, res) => {
  // open the database
  let db = new sqlite3.Database(DB_SOURCE);
  // fetch rows from posts table
  await db.all(`SELECT * FROM ${TABLE}`, (err, rows) => {
    if (err) {
      // only show server console screen
      console.error("Error fetching data:", err);
      // send response to client
      res
        .status(500)
        .json({ error: "Error fetching data, inspect server logs" });
    } else {
      // rows.forEach((row) => { console.log(row.name); });
      // console.log("Result:", JSON.stringify(rows));
      res.json(rows);
    }
  });

  db.close();
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
