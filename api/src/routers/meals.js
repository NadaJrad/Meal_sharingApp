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



// POST route to add a new meal
mealRouter.post("/", async (req, res) => {
    try {
      // Extract meal data from the request body
      const { title, description, location, when, price, max_reservations } = req.body;
  
      // Insert the new meal into the Meal table
      await knex("Meal").insert({
        title,
        description,
        location,
        when,
        price,
        max_reservations,
      });
  
      // Return success response
      res.status(201).json({ message: "Meal added successfully!" });
    } catch (error) {
      console.error("Error adding new meal:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });





  // GET route to return a meal by id
  mealRouter.get("/:id", async (req, res) => {
    try {
      const { id } = req.params; 
      
      // Now you can use the 'id' variable to query the database
      const meal = await knex("Meal").where({ id }).first();  // Find the meal with the given id
      
      if (meal) {
        res.json(meal);  // If the meal is found, return it as JSON
      } else {
        res.status(404).json({ message: "Meal not found" });  // If no meal is found, return a 404
      }
    } catch (error) {
      console.error("Error fetching meal by id:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });



  //Put meal by id 
  mealRouter.put("/:id",async(req,res) =>{

    const { id } = req.params; // Extract the meal ID from the URL
    const updatedMeal = req.body; // Extract the updated meal data from the request body
  
    try {
    const result =  await knex('Meal').where({ id }).update(updatedMeal);
    if (result) {
        res.status(200).json({ message: `Meal with ID ${id} updated successfully` });
      } else {
        res.status(404).json({ message: `Meal with ID ${id} not found` });
      }
    } catch (error) {
      console.error(`Error updating meal with ID ${id}:`, error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  // DELETE /api/meals/:id - Delete a meal by ID
mealRouter.delete('/:id', async (req, res) => {
    const { id } = req.params;  // Extract the meal ID from the URL
  
    try {
      // Attempt to delete the meal with the specified ID from the database
      const result = await knex('Meal').where({ id }).del();
  
      if (result) {
        res.status(200).json({ message: `Meal with ID ${id} deleted successfully` });
      } else {
        res.status(404).json({ message: `Meal with ID ${id} not found` });
      }
    } catch (error) {
      console.error(`Error deleting meal with ID ${id}:`, error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });



export default mealRouter;
