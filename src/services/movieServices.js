import axios from "axios";

export const key = "0c0baed002117a5f9c2005460430a553";
export const baseUrl = "https://api.themoviedb.org/3";
export const imgUrl = "https://image.tmdb.org/t/p";
export const popularMovies = baseUrl + `/movie/popular?api_key=` + key;

export function createImageUrl(filename, size) {
  return `https://image.tmdb.org/t/p/${size}${filename}`;
}

// Genre IDs to exclude: Talk, Reality, Family, Soap
const excludedGenres = "10767,10764,10751,10766,10763";

//Discover movies
export const fetchMovies = async (page, sortBy, genreId = "") => {
  const genreParam = genreId ? `&with_genres=${genreId}` : "";
  const res = await axios.get(
    `${baseUrl}/discover/movie?api_key=${key}&page=${page}&sort_by=${sortBy}${genreParam}`
  );
  return res.data;
};

export const fetchGenres = async () => {
  const res = await axios.get(`${baseUrl}/genre/movie/list?api_key=${key}`);
  return res.data.genres;
};

//Discover shows
// Fetch TV Shows (excluding specific genres)
export const fetchShows = async (page, sortBy, genreId = "") => {
  const genreParam = genreId ? `&with_genres=${genreId}` : "";
  const res = await axios.get(
    `${baseUrl}/discover/tv?api_key=${key}&page=${page}&sort_by=${sortBy}${genreParam}&without_genres=${excludedGenres}`
  );
  return res.data;
};

export const fetchTvGenres = async () => {
  const res = await axios.get(`${baseUrl}/genre/tv/list?api_key=${key}`);
  return res.data.genres;
};

//Tranding movies and tv-series
export const fetchTrending = async (timeWindow = "day") => {
  const { data } = await axios.get(
    `${baseUrl}/trending/all/${timeWindow}?api_key=${key}`
  );
  return data?.results;
};

//Movies & TV-Series Details
export const fetchDetails = async (type, id) => {
  const res = await axios.get(`${baseUrl}/${type}/${id}?api_key=${key}`);
  return res.data;
};

//Credits
export const fetchCredits = async (type, id) => {
  const res = await axios.get(
    `${baseUrl}/${type}/${id}/credits?api_key=${key}`
  );
  return res?.data;
};

//Search
export const searchData = async (query, page) => {
  const res = await axios.get(
    `${baseUrl}/search/multi?api_key=${key}&query=${query}&page=${page}`
  );
  return res?.data;
};

//People
export const fetchPeople = async (page = 1) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/person/popular?api_key=${key}&page=${page}`
  );
  const data = await response.json();
  return data;
};

// Fetch person details
export const fetchPersonDetails = async (personId) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/person/${personId}?api_key=${key}&language=en-US`
  );
  const data = await response.json();
  return data;
};

// Fetch person's movies & TV credits
export const fetchPersonCredits = async (personId) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/person/${personId}/combined_credits?api_key=${key}&language=en-US`
  );
  const data = await response.json();
  return data;
};
