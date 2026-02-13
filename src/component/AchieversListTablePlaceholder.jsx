import React from "react";
import { Table } from "react-bootstrap";

const SkeletonBox = ({ height = "16px", width = "100%", radius = "6px" }) => (
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

export default function AchieverBoardPlaceholder({ rows = 5 }) {
  return (
    <>
      <style>
        {`
          @keyframes shimmer {
            100% { left: 100%; }
          }
        `}
      </style>

      <div className="px-4 px-lg-4 py-3">
        {/* Search Skeleton */}
        <div className="d-flex justify-content-center mb-4">
          <div style={{ width: "100%", maxWidth: "480px" }}>
            <SkeletonBox height="40px" radius="12px" />
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="modern-card table-responsive">
          <Table className="mb-0 align-middle text-center">
            <thead>
              <tr>
                <th className="ps-4" style={{ width: "25%" }}>
                  <SkeletonBox height="16px" width="60%" />
                </th>
                <th style={{ width: "15%" }}>
                  <SkeletonBox height="16px" width="60%" />
                </th>
                <th style={{ width: "25%" }}>
                  <SkeletonBox height="16px" width="60%" />
                </th>
                <th style={{ width: "15%" }}>
                  <SkeletonBox height="16px" width="60%" />
                </th>
                <th className="text-end pe-4" style={{ width: "20%" }}>
                  <SkeletonBox height="16px" width="50%" />
                </th>
              </tr>
            </thead>

            <tbody>
              {[...Array(rows)].map((_, index) => (
                <tr key={index}>
                  <td className="ps-4">
                    <SkeletonBox height="18px" width="70%" />
                  </td>
                  <td>
                    <SkeletonBox height="18px" width="60%" />
                  </td>
                  <td>
                    <SkeletonBox
                      height="26px"
                      width="80%"
                      radius="20px"
                    />
                  </td>
                  <td>
                    <SkeletonBox
                      height="26px"
                      width="60%"
                      radius="20px"
                    />
                  </td>
                  <td className="text-end pe-4">
                    <SkeletonBox
                      height="30px"
                      width="40px"
                      radius="8px"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* Pagination Skeleton */}
        <div className="d-flex justify-content-center mt-4">
          <SkeletonBox height="36px" width="240px" radius="20px" />
        </div>
      </div>
    </>
  );
}
