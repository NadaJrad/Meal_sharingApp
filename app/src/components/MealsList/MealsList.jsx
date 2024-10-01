import React, { useEffect, useState } from "react";

const MealsList = () => {
  const [meals, setMeals] = useState([]);
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

  return (
    <div>
      <h1>Meals List</h1>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {meals.map((meal) => (
        <div key={meal.id}>
          <h2>{meal.title}</h2>
          <p>{meal.description}</p>
          <p>Price: {meal.price}</p>
        </div>
      ))}
    </div>
  );
};

export default MealsList;
