import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="w-full p-5 nav flex flex-wrap shadow-md">
      <Link to={"/"}>
        <div className="mr-5 ml-5 uppercase text-cyan-700 font-bold pointer text-3xl ">
          prime filmy
        </div>
      </Link>
      <div className="mx-4 flex flex-wrap items-center">
        <Link to={"/movies"}>
          <div className="uppercase font-medium pointer text-base mr-5">
            Movies
          </div>
        </Link>
        <Link to={"/shows"}>
          <div className="uppercase font-bold pointer text-base pr-5">
            TV Shows
          </div>
        </Link>
        <Link to={"/people"}>
          <div className="uppercase font-bold pointer text-base pr-5">
            People
          </div>
        </Link>
        <Link to={"/Search"}>
          <div className="uppercase font-bold pointer text-base pr-5">
            Search
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
