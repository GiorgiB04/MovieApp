import React, { useEffect, useState } from "react";
import {
  imgUrl,
  fetchDetails,
  fetchCredits,
  createImageUrl,
  key,
} from "../services/movieServices";
import { useParams } from "react-router-dom";
import { ratingColor } from "../services/helpers";

const Details = () => {
  const [details, setDetails] = useState({});
  const { id, type } = useParams();
  const [cast, setCast] = useState([]);
  const [director, setDirector] = useState("");
  const [writer, setWriter] = useState("");
  const [creator, setCreator] = useState("");
  const [loading, setLoading] = useState(true);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [totalEpisodes, setTotalEpisodes] = useState(20); // Default to 20

  // Fetch season details dynamically
  const fetchSeasonDetails = async (selectedSeason) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${id}/season/${selectedSeason}?api_key=${key}`
      );
      const data = await response.json();
      setTotalEpisodes(data.episodes.length || 20); // Update total episodes
    } catch (error) {
      console.error("Error fetching season details:", error);
      setTotalEpisodes(20); // Fallback value
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [detailsData, creditsData] = await Promise.all([
          fetchDetails(type, id),
          fetchCredits(type, id),
        ]);

        // Set Details
        setDetails(detailsData);

        // Set Cast
        setCast(creditsData?.cast?.slice(0, 10));

        // Extract Director (for Movies)
        if (type === "movie") {
          const foundDirector = creditsData.crew.find(
            (person) => person.job === "Director"
          );
          setDirector(foundDirector ? foundDirector.name : "Unknown");
        }

        // Extract Writers (for Movies & TV)
        const foundWriters = creditsData.crew
          .filter(
            (person) =>
              person.job === "Writer" ||
              person.job === "Screenplay" ||
              person.job === "Story" ||
              person.department === "Writing"
          )
          .map((writer) => writer.name)
          .join(", ");

        setWriter(foundWriters || "Unknown");

        // Extract Creator (for TV Shows)
        if (type === "tv") {
          setCreator(
            detailsData?.created_by?.length > 0
              ? detailsData.created_by.map((creator) => creator.name).join(", ")
              : "Unknown"
          );
        }

        // Fetch season details for the first season
        if (type === "tv") {
          fetchSeasonDetails(1);
        }
      } catch (error) {
        console.log(error, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, id]);

  // Fetch episode count when season changes
  useEffect(() => {
    if (type === "tv") {
      fetchSeasonDetails(season);
    }
  }, [season]);

  const bg_cover = imgUrl + "/original" + details.backdrop_path;
  const title = details?.title || details?.name;
  const releaseDate =
    type === "tv" ? details?.first_air_date : details?.release_date;
  const runtime = details?.runtime;

  const player =
    type === "tv" ? (
      <iframe
        src={`https://vidlink.pro/tv/${id}/${season}/${episode}?autoplay=false`}
        width="100%"
        height="100%"
        allowFullScreen
      ></iframe>
    ) : (
      <iframe
        src={`https://vidlink.pro/movie/${id}?autoplay=false`}
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
      <div>
        <div
          style={{
            backgroundImage: `linear-gradient(to right, rgba(31.5, 31.5, 31.5, 1) calc((50vw - 170px) - 340px), rgba(31.5, 31.5, 31.5, 0.84) 50%, rgba(31.5, 31.5, 31.5, 0.84) 100%), url(${bg_cover})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
          className="top-0 right-0 left-0 bottom-0"
        >
          <div
            className="w-[100%] bg-gradient-to-tl h-[auto] bg-cover bg-no-repeat 
  bg-center"
          >
            <div className="md:mx-7 md:p-7 flex">
              <div className="hidden md:block w-[280px] rounded-lg m-2 overflow-hidden ">
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
                <span className={ratingColor(details?.vote_average)}>
                  {details.vote_average?.toFixed(1)}
                </span>

                <div className="mb-2 py-2 max-w-screen-md">
                  <h3 className="text-lg font-bold">Overview</h3>
                  {details.overview}
                </div>
                <div className="mb-2 py-2 max-w-screen-md">
                  {type === "movie" && (
                    <p>
                      <strong>Director: </strong> {director}
                      <strong className="ml-8">Writer:</strong> {writer}
                    </p>
                  )}
                  {type === "tv" && (
                    <p>
                      <strong>Creator:</strong> {creator}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="m-7 p-5 flex-row">
              <h2 className="text-2xl font-bold my-5">Top Billed Cast</h2>
              <div className="flex overflow-x-auto">
                {cast?.filter((member) => member?.profile_path).length === 0 ? (
                  <div>No cast found</div>
                ) : (
                  cast
                    ?.filter((member) => member?.profile_path) // Filter out items with null profile_path
                    .map((member) => (
                      <div className="mx-3 mb-4" key={member?.id}>
                        <img
                          className="rounded-md max-w-[157px]"
                          src={createImageUrl(member?.profile_path, "w300")}
                          alt={member?.name || "Cast Member"}
                        />
                        <p className="font-bold pt-3 pl-3">
                          {member?.name || "Unknown Name"}
                        </p>
                        <p className="pl-3">
                          {member?.character || "Unknown Character"}
                        </p>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Season & Episode Selector */}
        {type === "tv" && (
          <div className="flex justify-center gap-4 my-10">
            <label className="font-bold">
              Season:
              <select
                className="mx-2 p-2 border rounded dark:bg-slate-800 border-slate-500 cursor-pointer"
                value={season}
                onChange={(e) => setSeason(Number(e.target.value))}
              >
                {Array.from(
                  { length: details?.number_of_seasons || 10 },
                  (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  )
                )}
              </select>
            </label>

            <label className="font-bold">
              Episode:
              <select
                className="mx-2 p-2 border rounded dark:bg-slate-800 border-slate-500 cursor-pointer"
                value={episode}
                onChange={(e) => setEpisode(Number(e.target.value))}
              >
                {Array.from({ length: totalEpisodes }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}

        <div className="flex justify-center lg:grid-cols-7 md:grid-cols-3 xs:grid-cols-1 sm:grid-cols-2 my-10">
          <div className="lg:w-[1000px] lg:h-[450px] md:w-[700px] md:h-[350px] w-[100%] h-[250px]">
            {player ? player : <p>Video content is unavailable.</p>}
          </div>
        </div>
      </div>
    </>
  );
};

export default Details;
