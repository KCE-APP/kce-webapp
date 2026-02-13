import React from "react";

export const SkeletonBox = ({ height = "16px", width = "100%", radius = "8px" }) => (
  <div
    style={{
      height,
      width,
      borderRadius: radius,
      background: "#e5e5e5",
      position: "relative",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        top: 0,
        left: "-100%",
        height: "100%",
        width: "100%",
        background:
          "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
        animation: "shimmer 1.4s infinite",
      }}
    />
  </div>
);

export default function AchievementDetailsPlaceholder() {
  return (
    <>
      {/* Shimmer Animation */}
      <style>
        {`
          @keyframes shimmer {
            100% {
              left: 100%;
            }
          }
        `}
      </style>

      <div style={{ minHeight: "100vh", padding: "20px 100px" }}>
        {/* Back Button Skeleton */}
        <div style={{ marginBottom: "40px", width: "80px" }}>
          <SkeletonBox height="18px" width="100%" radius="6px" />
        </div>

        {/* Card */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "24px",
            padding: "40px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.05)",
          }}
        >
          {/* Icon */}
          <SkeletonBox height="44px" width="44px" radius="12px" />

          {/* Title */}
          <div style={{ marginTop: "20px" }}>
            <SkeletonBox height="32px" width="60%" />
          </div>

          {/* Date */}
          <div style={{ marginTop: "12px", marginBottom: "40px" }}>
            <SkeletonBox height="16px" width="40%" />
          </div>

          {/* Info Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "40px",
              marginBottom: "40px",
            }}
          >
            {[...Array(6)].map((_, index) => (
              <div key={index}>
                <SkeletonBox height="14px" width="40%" />
                <div style={{ marginTop: "8px" }}>
                  <SkeletonBox height="18px" width="70%" />
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div style={{ marginBottom: "40px" }}>
            <SkeletonBox height="14px" width="30%" />
            <div style={{ marginTop: "12px" }}>
              <SkeletonBox height="80px" width="100%" />
            </div>
          </div>

          {/* Evidence Image */}
          <div style={{ marginBottom: "50px" }}>
            <SkeletonBox height="14px" width="25%" />
            <div style={{ marginTop: "12px" }}>
              <SkeletonBox height="250px" width="100%" radius="16px" />
            </div>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "20px",
            }}
          >
            <SkeletonBox height="44px" width="120px" radius="999px" />
            <SkeletonBox height="44px" width="120px" radius="999px" />
          </div>
        </div>
      </div>
    </>
  );
}
