import React from "react";
import { createImageUrl } from "../services/movieServices"; // Fixed function name
import { Link } from "react-router-dom";
import noImage from "../img/no-image.webp"; // Ensure this path is correct

const Card = ({ item, type }) => {
  const { title, name, poster_path, profile_path, id } = item;
  const imageUrl = profile_path
    ? createImageUrl(profile_path, "w300")
    : createImageUrl(poster_path, "w300");

  return (
    <Link to={`/${type === "person" ? "person" : type}/${id}`}>
      <div className="relative w-[170px] rounded-md overflow-hidden hover:scale-105 transition-transform duration-200 ease-in-out text-center">
        <img
          src={imageUrl}
          alt={title || name}
          className="w-full h-auto rounded-md"
          loading="lazy"
          onError={(e) => (e.target.src = noImage)} // If image fails, use fallback
        />
        <p className="mt-2 font-semibold">{name || title}</p>
      </div>
    </Link>
  );
};

export default Card;
