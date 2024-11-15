import React from "react";
import { creatImageUrl } from "../services/movieServices";
import { Link } from "react-router-dom";

const Card = ({ item, type }) => {
  const { title, poster_path } = item;

  return (
    <Link to={`/${type}/${item.id}`}>
      <div className="hover:border delay-75 relative w-[170px] rounded-md overflow-hidden">
        <img
          src={creatImageUrl(item?.poster_path, "w300")}
          alt={title || item?.name}
          height={"100%"}
        />
      </div>
    </Link>
  );
};

export default Card;
