export function formatImageUrl(url) {
  if (!url || typeof url !== "string") return "";

  if (!url.startsWith("http") && !url.startsWith("https")) {
    const cleanPath = url.replace(/\\/g, "/");
    // console.log(`${import.meta.env.VITE_IMAGE_BASE_URL}/${cleanPath}`);
    return `${import.meta.env.VITE_IMAGE_BASE_URL}/${cleanPath}`;
  }

  return url;
}
