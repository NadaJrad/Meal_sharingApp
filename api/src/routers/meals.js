import express from "express";
import knex from "../database_client.js"; // Make sure to import your database connection

const mealRouter = express.Router();

// FUTURE MEAL
mealRouter.get("/future-meals", async (req, res) => {
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
mealRouter.get("/past-meals", async (req, res) => {
  try {
    const result = await knex.raw("SELECT * FROM Meal WHERE `when` < NOW();");
    const pastMeals = result[0] || [];
    res.json(pastMeals);
  } catch (error) {
    console.error('Error retrieving past meals:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ALL MEALS
mealRouter.get("/all-meals", async (req, res) => {
  try {
    const result = await knex.raw("SELECT * FROM Meal ORDER BY id;");
    const allMeals = result[0] || [];
    res.json(allMeals);
  } catch (error) {
    console.error('Error retrieving all meals:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// FIRST MEAL
mealRouter.get("/first-meal", async (req, res) => {
  try {
    const result = await knex.raw("SELECT * FROM Meal ORDER BY id ASC LIMIT 1;");
    const firstMeal = result[0] || [];
    res.json(firstMeal);
  } catch (error) {
    console.error('Error retrieving first meal:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// LAST MEAL
mealRouter.get("/last-meal", async (req, res) => {
  try {
    const result = await knex.raw("SELECT * FROM Meal ORDER BY id DESC LIMIT 1;");
    const lastMeal = result[0] || [];
    res.json(lastMeal);
  } catch (error) {
    console.error('Error retrieving last meal:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default mealRouter;
