import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import knex from "./database_client.js";
import nestedRouter from "./routers/nested.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const apiRouter = express.Router();

// You can delete this route once you add your own routes
apiRouter.get("/", async (req, res) => {
  const SHOW_TABLES_QUERY =
    process.env.DB_CLIENT === "pg"
      ? "SELECT * FROM pg_catalog.pg_tables;"
      : "SHOW TABLES;";
  const tables = await knex.raw(SHOW_TABLES_QUERY);
  res.json({ tables });
});

// This nested router example can also be replaced with your own sub-router
apiRouter.use("/nested", nestedRouter);

app.get("/my-route", (req, res) => {
  res.send("helloo friend");
});
// FUTURE MEAL
app.get("/future-meals", async (req, res) => {
  try {
    const result = await knex.raw("SELECT * FROM Meal WHERE `when` > NOW();");

    const futureMeals = result[0] || [];

    res.json(futureMeals);
  } catch (error) {
    console.error('Error retrieving future meals:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PAST MEAL
app.get("/past-meals", async (req, res) => {
  try {
    const result = await knex.raw("SELECT * FROM Meal WHERE `when` < NOW();");

    const futureMeals = result[0] || [];

    res.json(futureMeals);
  } catch (error) {
    console.error('Error retrieving future meals:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// all-meals
app.get("/all-meals", async (req, res) => {
  try {
    const result = await knex.raw("SELECT * FROM Meal ORDER BY id;");

    const futureMeals = result[0] || [];

    res.json(futureMeals);
  } catch (error) {
    console.error('Error retrieving future meals:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// first-meals
app.get("/first-meal", async (req, res) => {
  try {
    const result = await knex.raw("SELECT * FROM Meal ORDER BY id ASC LIMIT 1;");

    const futureMeals = result[0] || [];

    res.json(futureMeals);
  } catch (error) {
    console.error('Error retrieving future meals:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// last-meals
app.get("/last-meal", async (req, res) => {
  try {
    const result = await knex.raw("SELECT * FROM Meal ORDER BY id DESC LIMIT 1;");

    const futureMeals = result[0] || [];

    res.json(futureMeals);
  } catch (error) {
    console.error('Error retrieving future meals:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.use("/api", apiRouter);

app.listen(process.env.PORT, () => {
  console.log(`API listening on port ${process.env.PORT}`);
});

