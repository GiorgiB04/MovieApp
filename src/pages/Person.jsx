import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
  fetchPersonDetails,
  fetchPersonCredits,
  createImageUrl,
} from "../services/movieServices";

const Person = () => {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const scrollContainerRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    Promise.all([fetchPersonDetails(id), fetchPersonCredits(id)])
      .then(([personData, creditsData]) => {
        setPerson(personData);
        setCredits(creditsData.cast || []);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch person details. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  // ✅ Auto-scroll effect, disabled on mobile
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || topRatedCredits.length < 7) return;

    if (window.innerWidth < 768) return;

    let scrollSpeed = 0.5;
    let intervalId;

    const startScrolling = () => {
      intervalId = setInterval(() => {
        if (
          container.scrollLeft >=
          container.scrollWidth - container.clientWidth
        ) {
          container.scrollLeft = 0;
        } else {
          container.scrollLeft += scrollSpeed;
        }
      }, 20);
    };

    startScrolling();

    container.addEventListener("mouseenter", () => clearInterval(intervalId));
    container.addEventListener("mouseleave", startScrolling);

    return () => {
      clearInterval(intervalId);
      container.removeEventListener("mouseenter", () =>
        clearInterval(intervalId)
      );
      container.removeEventListener("mouseleave", startScrolling);
    };
  }, [credits]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-4 border-cyan-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center mt-10 text-lg">{error}</div>
    );
  }

  // ✅ Filter out Talk Shows, News, Documentaries, and missing posters
  const filteredCredits = (credits || []).filter((credit) => {
    const genreIds = credit.genre_ids || [];
    const isBlockedGenre = genreIds.some((id) =>
      [10767, 10763, 99].includes(id)
    );
    const hasImage = credit.poster_path !== null;
    return !isBlockedGenre && hasImage;
  });

  // ✅ Sort credits by newest date
  const sortedCredits = [...filteredCredits].sort((a, b) => {
    const dateA = new Date(a.release_date || a.first_air_date || 0);
    const dateB = new Date(b.release_date || b.first_air_date || 0);
    return dateB - dateA;
  });

  // ✅ Top 7 Rated Works
  const topRatedCredits = [...filteredCredits]
    .filter((credit) => credit.vote_average > 0)
    .sort((a, b) => b.vote_average - a.vote_average)
    .slice(0, 7); // ✅ Changed 5 -> 7

  return (
    <div className="p-6 max-w-7xl mx-auto text-white">
      {person && (
        <>
          {/* Profile Section */}
          <div className="grid md:grid-cols-3 gap-8 items-start animate-fade-in-up">
            <div className="flex flex-col items-center">
              <img
                src={
                  person.profile_path
                    ? createImageUrl(person.profile_path, "w500")
                    : "/no-image.png"
                }
                alt={person.name}
                className="rounded-lg shadow-2xl w-72 h-auto object-cover"
              />
              <h1 className="mt-4 text-3xl font-bold text-cyan-500 text-center">
                {person.name}
              </h1>
              <p className="mt-2 text-gray-400">
                {person.known_for_department}
              </p>
            </div>

            {/* Biography & Info */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h2 className="text-2xl font-semibold border-b border-cyan-700 pb-2 mb-2">
                  Biography
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  {person.biography || "No biography available."}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#2e3047] rounded-lg p-4">
                  <h3 className="text-lg font-bold mb-2 text-cyan-400">Born</h3>
                  <p>{person.birthday || "N/A"}</p>
                </div>
                <div className="bg-[#2e3047] rounded-lg p-4">
                  <h3 className="text-lg font-bold mb-2 text-cyan-400">
                    Place of Birth
                  </h3>
                  <p>{person.place_of_birth || "N/A"}</p>
                </div>
                <div className="bg-[#2e3047] rounded-lg p-4">
                  <h3 className="text-lg font-bold mb-2 text-cyan-400">
                    Popularity
                  </h3>
                  <p>{person.popularity.toFixed(1)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Top 7 Rated Works */}
          {topRatedCredits.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6 text-cyan-500 animate-fade-in">
                Top 7 Rated Works
              </h2>

              {/* Gradient background container */}
              <div className="bg-gradient-to-b from-black/70 via-[#1a1a2e]/80 to-black/90 p-6 rounded-xl">
                <div
                  ref={scrollContainerRef}
                  className={`flex gap-6 overflow-x-auto pb-4 scrollbar-hide ${
                    topRatedCredits.length < 5
                      ? "justify-center"
                      : "justify-start"
                  }`}
                >
                  {topRatedCredits.map((credit, index) => (
                    <Link
                      key={credit.id}
                      to={`/${credit.media_type}/${credit.id}`}
                      className="flex flex-col items-center min-w-[96px] md:min-w-[112px] lg:min-w-[144px] relative transform hover:scale-105 hover:-rotate-1 transition-transform duration-300"
                    >
                      <div className="absolute top-0 left-2 bg-cyan-600 text-white text-xs font-bold px-2 py-1 rounded-bl-lg rounded-br-lg shadow-md drop-shadow-lg">
                        🏆 #{index + 1}
                      </div>
                      <img
                        src={createImageUrl(credit.poster_path, "w300")}
                        alt={credit.title || credit.name}
                        className="w-24 h-36 md:w-28 md:h-44 lg:w-36 lg:h-52 rounded-lg object-cover shadow-md mt-6"
                      />
                      <span
                        className="mt-2 text-sm text-center text-gray-300 font-semibold truncate max-w-[9rem]"
                        title={credit.title || credit.name}
                      >
                        {credit.title || credit.name}
                      </span>
                      <span className="text-xs text-cyan-400 mt-1">
                        ⭐ {credit.vote_average.toFixed(1)}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Known For Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-cyan-500 animate-fade-in">
              Known For
            </h2>

            {sortedCredits.length > 0 ? (
              <div className="flex flex-col space-y-4">
                {sortedCredits.map((credit) => (
                  <Link
                    key={credit.id}
                    to={`/${credit.media_type}/${credit.id}`}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#2e3047] transition"
                  >
                    <img
                      src={createImageUrl(credit.poster_path, "w200")}
                      alt={credit.title || credit.name}
                      className="w-20 h-28 rounded-md object-cover flex-shrink-0"
                    />
                    <div className="flex flex-col">
                      <span className="text-lg font-semibold text-white">
                        {credit.title || credit.name}
                      </span>

                      <div className="flex items-center text-sm text-gray-400 mt-1 space-x-2">
                        <span>
                          {credit.release_date
                            ? new Date(credit.release_date).getFullYear()
                            : credit.first_air_date
                            ? new Date(credit.first_air_date).getFullYear()
                            : "—"}
                        </span>
                        <span>•</span>
                        <span className="capitalize">
                          {credit.media_type === "movie" ? "Movie" : "TV Show"}
                        </span>
                        {credit.vote_average > 0 && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              ⭐ {credit.vote_average.toFixed(1)}
                            </span>
                          </>
                        )}
                      </div>
                      {credit.character && (
                        <span className="text-sm text-gray-400 mt-1">
                          as {credit.character}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No known works found.</p>
            )}
          </div>

          {/* Back Button */}
          <div className="mt-10 flex justify-center">
            <Link
              to="/people"
              className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 transition rounded-full text-white font-semibold"
            >
              ← Back to People
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Person;
