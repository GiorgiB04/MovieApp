import axios from "axios";
import React, { useEffect, useState } from "react";
import MovieItem from "./MovieItem";

const MovieRow = ({ title, url }) => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios.get(url).then((response) => setMovies(response.data.results));
  }, [url]);

  console.log(movies);
  return (
    <>
      <div className="mt-4 mx-2 flex justify-center">
        <div className="px-2 pb-10">
          <h2 className="font-bold md:text-xl m-4 capitalize">{title}</h2>
          <div className="relative grid lg:grid-cols-5 md:grid-cols-3 xs:grid-cols-1 sm:grid-cols-2">
            {movies.map((movie) => (
              <MovieItem key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MovieRow;
