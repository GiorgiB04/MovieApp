import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import { fetchMovies } from "../services/movieServices";
import Pagination from "../components/paginations";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState([1]);
  const [totalPages, settotalPages] = useState([1]);

  useEffect(() => {
    setLoading(true);
    fetchMovies(activePage)
      .then((res) => {
        console.log(res);
        setMovies(res?.results);
        setActivePage(res?.page);
        settotalPages(res?.total_pages);
      })
      .catch((err) => console.log(err, "error!!!!"))
      .finally(() => {
        setLoading(false);
      });
  }, [activePage]);

  return (
    <>
      {loading && (
        <div className="flex justify-center items-center h-screen">
          <div className="rounded-full h-20 w-20 bg-slate-500 animate-ping"></div>
        </div>
      )}
      <div className="mt-8 mx-2 flex justify-center">
        <div className="gap-8 grid lg:grid-cols-7 md:grid-cols-5 xs:grid-cols-2 grid-cols-2">
          {movies &&
            movies?.map((item) => (
              <Card key={item?.id} item={item} type={"movie"} />
            ))}
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
