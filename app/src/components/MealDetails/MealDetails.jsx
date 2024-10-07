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

  // State for the review form
  const [reviewData, setReviewData] = useState({
    title: "",
    description: "",
    stars: 1,
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
        meal_id: id, // Passing meal ID
        number_of_guests: reservationData.numberOfGuests,
        contact_phonenumber: reservationData.phoneNumber,
        contact_name: reservationData.name,
        contact_email: reservationData.email,
        created_date: new Date().toISOString(), // Adding the current date
      };
      console.log(requestBody);

      const response = await fetch("http://localhost:3001/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
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

  // Handle input changes in the review form
  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewData({ ...reviewData, [name]: value });
  };

  // Handle form submission for reviews
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const requestBody = {
        meal_id: id,
        title: reviewData.title,
        description: reviewData.description,
        stars: parseInt(reviewData.stars), // Ensure this is an integer
        created_date: new Date().toISOString().split("T")[0], // Date in YYYY-MM-DD format
      };
      console.log(requestBody);

      const response = await fetch("http://localhost:3001/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Error submitting review: ${response.status}`);
      }

      alert("Review submitted successfully!");
      // Optionally, reset the review form after submission
      setReviewData({ title: "", description: "", stars: 1 });
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

          {/* Reservation Form */}
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
                required
              />
            </label>
            <label>
              Name:
              <input
                type="text"
                name="name"
                onChange={handleChange}
                value={reservationData.name}
                required
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                onChange={handleChange}
                value={reservationData.email}
                required
              />
            </label>
            <button type="submit">Reserve</button>
          </form>

          {/* Review Form */}
          <h2>Leave a Review</h2>
          <form onSubmit={handleReviewSubmit}>
            <label>
              Title:
              <input
                type="text"
                name="title"
                onChange={handleReviewChange}
                value={reviewData.title}
                required
              />
            </label>
            <label>
              Description:
              <textarea
                name="description"
                onChange={handleReviewChange}
                value={reviewData.description}
                required
              />
            </label>
            <label>
              Stars:
              <input
                type="number"
                name="stars"
                min="1"
                max="5"
                onChange={handleReviewChange}
                value={reviewData.stars}
                required
              />
            </label>
            <button type="submit">Submit Review</button>
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
