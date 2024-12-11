import React, { useEffect, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import Card from "../components/Card";
import { fetchMovies } from "../services/movieServices";
import Pagination from "../components/paginations";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useLocalStorage("activePage", 1); // Persist activePage
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchMovies(activePage)
      .then((res) => {
        setMovies(res?.results || []);
        setTotalPages(res?.total_pages || 1);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch movies. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [activePage]);

  return (
    <>
      {loading && (
        <div className="flex justify-center items-center h-screen">
          <div className="rounded-full h-20 w-20 bg-slate-500 animate-ping"></div>
        </div>
      )}
      {error && <div className="text-red-500 text-center mt-4">{error}</div>}
      <div className="container mx-auto">
        <select
          className="pt-4 mt-7 rounded-2xl dark:bg-slate-800"
          name=""
          id=""
        >
          <option value="">rating</option>
          <option value="">rating</option>
        </select>
        <div className="mt-8 justify-center">
          <div className="gap-8 grid lg:grid-cols-7 md:grid-cols-5 xs:grid-cols-2 grid-cols-2">
            {movies?.length > 0
              ? movies.map((item) => (
                  <Card key={item?.id} item={item} type={"movie"} />
                ))
              : !loading && <p className="text-center">No movies found.</p>}
          </div>
        </div>
      </div>
      <Pagination
        activePage={activePage}
        totalPages={totalPages}
        setActivePage={setActivePage}
      />
    </>
  );
};

export default Movies;
