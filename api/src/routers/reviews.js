import express from "express";
import knex from "../database_client.js"; 
 
const reviewRouter = express.Router();

// GET route to return all reviews
reviewRouter.get("/", async (req, res) => {
    try {
      // Fetch all reviews from the Reviews table
      const reviews = await knex("Review").select("*"); // Assuming the table name is 'Reviews'
      
      // Send the reviews back as JSON
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // GET route to return all reviews for a specific meal
reviewRouter.get("/:meal_id", async (req, res) => {
    const { meal_id } = req.params; // Extract meal_id from the URL parameters

    try {
        // Fetch all reviews associated with the specified meal_id
        const reviews = await knex("Review") // Assuming your reviews table is named 'Review'
            .where({ meal_id }) // Filter by meal_id
            .select("*"); // Select all columns

        // If no reviews are found, send a 404 response
        if (reviews.length === 0) {
            return res.status(404).json({ message: "No reviews found for this meal" });
        }

        // Send the reviews back as JSON
        res.json(reviews);
    } catch (error) {
        console.error("Error fetching reviews for meal ID:", meal_id, error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// POST route to add a new review
reviewRouter.post("/", async (req, res) => {
    const { title, description, meal_id, stars, created_date } = req.body;

    // Validate required fields
    if (!title || !description || !meal_id || !stars || !created_date) {
        return res.status(400).json({ error: "All fields (title, description, meal_id, stars, created_date) are required." });
    }

    try {
        // Insert the new review into the Review table
        const newReview = await knex("Review").insert({
            title,
            description,
            meal_id,
            stars,
            created_date // Assuming created_date is in 'YYYY-MM-DD' format
        });

        // Return success response with the newly created review ID
        res.status(201).json({ message: "Review added successfully!", id: newReview[0] });
    } catch (error) {
        console.error("Error adding new review:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET route to return a review by id
reviewRouter.get("/:id", async (req, res) => {
    const { id } = req.params; // Extract the review ID from the URL

    try {
        // Fetch the review with the specified id
        const review = await knex("Review").where({ id }).first(); // Use first() to get a single result

        // If the review is found, return it as JSON
        if (review) {
            res.json(review);
        } else {
            res.status(404).json({ message: "Review not found" }); // Return 404 if no review found
        }
    } catch (error) {
        console.error("Error fetching review by ID:", id, error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// PUT route to update a review by id
reviewRouter.put("/:id", async (req, res) => {
    const { id } = req.params; // Extract the review ID from the URL
    const updatedReview = req.body; // Extract the updated review data from the request body

    try {
        // Update the review in the database
        const result = await knex("Review").where({ id }).update(updatedReview);

        // Check if the review was updated
        if (result) {
            res.status(200).json({ message: `Review with ID ${id} updated successfully` });
        } else {
            res.status(404).json({ message: `Review with ID ${id} not found` });
        }
    } catch (error) {
        console.error(`Error updating review with ID ${id}:`, error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



// DELETE route to delete a review by ID
reviewRouter.delete('/:id', async (req, res) => {
    const { id } = req.params; // Extract the review ID from the URL

    try {
        // Attempt to delete the review with the specified ID from the database
        const result = await knex('Review').where({ id }).del();

        // Check if any review was deleted
        if (result) {
            res.status(200).json({ message: `Review with ID ${id} deleted successfully` });
        } else {
            res.status(404).json({ message: `Review with ID ${id} not found` }); // Return 404 if no review was found
        }
    } catch (error) {
        console.error(`Error deleting review with ID ${id}:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




 export default reviewRouter; 