import React from "react";

const Meal = ({ meal }) => {
  return (
    <div className="meal-card">
      <img src={meal.image} alt={meal.title} className="meal-image" />
      <h3 className="meal-title">{meal.title}</h3>
      <p className="meal-description">{meal.description}</p>
      <p className="meal-price">Price: {meal.price} DKK</p>
    </div>
  );
};

export default Meal;
