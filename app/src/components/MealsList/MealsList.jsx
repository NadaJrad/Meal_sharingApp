import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Meal from "../Meal/Meal.jsx";
import { Grid, Card, CardContent } from "@mui/material";

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
    <Grid container spacing={2} justifyContent="center">
      {" "}
      {/* MUI Grid container */}
      {meals.map((meal) => (
        <Grid item xs={12} sm={6} md={4} key={meal.id}>
          {" "}
          {/* Grid item for each meal */}
          <Card>
            <CardContent>
              <Meal meal={meal} />
              <Link to={`/meals/${meal.id}`} className="view-details-link">
                View Details
              </Link>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default MealsList;
