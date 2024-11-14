import { fetchTrending } from "../services/movieServices";
import { useEffect, useState } from "react";
import Card from "../components/Card";

const Home = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeWindow, setTimeWindow] = useState("day");

  useEffect(() => {
    setLoading(true);
    fetchTrending(timeWindow)
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        console.log(err, "error!!!");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [timeWindow]);

  console.log(data, "data");

  return (
    <>
      <div className="mt-4 mx-2 flex justify-center">
        <div className="px-5 pb-10">
          <div className="flex my-7 items-center">
            <h2 className="font-bold md:text-xl mr-5 capitalize">Trending</h2>
            <div className="border-slate-500 rounded-full border-2 overflow-hidden">
              <button
                className={`${
                  timeWindow === "day" ? "bg-slate-700" : ""
                } py-1 px-4`}
                onClick={() => setTimeWindow("day")}
              >
                Today
              </button>
              <button
                className={`${
                  timeWindow === "week" ? "bg-slate-700" : ""
                } py-1 px-4`}
                onClick={() => setTimeWindow("week")}
              >
                This Week
              </button>
            </div>
          </div>
          {loading && (
            <div className="flex justify-center items-center h-screen">
              <div className="rounded-full h-20 w-20 bg-slate-500 animate-ping"></div>
            </div>
          )}
          <div className="gap-8 grid lg:grid-cols-7 md:grid-cols-5 sm:grid-cols-2 xs:grid-cols-3">
            {data &&
              data?.map((item) => (
                <Card key={item?.id} item={item} type={item?.media_type} />
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
