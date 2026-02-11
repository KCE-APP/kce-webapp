export const formatDate = (isoString) => {
  const date = new Date(isoString);

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export const formatTime = (isoString) => {
  const date = new Date(isoString);

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};
