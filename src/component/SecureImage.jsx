import { useState, useEffect } from "react";

const SecureImage = ({ src, alt, className, style, ...props }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let objectUrl = null;

    const fetchImage = async () => {
      if (!src) {
        setLoading(false);
        return;
      }

      // If it's a data URI, blob, or internal relative path (unlikely for upload), just use it
      if (src.startsWith("data:") || src.startsWith("blob:")) {
        setImageSrc(src);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // We use fetch to add the custom header required by ngrok free tier
        // to bypass the browser warning interstitial page.
        const response = await fetch(src, {
          headers: {
            "ngrok-skip-browser-warning": "true",
            // "Cache-Control": "no-cache", // Optional
          },
        });

        if (!response.ok) {
          // If fetch fails (non-2xx), throw
          throw new Error(`Failed to load image: ${response.status}`);
        }

        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);

        if (isMounted) {
          setImageSrc(objectUrl);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error loading secure image:", err);
        if (isMounted) {
          // If fetch fails (e.g. CORS or network), fall back to original src.
          // This ensures that if the header isn't the issue (or if we are on localhost without ngrok),
          // it might still work via standard loading.
          setImageSrc(src);
          setError(true);
          setLoading(false);
        }
      }
    };

    fetchImage();

    return () => {
      isMounted = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [src]);

  if (loading) {
    return (
      <div
        className={`bg-light d-flex align-items-center justify-content-center text-secondary ${className}`}
        style={{ ...style, minHeight: "100px" }}
      >
        <div className="spinner-border spinner-border-sm" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      style={style}
      {...props}
      onError={(e) => {
        // Final fallback if even the blob failed or the fallback src failed
        e.target.onerror = null;
        e.target.src = "https://placehold.co/600x400?text=Image+Not+Found";
      }}
    />
  );
};

export default SecureImage;
