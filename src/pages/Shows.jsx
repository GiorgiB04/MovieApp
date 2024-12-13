import React, { useEffect, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import Card from "../components/Card";
import { fetchShows } from "../services/movieServices";
import Pagination from "../components/paginations";

const Shows = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useLocalStorage("activePage", 1); // Persist activePage
  const [sortBy, setSortBy] = useLocalStorage("sortBy", "popularity.desc"); // Persist sortBy
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchShows(activePage, sortBy) // Include sortBy in the API request
      .then((res) => {
        setShows(res?.results || []);
        setTotalPages(res?.total_pages || 1);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch Shows. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [activePage, sortBy]);

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
            <select
              className="border-slate-500 py-1 px-4 rounded-full border-2 dark:bg-slate-800"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)} // Update sortBy on selection change
            >
              <option
                className="border-slate-500 rounded-full"
                value="popularity.desc&vote_count.gte=100&without_genres=10763%2C%2010764"
              >
                Popular
              </option>
              <option
                className="border-slate-500 rounded-full"
                value="vote_average.desc&vote_count.gte=1000"
              >
                Top Rated
              </option>
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
