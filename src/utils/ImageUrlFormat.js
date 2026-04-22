export function formatImageUrl(url) {
  if (!url || typeof url !== "string") return "";

  // 1. Handle Google Drive links (extract thumbnail for better embedding)
  if (url.includes("drive.google.com") || url.includes("docs.google.com")) {
    const parts = url.match(/\/d\/(.*?)\/|id=(.*?)(&|$)/);
    const id = parts ? (parts[1] || parts[2]) : null;
    if (id) {
      return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
    }
  }

  // 2. Handle existing remote URLs (Cloudinary, etc.)
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("blob:")) {
    return url;
  }

  // 3. Handle local relative paths
  const cleanPath = url.replace(/\\/g, "/");
  return `${import.meta.env.VITE_IMAGE_BASE_URL}/${cleanPath}`;
}
