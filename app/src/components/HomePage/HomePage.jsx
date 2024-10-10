import React, { useState, useEffect } from "react";
import FastfoodIcon from "@mui/icons-material/Fastfood"; // You can replace this with any other icon if desired
import "./HomePage.css";

function HomePage() {
  const [featuredMeals, setFeaturedMeals] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState([]); // For filtered results
  const [searchQuery, setSearchQuery] = useState(""); // Search input
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
        setFilteredMeals(data); // Initialize filtered meals with all meals
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

  // Handle search input changes
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase(); // Normalize input
    setSearchQuery(query);

    // Filter meals based on the search query
    const filtered = featuredMeals.filter((meal) =>
      meal.title.toLowerCase().includes(query)
    );
    setFilteredMeals(filtered); // Update the filtered list
  };

  // Get only six meals to display on the homepage
  const displayedMeals = filteredMeals.slice(0, 7);

  return (
    <>
      {/* Header section with logo and navigation */}
      <header className="header">
        <div className="logo-title">
          <FastfoodIcon className="app-logo" />
          <h1 className="app-title">
            F<span className="highlighted-oo">OO</span>diesHub
          </h1>
        </div>
        <nav className="menu">
          <a href="/" className="menu-item">
            Home
          </a>
          <a href="/meals" className="menu-item">
            Meals
          </a>
          <a href="/settings" className="menu-item">
            Settings
          </a>
        </nav>
      </header>
      {/* Welcome Section */}
      <div className="welcome-section">
        <h1 className="welcome-title">Welcome to FoodiesHub</h1>
        <p className="welcome-paragraph">
          Find your destination and book a private meal with the best home cooks
          in their homes around the world!
        </p>
      </div>
      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Search meals..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      {loading && <p>Loading featured meals...</p>} {/* Loading state */}
      {error && <p>Error: {error}</p>} {/* Error state */}
      {/* Display only the first six filtered meals */}
      <div className="featured-meals">
        {displayedMeals.map((meal) => (
          <div key={meal.id} className="meal-card">
            <img src={meal.image} alt={meal.title} className="meal-image" />
            <h3>{meal.title}</h3>
            <p>{meal.description}</p>
            <p>Price: {meal.price} DKK</p>
          </div>
        ))}
      </div>
      {/* View More Meals Button */}
      <div className="view-more-container">
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
