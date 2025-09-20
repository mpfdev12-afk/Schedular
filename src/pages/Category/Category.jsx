import React from "react";
import "./Category.scss";
import { useNavigate } from "react-router-dom";

const Category = () => {
  const navigate = useNavigate();

  const onNav = (path) => {
    navigate(path);
  };

  return (
    <div className="Category">
      <h1>What are you looking for?</h1>
      <div className="cat">
        <div onClick={() => onNav("mental")} className="cat-cont">
          <img src="mental2.png"></img>
          <span>Mental</span>
        </div>
        <div onClick={() => onNav("physical")} className="cat-cont">
          <img src="physical2.png"></img>
          <span>Physical</span>
        </div>
        <div onClick={() => onNav("financial")} className="cat-cont">
          <img src="financial2.png"></img>
          <span>Financial</span>
        </div>
      </div>
    </div>
  );
};

export default Category;
