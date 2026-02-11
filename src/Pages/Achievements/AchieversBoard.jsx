import React from "react";
import { Table, Button, Form, Pagination } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import SearchIcon from "@mui/icons-material/Search";
import EmojiEventsIcon from "@mui/icons-material/EmojiEventsOutlined";
import FilterListIcon from "@mui/icons-material/FilterList";

export default function AchieverBoard({
  data,
  loading,
  currentPage,
  totalPages,
  onPageChange,
  searchTerm,
  onSearchChange,
  onDelete,
}) {
  const navigate = useNavigate();

  return (
    <div className="px-4 px-lg-4 py-3">
      {/* Toolbar */}
      <div className="toolbar-card d-flex flex-column flex-lg-row align-items-center justify-content-between gap-3 mb-4">
        <div className="position-relative w-50" style={{ maxWidth: "450px" }}>
          <div className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted">
            <SearchIcon style={{ fontSize: "20px" }} />
          </div>
          <Form.Control
            type="text"
            placeholder="Search by student name or roll no"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input ps-5 py-2"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">Loading...</div>
      ) : (
        <>
          {/* Table */}
          <div className="modern-card table-responsive">
            <Table hover className="custom-table mb-0 align-middle text-center">
              <thead>
                <tr>
                  <th className="ps-4" style={{ width: "25%" }}>
                    Student Name
                  </th>
                  <th style={{ width: "15%" }}>Roll No</th>
                  <th style={{ width: "25%" }}>Reward Type</th>
                  <th style={{ width: "15%" }}>Status</th>
                  <th className="text-end pe-4" style={{ width: "20%" }}>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {data && data.length > 0 ? (
                  data.map((student) => (
                    <tr
                      key={student._id}
                      onClick={() =>
                        navigate(`/achieve-management/${student._id}`)
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <td className="ps-4 text-center fw-bold text-dark">
                        {student.name}
                      </td>

                      <td className="fw-medium text-dark">
                        {student.rollNo || "-"}
                      </td>

                      <td>
                        <span
                          style={{
                            padding: "4px 14px",
                            borderRadius: "20px",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            backgroundColor:
                              student.rewardType === "Certification Completion"
                                ? "#eef2ff"
                                : student.rewardType ===
                                    "Hackathon Participation"
                                  ? "#f3f4f6"
                                  : student.rewardType === "Hackathon Winner"
                                    ? "#fff7ed"
                                    : student.rewardType ===
                                        "Competition Finalist"
                                      ? "#fdf2f8"
                                      : student.rewardType ===
                                          "Top Internal Performer"
                                        ? "#ecfdf5"
                                        : student.rewardType ===
                                            "Special Recognition Post"
                                          ? "#f0f9ff"
                                          : "#fff4ec",
                            color:
                              student.rewardType === "Certification Completion"
                                ? "#4338ca"
                                : student.rewardType ===
                                    "Hackathon Participation"
                                  ? "#374151"
                                  : student.rewardType === "Hackathon Winner"
                                    ? "#ea580c"
                                    : student.rewardType ===
                                        "Competition Finalist"
                                      ? "#be185d"
                                      : student.rewardType ===
                                          "Top Internal Performer"
                                        ? "#047857"
                                        : student.rewardType ===
                                            "Special Recognition Post"
                                          ? "#0369a1"
                                          : "#f97316",
                          }}
                        >
                          <EmojiEventsIcon style={{ fontSize: "15px" }} />
                          {student.rewardType}
                        </span>
                      </td>

                      <td>
                        <span
                          style={{
                            padding: "4px 14px",
                            borderRadius: "20px",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            backgroundColor:
                              (student.status || "Applied") === "Approved"
                                ? "#e6f7ee"
                                : (student.status || "Applied") === "Rejected"
                                  ? "#fdecec"
                                  : "#fff4ec",
                            color:
                              (student.status || "Applied") === "Approved"
                                ? "#1e7e34"
                                : (student.status || "Applied") === "Rejected"
                                  ? "#d93025"
                                  : "#f97316",
                          }}
                        >
                          {student.status || "Applied"}
                        </span>
                      </td>

                      <td className="text-end pe-4">
                        <Button
                          variant="light"
                          size="sm"
                          className="text-danger"
                          onClick={(e) => {
                            e.stopPropagation(); // 🔥 prevent row navigation
                            onDelete(student._id);
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-5">
                      <div className="d-flex flex-column align-items-center justify-content-center p-4">
                        <FilterListIcon
                          style={{ fontSize: "48px" }}
                          className="text-muted opacity-25 mb-3"
                        />
                        <h6 className="text-secondary fw-bold mb-1">
                          No reward applications found
                        </h6>
                        <p className="text-muted small mb-0">
                          Try adjusting your search
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination className="shadow-sm">
                <Pagination.Prev
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                />
                {[...Array(totalPages)].map((_, i) => (
                  <Pagination.Item
                    key={i + 1}
                    active={i + 1 === currentPage}
                    onClick={() => onPageChange(i + 1)}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
}
