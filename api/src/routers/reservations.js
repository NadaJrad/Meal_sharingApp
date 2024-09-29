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



// POST - Add a new reservation
reservationRouter.post('/', async (req, res) => {
    const { meal_id, number_of_guests, contact_name, contact_email, contact_phonenumber } = req.body;
  
    // Validate required fields
    if (!meal_id || !number_of_guests || !contact_name) {
      return res.status(400).json({ error: 'Missing required fields: meal_id, number_of_guests, or contact_name' });
    }
  
    try {
      // Insert the new reservation into the database
      const [id] = await knex('Reservation').insert({
        meal_id,
        number_of_guests,
        contact_name,
        contact_email: contact_email || null, // Insert null if no contact_email is provided
        contact_phonenumber: contact_phonenumber || null, // Insert null if no contact_phonenumber is provided
        created_date: new Date() // Set the created date to the current time
      });
  
      // Send a success response
      res.status(201).json({ message: 'Reservation added successfully', reservation_id: id });
    } catch (error) {
      console.error('Error adding reservation:', error.message, error.stack);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  });



  // GET /api/reservations/:id - Returns a reservation by id
reservationRouter.get('/:id', async (req, res) => {
    const { id } = req.params;  // Extract the reservation id from the URL
  
    try {
      // Query the database for the reservation with the given id
      const reservation = await knex('Reservation').where({ id }).first();
  
      if (reservation) {
        // If the reservation is found, return it
        res.json(reservation);
      } else {
        // If no reservation is found, return a 404 Not Found
        res.status(404).json({ error: `Reservation with id ${id} not found` });
      }
    } catch (error) {
      // Log the error and return a 500 Internal Server Error response
      console.error('Error fetching reservation by id:', error.message, error.stack);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  });


// PUT /api/reservations/:id - Updates the reservation by id
reservationRouter.put('/:id', async (req, res) => {
    const { id } = req.params;  // Extract the reservation id from the URL
    const { number_of_guests, contact_name, contact_email, contact_phonenumber } = req.body;
  
    // Validate required fields (you can adjust this as necessary)
    if (!number_of_guests || !contact_name) {
      return res.status(400).json({ error: 'Missing required fields: number_of_guests and contact_name' });
    }
  
    try {
      // Update the reservation in the database
      const updatedRows = await knex('Reservation')
        .where({ id })
        .update({
          number_of_guests,
          contact_name,
          contact_email: contact_email || null, // Allow null if not provided
          contact_phonenumber: contact_phonenumber || null, // Allow null if not provided
        });
  
      if (updatedRows === 0) {
        // If no rows were updated, the reservation may not exist
        return res.status(404).json({ error: `Reservation with id ${id} not found` });
      }
  
      // If the update is successful, fetch the updated reservation
      const updatedReservation = await knex('Reservation').where({ id }).first();
      res.json(updatedReservation);
    } catch (error) {
      // Log the error and return a 500 Internal Server Error response
      console.error('Error updating reservation:', error.message, error.stack);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  });

  
  // DELETE /api/reservations/:id - Deletes the reservation by id
reservationRouter.delete('/:id', async (req, res) => {
    const { id } = req.params;  // Extract the reservation id from the URL
  
    try {
      // Delete the reservation in the database
      const deletedRows = await knex('Reservation').where({ id }).del();
  
      if (deletedRows === 0) {
        // If no rows were deleted, the reservation may not exist
        return res.status(404).json({ error: `Reservation with id ${id} not found` });
      }
  
      // If deletion is successful, return a success message
      res.status(204).send(); // No content, successful deletion
    } catch (error) {
      // Log the error and return a 500 Internal Server Error response
      console.error('Error deleting reservation:', error.message, error.stack);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  });


export default reservationRouter;
