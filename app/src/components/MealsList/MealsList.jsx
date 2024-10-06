import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Meal from "../Meal/Meal.jsx";
import "./MealsList.css";
const MealsList = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/meals");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        setMeals(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching meals:", error);
        setError(error.message); // Set error message to state
      }
    };

    fetchMeals();
  }, []);
  if (loading) return <p>Loading meals...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="meals-grid">
      {meals.map((meal) => (
        <div key={meal.id}>
          <Meal meal={meal} />
          <Link to={`/meals/${meal.id}`} className="view-details-link">
            View Details
          </Link>
        </div>
      ))}
    </div>
  );
};

export default MealsList;
