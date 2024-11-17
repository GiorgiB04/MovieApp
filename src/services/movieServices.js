import axios from "axios";

export const key = "0c0baed002117a5f9c2005460430a553";
export const baseUrl = "https://api.themoviedb.org/3";
export const imgUrl = "https://image.tmdb.org/t/p";
export const popularMovies = baseUrl + `/movie/popular?api_key=` + key;

export function creatImageUrl(filename, size) {
  return `https://image.tmdb.org/t/p/${size}${filename}`;
}

//Discover movies
export const fetchMovies = async (page) => {
  const res = await axios.get(
    `${baseUrl}/discover/movie?api_key=${key}&vote_count.gte=100&page=${page}`
  );
  return res.data;
};

//Discover shows
export const fetchShows = async (page) => {
  const res = await axios.get(
    `${baseUrl}/discover/tv?api_key=${key}&vote_count.gte=100&page=${page}`
  );
  return res.data;
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
  const res = await axios.get(
    `${baseUrl}/${type}/${id}?api_key=${key}&vote_count.gte=100`
  );
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
