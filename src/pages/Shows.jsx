import React, { useEffect, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import Card from "../components/Card";
import { fetchShows, fetchTvGenres } from "../services/movieServices";
import Pagination from "../components/paginations";

const Shows = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useLocalStorage("activePage", 1);
  const [sortBy, setSortBy] = useLocalStorage("sortBy", "popularity.desc");
  const [selectedGenre, setSelectedGenre] = useLocalStorage(
    "selectedGenre",
    ""
  );
  const [totalPages, setTotalPages] = useState(1);
  const [genres, setGenres] = useState([]);
  const [error, setError] = useState(null);

  // Fetch genres on component mount
  useEffect(() => {
    fetchTvGenres()
      .then((res) => setGenres(res))
      .catch((err) => console.error("Error fetching TV genres:", err));
  }, []);

  // Fetch TV shows when activePage, sortBy, or selectedGenre changes
  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchShows(activePage, sortBy, selectedGenre)
      .then((res) => {
        setShows(res?.results || []);
        setTotalPages(res?.total_pages || 1);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch Shows. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [activePage, sortBy, selectedGenre]);

  return (
    <>
      {loading && (
        <div className="flex justify-center items-center h-screen">
          <div className="rounded-full h-20 w-20 bg-slate-500 animate-ping"></div>
        </div>
      )}
      {error && <div className="text-red-500 text-center mt-4">{error}</div>}
      <div className="mt-4 mx-2 flex justify-center">
        <div className="px-5 pb-10">
          <div className="flex my-7 items-center">
            <h2 className="font-bold md:text-xl mr-5 capitalize">Shows</h2>

            {/* Sort By Dropdown */}
            <select
              className="border-slate-500 py-1 px-4 rounded-full border-2 dark:bg-slate-800"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="popularity.desc&vote_count.gte=100">
                Popular
              </option>
              <option value="vote_average.desc&vote_count.gte=1000">
                Top Rated
              </option>
            </select>

            {/* Genre Dropdown */}
            <select
              className="border-slate-500 py-1 px-4 rounded-full border-2 dark:bg-slate-800 ml-4"
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
            >
              <option value="">All Genres</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-8 justify-center">
            <div className="gap-8 grid lg:grid-cols-7 md:grid-cols-5 xs:grid-cols-2 grid-cols-2">
              {shows?.length > 0
                ? shows.map((item) => (
                    <Card key={item?.id} item={item} type={"tv"} />
                  ))
                : !loading && <p className="text-center">No Shows found.</p>}
            </div>
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

export default Shows;
