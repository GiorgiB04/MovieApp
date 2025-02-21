import React, { useEffect, useState, useRef } from "react";
<script src="webtorrent.min.js"></script>;
import {
  imgUrl,
  fetchDetails,
  fetchCredits,
  creatImageUrl,
} from "../services/movieServices";
import { useParams } from "react-router-dom";
import { ratingColor } from "../services/helpers";

const Details = () => {
  const [details, setDetails] = useState({});
  const { id, type } = useParams();
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [magnetLink, setMagnetLink] = useState(""); // Store the torrent link
  const videoRef = useRef(null); // Reference for video element

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [detailsData, creditsData] = await Promise.all([
          fetchDetails(type, id),
          fetchCredits(type, id),
        ]);

        setDetails(detailsData);
        setCast(creditsData?.cast?.slice(0, 10));

        // Fetch torrent automatically when details are available
        fetchTorrents(
          detailsData.title || detailsData.name,
          detailsData.release_date
        );
      } catch (error) {
        console.error("Error fetching movie details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [type, id]);

  // Function to fetch torrents automatically
  const fetchTorrents = async (title, releaseDate) => {
    try {
      const query = encodeURIComponent(
        `${title} ${releaseDate?.split("-")[0]} 1080p`
      );
      const response = await fetch(`https://apibay.org/q.php?q=${query}`);
      const torrents = await response.json();

      if (torrents.length > 0) {
        const bestTorrent = torrents.sort((a, b) => b.seeders - a.seeders)[0]; // Get the best torrent
        const magnet = `magnet:?xt=urn:btih:${bestTorrent.info_hash}`;
        setMagnetLink(magnet); // Set the magnet link
        startStreaming(magnet);
      } else {
        console.log("No torrents found.");
      }
    } catch (error) {
      console.error("Error fetching torrents:", error);
    }
  };

  // Function to start streaming using WebTorrent
  const startStreaming = (magnetURI) => {
    const client = new WebTorrent();
    client.add(magnetURI, (torrent) => {
      const file = torrent.files.find(
        (f) => f.name.endsWith(".mp4") || f.name.endsWith(".mkv")
      );
      if (file) {
        file.renderTo(videoRef.current);
      }
    });
  };

  const bg_cover = imgUrl + "/original" + details.backdrop_path;
  const title = details?.title || details?.name;
  const releaseDate =
    type === "tv" ? details?.first_air_date : details?.release_date;
  const runtime = details?.runtime;

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
          <div className="w-[100%] bg-gradient-to-tl h-[auto] bg-cover bg-no-repeat bg-center">
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
              </div>
            </div>
            <div className="m-7 p-5 flex-row">
              <h2 className="text-2xl font-bold my-5">Top Billed Cast</h2>
              <div className="flex overflow-x-auto">
                {cast?.filter((member) => member?.profile_path).length === 0 ? (
                  <div>No cast found</div>
                ) : (
                  cast
                    ?.filter((member) => member?.profile_path)
                    .map((member) => (
                      <div className="mx-3 mb-4" key={member?.id}>
                        <img
                          className="rounded-md max-w-[157px]"
                          src={creatImageUrl(member?.profile_path, "w300")}
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
        <div className="flex justify-center lg:grid-cols-7 md:grid-cols-3 xs:grid-cols-1 sm:grid-cols-2 my-20 py-5">
          <div className="lg:w-[1000px] lg:h-[450px] md:w-[700px] md:h-[350px] w-[100%] h-[250px]">
            {magnetLink ? (
              <video ref={videoRef} controls width="100%" height="100%">
                Your browser does not support the video tag.
              </video>
            ) : (
              <p>No torrent available.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Details;
