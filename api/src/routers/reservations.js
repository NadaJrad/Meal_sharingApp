import express from "express";
import knex from "../database_client.js"; // Ensure you have the database client

const reservationRouter = express.Router();

// Example Route for GET Reservations
reservationRouter.get("/", async (req, res) => {
  try {
    const reservations = await knex.select("*").from("Reservation");
    res.json(reservations);
  } catch (error) {
    console.error('Error retrieving reservations:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Additional reservation routes can go here (GET, POST, PUT, DELETE, etc.)

export default reservationRouter;
