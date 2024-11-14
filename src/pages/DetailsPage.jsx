import React, { useEffect, useState } from "react";
import {
  imgUrl,
  fetchDetails,
  fetchCredits,
  creatImageUrl,
} from "../services/movieServices";
import { useParams } from "react-router-dom";

const Details = () => {
  const [details, setDetails] = useState({});
  const { id, type } = useParams();
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [detailsDeta, creditsData] = await Promise.all([
          fetchDetails(type, id),
          fetchCredits(type, id),
        ]);
        //set Details
        setDetails(detailsDeta);
        //set Cast
        console.log(cast, "cast");
        setCast(creditsData?.cast?.slice(0, 10));
      } catch (error) {
        console.log(error, "erorr");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [type, id]);

  console.log(cast, "cast");

  const bg_cover = imgUrl + "/original" + details.backdrop_path;
  const title = details?.title || details?.name;
  const releaseDate =
    type === "tv" ? details?.first_air_date : details?.release_date;
  const runtime = details?.runtime;
  const player =
    type === "tv" ? (
      <iframe
        src={"https://embed.su/embed/tv/" + id + "/1" + "/1"}
        width="100%"
        height="100%"
        allowFullScreen
      ></iframe>
    ) : (
      <iframe
        src={"https://embed.su/embed/movie/" + id}
        width="100%"
        height="100%"
        allowFullScreen
      ></iframe>
    );

  return (
    <>
      {loading && (
        <div className="flex justify-center items-center h-screen">
          <div className="rounded-full h-20 w- bg-slate-500 animate-ping"></div>
        </div>
      )}
      <div className="">
        <div className="top-0 right-0 left-0 bottom-0">
          <div
            className="w-[100%] h-[auto] bg-gradient-to-r bg-cover bg-no-repeat 
  bg-center"
          >
            <div className="m-7 p-5 flex ">
              <div className=" w-[280px] rounded-lg m-2 overflow-hidden ">
                <img
                  className=""
                  src={imgUrl + "/w300" + details.poster_path}
                  alt={title}
                />
              </div>
              <div className="m-2 px-5 w-full">
                <h2 className="py-3 text-5xl font-bold">{title}</h2>
                <div>
                  <span>{releaseDate}</span>
                  <span> | </span>
                  <span>{runtime} Min</span>
                  <span className="flex">
                    {details?.genres?.map((genre) => (
                      <div
                        key={genre?.id}
                        className="px-3 border-2 mt-3 mr-2 border-slate-500 rounded-full"
                      >
                        {genre?.name}
                      </div>
                    ))}
                  </span>
                </div>
                <div className="my-4 italic text-slate-300 text-lg">
                  {details.tagline}
                </div>
                <span>{details.vote_average?.toFixed(1)}/10</span>

                <div className="mb-2 py-2 max-w-screen-md">
                  <h3 className="text-lg font-bold">Overview</h3>
                  {details.overview}
                </div>
              </div>
            </div>
            <div className="m-7 p-5 flex-row">
              <h2 className="text-2xl font-bold my-5">Top Billed Cast</h2>
              <div className="flex overflow-x-auto">
                {cast?.length === 0 && <div>No cast found</div>}
                {cast &&
                  cast?.map((cast) => (
                    <div className="mx-3 mb-4" key={cast?.id}>
                      <img
                        className="rounded-md max-w-[157px]"
                        src={creatImageUrl(cast?.profile_path, "w300")}
                        alt={cast?.name}
                      />
                      <p className="font-bold pt-3 pl-3">{cast?.name}</p>
                      <p className="pl-3">{cast?.character}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center lg:grid-cols-7 md:grid-cols-3 xs:grid-cols-1 sm:grid-cols-2 mx-14 my-20 py-5">
          <div className="lg:w-[900px] lg:h-[450px] md:w-[700px] md:h-[450px] w-[400px] h-[200px]">
            {player}
          </div>
        </div>
      </div>
    </>
  );
};

export default Details;
