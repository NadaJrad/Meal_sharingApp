import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./MealDetails.css"; // Import the CSS file

const MealDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reservationData, setReservationData] = useState({
    numberOfGuests: 1,
    phoneNumber: "",
    name: "",
    email: "",
  });

  // Fetch meal details based on ID
  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/meals/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMeal(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMeal();
  }, [id]);

  // Handle input changes in the reservation form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setReservationData({ ...reservationData, [name]: value });
  };

  // Handle form submission for reservations
  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    try {
      const requestBody = {
        mealId: id,
        ...reservationData, // Spread the reservation data
      };
      const response = await fetch("http://localhost:3001/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          meal_id: id, // Passing meal ID
          number_of_guests: reservationData.numberOfGuests,
          contact_phonenumber: reservationData.phoneNumber,
          contact_name: reservationData.name,
          contact_email: reservationData.email,
          created_date: new Date().toISOString(), // Adding the current dat
        }),
      });

      if (!response.ok) {
        throw new Error(`Error creating reservation: ${response.status}`);
      }

      alert("Reservation created successfully!");
      navigate("/meals");
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <p>Loading meal details...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="meal-details">
      {meal ? (
        <>
          {meal.image && <img src={meal.image} alt={meal.title} />}
          <h1>{meal.title}</h1>
          <p>{meal.description}</p>
          <p>Price: {meal.price} DKK</p>
          <p>Available reservations: {meal.max_reservations}</p>
          <p>Date: {meal.when}</p>

          <form onSubmit={handleReservationSubmit}>
            <label>
              Number of Guests:
              <input
                type="number"
                name="numberOfGuests"
                min="1"
                onChange={handleChange}
                value={reservationData.numberOfGuests}
              />
            </label>
            <label>
              Phone Number:
              <input
                type="tel"
                name="phoneNumber"
                onChange={handleChange}
                value={reservationData.phoneNumber}
                required // Ensure the phone number is required
              />
            </label>
            <label>
              Name:
              <input
                type="text"
                name="name"
                onChange={handleChange}
                value={reservationData.name}
                required // Ensure the name is required
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                onChange={handleChange}
                value={reservationData.email}
                required // Ensure the email is required
              />
            </label>
            <button type="submit">Reserve</button>
          </form>

          <button className="back-button" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </>
      ) : (
        <p>No meal found with the given ID</p>
      )}
    </div>
  );
};

export default MealDetails;
