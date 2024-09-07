import express from "express";
import cors from "cors";
import { Database } from "@sqlitecloud/drivers";

import dotenv from 'dotenv';
dotenv.config();

const {
  VITE_PORT,
  VITE_QUERY_DELETE,
  VITE_QUERY_INSERT,
  VITE_QUERY_RETRIEVE,
  DB_SOURCE,
  DB_NAME,
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

app.post(`/${VITE_QUERY_INSERT}`, async (req, res) => {
  const { snippet, cat, tag } = req.body;

  console.log("\n---> req.body:", req.body, "\n---");

  try {
    let db = new Database(DB_SOURCE);
    await db.sql`
      USE DATABASE ${DB_NAME};
      INSERT INTO ${TABLE} (${COL_SNIPPET}, ${COL_CAT}, ${COL_TAG}) VALUES (${snippet}, ${cat}, ${tag})
    `;
    /* Chack if data was entered */
    const data = db.sql`
      USE DATABASE ${DB_NAME};
      SELECT * FROM ${TABLE} ORDER BY id DESC LIMIT 1
    `;

    if (data) {
      console.log('Latest entry:', data);
    } else {
      console.log('No entries found in the database.');
    }

    res.status(200).json({ message: "Data must be inserted." });
  } catch (err) {
    console.error("Error inserting data:", err);
    res.status(500).json({ error: "Error inserting data!" });
  }
});

// delete snippet
app.delete(`/${VITE_QUERY_DELETE}`, async (req, res) => {
  const { id } = req.body;

  console.log("id:", id, "req.body:", req.body);

  try {
    let db = new Database(DB_SOURCE);
    await db.sql`
      USE DATABASE ${DB_NAME};
      DELETE FROM ${TABLE} WHERE id = ${id}
    `;
    res.status(200).json({ message: "Data deleted successfully!" });
  } catch (err) {
    console.error("Error deleting data:", err);
    res.status(500).json({ error: "Error deleting data!" });
  }
});

// request from the client
app.get(`/${VITE_QUERY_RETRIEVE}`, async (req, res) => {
  try {
    let db = new Database(DB_SOURCE);
    const data = await db.sql`
      USE DATABASE ${DB_NAME};
      SELECT * FROM ${TABLE};
    `;
    res.json(data)
  } catch (err) {
    // only show server console screen
    console.error("Error fetching data:", err);
    // send response to client
    res
      .status(500)
      .json({ error: "Error fetching data, inspect server logs" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
