import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { key } from "../services/movieServices";

const Player = () => {
  const { id, type, season: paramSeason, episode: paramEpisode } = useParams();
  const navigate = useNavigate();
  const [season, setSeason] = useState(Number(paramSeason) || 1);
  const [episode, setEpisode] = useState(Number(paramEpisode) || 1);
  const [totalSeasons, setTotalSeasons] = useState(1);
  const [totalEpisodes, setTotalEpisodes] = useState(1);
  const iframeRef = useRef(null);

  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/tv/${id}?api_key=${key}`
        );
        const data = await res.json();
        setTotalSeasons(data?.number_of_seasons || 1);
      } catch (error) {
        console.error("Error fetching total seasons:", error);
      }
    };

    if (type === "tv") fetchSeasons();
  }, [id, type]);

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/tv/${id}/season/${season}?api_key=${key}`
        );
        const data = await res.json();
        setTotalEpisodes(data?.episodes?.length || 1);
      } catch (error) {
        console.error("Error fetching total episodes:", error);
      }
    };

    if (type === "tv") fetchEpisodes();
  }, [season, id, type]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data === "ended") {
        handleNext();
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [season, episode]);

  const handleChange = (newSeason, newEpisode) => {
    navigate(`/player/${id}/${type}/${newSeason}/${newEpisode}`);
    setSeason(newSeason);
    setEpisode(newEpisode);
  };

  const handleNext = () => {
    if (episode < totalEpisodes) {
      handleChange(season, episode + 1);
    } else if (season < totalSeasons) {
      handleChange(season + 1, 1);
    }
  };

  const handlePrevious = () => {
    if (episode > 1) {
      handleChange(season, episode - 1);
    } else if (season > 1) {
      const prevSeason = season - 1;
      const fetchPrevSeason = async () => {
        const res = await fetch(
          `https://api.themoviedb.org/3/tv/${id}/season/${prevSeason}?api_key=${key}`
        );
        const data = await res.json();
        handleChange(prevSeason, data?.episodes?.length || 1);
      };
      fetchPrevSeason();
    }
  };

  return (
    <div className="w-full min-h-screen dark:bg-slate-900 text-white flex flex-col items-center">
      <div className="w-full max-w-screen-xl p-4 flex justify-between items-center">
        <button
          onClick={() => navigate(`/${type}/${id}`)}
          className="text-purple-400 hover:underline"
        >
          ← Back to Details
        </button>
        {type === "tv" && (
          <div className="flex items-center gap-3">
            <label>
              Season:
              <select
                className="ml-2 p-1 rounded bg-slate-800 border border-slate-600"
                value={season}
                onChange={(e) => handleChange(Number(e.target.value), 1)}
              >
                {Array.from({ length: totalSeasons }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Episode:
              <select
                className="ml-2 p-1 rounded bg-slate-800 border border-slate-600"
                value={episode}
                onChange={(e) => handleChange(season, Number(e.target.value))}
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
      </div>

      <div className="w-full max-w-screen-xl aspect-video">
        <iframe
          ref={iframeRef}
          src={
            type === "tv"
              ? `https://vidlink.pro/tv/${id}/${season}/${episode}?autoplay=true`
              : `https://vidlink.pro/movie/${id}?autoplay=true`
          }
          width="100%"
          height="100%"
          allowFullScreen
          allow="autoplay"
          title="Media Player"
        ></iframe>
      </div>

      {type === "tv" && (
        <div className="my-5 flex gap-4">
          <button
            onClick={handlePrevious}
            className="px-4 py-2 bg-slate-700 rounded hover:bg-slate-600"
          >
            ⏮ Previous
          </button>
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-500"
          >
            ⏭ Play Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Player;
