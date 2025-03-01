import React from "react";
import { createImageUrl } from "../services/movieServices"; // Fixed function name
import { Link } from "react-router-dom";

const Card = ({ item, type }) => {
  const { title, name, poster_path, id } = item;

  return (
    <Link to={`/${type}/${id}`}>
      <div className="relative w-[170px] rounded-md overflow-hidden hover:scale-105 transition-transform duration-200 ease-in-out">
        <img
          src={
            poster_path ? createImageUrl(poster_path, "w300") : "/no-image.png"
          } // Fallback image
          alt={title || name}
          className="w-full h-auto rounded-md"
          loading="lazy"
        />
      </div>
    </Link>
  );
};

export default Card;
