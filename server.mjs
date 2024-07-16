import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import 'dotenv/config'

const app = express();
const port = process.env.PORT || 5412;
app.use(cors());
app.use(express.json());

async function openDB() {
  return open({
    filename: "database.db",
    driver: sqlite3.Database,
  });
}

const TABLE = "snipppool";
const COL_SNIPPET = "snippet";
const COL_CAT = "cat";
const COL_TAG = "tag";

/* let db = await openDB();
console.log("type:", typeof db, ", db:", db);
db.close(); */

app.post("/insert", async (req, res) => {
  const { snippet, cat, tag } = req.body;

  console.log("---\nreq.data:", req.body, "\n---");
  // res.json({ message: "some response: " + snippet +", "+ cat +", "+ tag });

  let db = new sqlite3.Database("./database.db");
  try {
    await db.run(
      `INSERT INTO ${TABLE} (${COL_SNIPPET}, ${COL_CAT}, ${COL_TAG}) VALUES (?, ?, ?)`,
      [snippet, cat, tag]
    );
    res.status(200).json({ message: "Data inserted successfully!" });
  } catch (err) {
    console.error("Error inserting data:", err);
    res.status(500).json({ error: "Error inserting data!" });
  } finally {
    db.close();
  }
});

// app.delete("/delete/:id", async (req, res) => {
// const id = req.params.id;
app.delete("/delete", async (req, res) => {
  const { id } = req.body;

  console.log("id:", id, "req.body:", req.body);

  let db = new sqlite3.Database("./database.db");
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
app.get("/retrieveList", async (req, res) => {
  // open the database
  let db = new sqlite3.Database("./database.db");
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
