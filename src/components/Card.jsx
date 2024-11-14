import React from "react";
import { creatImageUrl } from "../services/movieServices";
import { Link } from "react-router-dom";

const Card = ({ item, type }) => {
  const { title, poster_path } = item;

  return (
    <Link to={`/${type}/${item.id}`}>
      <div className="relative w-[170px] inline-block rounded-md m-3 overflow-hidden">
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
