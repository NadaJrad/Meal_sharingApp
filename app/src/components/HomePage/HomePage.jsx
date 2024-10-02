import React, { useState, useEffect } from "react";
import hyfLogo from "../../assets/hyf.svg";
import "./HomePage.css";

function HomePage() {
  const [featuredMeals, setFeaturedMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedMeals = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:3001/api/meals");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setFeaturedMeals(data); // Set state with fetched meals
        setError(null);
      } catch (error) {
        console.error("Error fetching featured meals:", error);
        setError(error.message); // Set error message to state
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedMeals();
  }, []);

  return (
    <>
      <header className="header">
        <a
          href="https://www.hackyourfuture.dk/"
          target="_blank"
          rel="noreferrer"
          className="logo-link"
        >
          <img src={hyfLogo} alt="HackYourFuture logo" className="logo" />
        </a>
        <nav className="menu">
          <a href="/" className="menu-item">
            Home
          </a>
          <a href="/meals" className="menu-item">
            Meals
          </a>
          <a href="/nested" className="menu-item">
            Nested Page
          </a>
        </nav>
      </header>
      {loading && <p>Loading featured meals...</p>} {/* Loading state */}
      {error && <p>Error: {error}</p>} {/* Error state */}
      <div className="featured-section">
        <h2>Featured Meals</h2>

        <div className="featured-meals">
          {featuredMeals.slice(0, 6).map((meal) => (
            <div key={meal.id} className="meal-card">
              <h3>{meal.title}</h3>
              <p>{meal.description}</p>
              <p>Price: {meal.price} DKK</p>
            </div>
          ))}
        </div>

        <a href="/meals" className="view-more-button">
          View More Meals
        </a>
      </div>
      <footer className="footer">
        <p>&copy; 2024 Meal Sharing App. All rights reserved.</p>
      </footer>
    </>
  );
}

export default HomePage;
