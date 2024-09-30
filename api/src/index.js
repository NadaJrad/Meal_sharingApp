import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import knex from "./database_client.js"; // Your database connection
import mealRouter from "./routers/meals.js"; // Import the meal router
import reservationRouter from "./routers/reservations.js"; // Import the reservation router
import reviewRouter from "./routers/reviews.js";

const app = express();

app.use(cors());
app.use(bodyParser.json());

const apiRouter = express.Router();

// Default route (can be removed when other routes are implemented)
apiRouter.get("/", async (req, res) => {
  const SHOW_TABLES_QUERY =
    process.env.DB_CLIENT === "pg"
      ? "SELECT * FROM pg_catalog.pg_tables;"
      : "SHOW TABLES;";
  const tables = await knex.raw(SHOW_TABLES_QUERY);
  res.json({ tables });
});

// Use meals and reservations routers
apiRouter.use("/meals", mealRouter);  // Add meals routes to /meals
apiRouter.use("/reservations", reservationRouter);  // Add reservations routes to /reservations
apiRouter.use('/reviews', reviewRouter);

app.use("/api", apiRouter);
app.listen(process.env.PORT, () => {
  console.log(`API listening on port ${process.env.PORT}`);
});


