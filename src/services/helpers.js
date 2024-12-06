export const ratingColor = (rating) => {
  if (rating >= 7) {
    return "bg-green-500 px-2 py-1 rounded-lg text-lg font-bold";
  } else if (rating >= 6) {
    return "bg-yellow-500 px-2 py-1 rounded-lg text-lg font-bold";
  } else if (rating >= 5) {
    return "bg-orange-600 px-2 py-1 rounded-lg text-lg font-bold";
  } else {
    return "bg-red-600 px-2 py-1 rounded-lg text-lg font-bold";
  }
};
