import { useEffect, useState } from "react";
import Card from "../components/Card";
import { searchData } from "../services/movieServices";
import Pagination from "../components/pagination";

const Search = () => {
  const [searchValue, setSearchValue] = useState("");
  const [tempSearchValue, setTempSearchValue] = useState("");
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    searchData(searchValue, activePage)
      .then((res) => {
        console.log(res, "res");
        setData(res?.results);
        setActivePage(res?.page);
        setTotalPages(res?.total_pages);
      })
      .catch((err) => console.log(err, "err"))
      .finally(() => setIsLoading(false));
  }, [searchValue, activePage]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchValue(tempSearchValue);
  };

  return (
    <>
      <div className="flex justify-center">
        <div className="flex flex-wrap justify-center w-9/12 mx-11 my-8">
          <form className="w-full" onSubmit={handleSearch}>
            <input
              className="w-full px-7 py-3 bg-slate-800"
              placeholder="Search Movies & TV Shows..."
              value={tempSearchValue}
              onChange={(e) => setTempSearchValue(e.target.value)}
            />
          </form>

          {isLoading && (
            <div className="flex justify-center items-center h-screen">
              <div className="rounded-full h-20 bg-slate-500 animate-ping"></div>
            </div>
          )}

          {data?.length === 0 && !isLoading && (
            <div className="items-center mt-7">No results found</div>
          )}
        </div>
      </div>
      <div className="mt-4 mx-2 flex justify-center">
        <div className="px-2 grid lg:grid-cols-5 md:grid-cols-3 xs:grid-cols-1 sm:grid-cols-2">
          {data &&
            data?.map((item) => (
              <Card key={item?.id} item={item} type={item?.media_type} />
            ))}
        </div>
      </div>
      <div className="flex justify-center">
        {data?.length > 0 && !isLoading && (

        )}
      </div>
    </>
  );
};

export default Search;
