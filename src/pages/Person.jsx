import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  fetchPersonDetails,
  fetchPersonCredits,
} from "../services/movieServices";
import { createImageUrl } from "../services/movieServices";
import Card from "../components/Card";

const Person = () => {
  const { id } = useParams(); // Get person ID from URL
  const [person, setPerson] = useState(null);
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Fetch person details & credits
    Promise.all([fetchPersonDetails(id), fetchPersonCredits(id)])
      .then(([personData, creditsData]) => {
        setPerson(personData);
        setCredits(
          (creditsData.cast || []).filter(
            (credit) =>
              credit.poster_path && // ✅ Ensure it has an image
              credit.media_type !== "tv" && // ❌ Exclude TV shows (optional)
              !/(Talk|News|Documentary)/i.test(credit.title || credit.name) // ❌ Filter out by title/name
          )
        );
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch person details. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="rounded-full h-20 w-20 bg-slate-500 animate-ping"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  return (
    <div className="p-6">
      {person && (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile Image */}
          <div className="flex flex-col items-center">
            <img
              src={
                person.profile_path
                  ? createImageUrl(person.profile_path, "w500")
                  : "/no-image.png" // ✅ Fallback image
              }
              alt={person.name}
              className="rounded-lg shadow-lg w-72 h-auto"
            />
            <h1 className="mt-4 text-2xl font-bold">{person.name}</h1>
            <p className="mt-2 text-gray-600">{person.known_for_department}</p>
          </div>

          {/* Biography */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-bold">Biography</h2>
            <p className="mt-2 text-gray-700 text-sm">
              {person.biography || "No biography available."}
            </p>

            {/* Personal Info */}
            <div className="mt-6">
              <h2 className="text-xl font-bold">Personal Info</h2>
              <p>
                <strong>Born:</strong> {person.birthday || "N/A"}
              </p>
              <p>
                <strong>Place of Birth:</strong>{" "}
                {person.place_of_birth || "N/A"}
              </p>
              <p>
                <strong>Popularity:</strong> {person.popularity.toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Known For (Movies & TV Shows) */}
      <div className="mt-10 grid justify-center">
        <h2 className="text-xl font-bold mb-4">Known For</h2>

        <div className="flex">
          <div className="gap-8 grid lg:grid-cols-8 md:grid-cols-5 xs:grid-cols-2 grid-cols-2">
            {credits.length > 0 ? (
              credits.map((credit) => (
                <Card key={credit.id} item={credit} type={credit.media_type} />
              ))
            ) : (
              <p className="text-gray-500">No known works found.</p> // ✅ Display message if no valid credits
            )}
          </div>
        </div>
      </div>

      {/* Back to People Button */}
      <div className="mt-10">
        <Link
          to="/people"
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          ← Back to People
        </Link>
      </div>
    </div>
  );
};

export default Person;
