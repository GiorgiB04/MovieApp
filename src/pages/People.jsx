import React, { useEffect, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import Card from "../components/Card";
import { fetchPeople } from "../services/movieServices";
import Pagination from "../components/paginations";

const People = () => {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useLocalStorage("peoplePage", 1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Fetch people when the page loads or page changes
  useEffect(() => {
    if (searchTerm) return; // Skip fetch if searching

    setLoading(true);
    setError(null);

    fetchPeople(activePage)
      .then((res) => {
        setPeople(res?.results || []);
        setTotalPages(res?.total_pages || 1);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch popular people. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [activePage, searchTerm]);

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
            <h2 className="font-bold md:text-xl mr-5 capitalize">
              Popular People
            </h2>
          </div>

          {/* People Grid */}
          <div className="mt-8 justify-center">
            <div className="gap-8 grid lg:grid-cols-7 md:grid-cols-5 xs:grid-cols-2 grid-cols-2">
              {people
                .filter((item) => item.profile_path) // Hide people with no profile image
                .map((item) => (
                  <Card key={item.id} item={item} type="person" />
                ))}
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

export default People;
