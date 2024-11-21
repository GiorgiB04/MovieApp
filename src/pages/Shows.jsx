import React, { useEffect, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import Card from "../components/Card";
import { fetchShows } from "../services/movieServices";
import Pagination from "../components/paginations";

const Shows = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useLocalStorage("activePage", 1);
  const [totalPages, settotalPages] = useState([1]);

  useEffect(() => {
    setLoading(true);
    fetchShows(activePage)
      .then((res) => {
        console.log(res);
        setShows(res?.results);
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
          {shows &&
            shows?.map((item) => (
              <Card key={item?.id} item={item} type={"tv"} />
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

export default Shows;
