import React from "react";
import { Table, Button, Form, Pagination } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import SearchIcon from "@mui/icons-material/Search";
import EmojiEventsIcon from "@mui/icons-material/EmojiEventsOutlined";
import FilterListIcon from "@mui/icons-material/FilterList";
import FileDownloadIcon from "@mui/icons-material/FileDownloadOutlined";
import AchieverBoardPlaceholder from "../../component/AchieversListTablePlaceholder";

export default function AchieverBoard({
  data,
  loading,
  currentPage,
  totalPages,
  onPageChange,
  searchTerm,
  onSearchChange,
  onDelete,
  itemsPerPage,
  onLimitChange,
  totalCount,
  filterCollege,
  onFilterChange,
  onExportExcel,
}) {
  const navigate = useNavigate();

  const rewardStyles = {
    "certification completion": { bg: "#eef2ff", text: "#4338ca" },
    "hackathon participation": { bg: "#f3f4f6", text: "#374151" },
    "hackathon winner": { bg: "#fff7ed", text: "#ea580c" },
    "competition finalist": { bg: "#fdf2f8", text: "#be185d" },
    "top internal performer": { bg: "#ecfdf5", text: "#047857" },
    "special recognition post": { bg: "#f0f9ff", text: "#0369a1" },
  };

  const statusStyles = {
    approved: { bg: "#e6f7ee", text: "#1e7e34" },
    rejected: { bg: "#fdecec", text: "#d93025" },
    pending: { bg: "#fff4ec", text: "#f97316" },
  };

  return (
    <div className="px-4 px-lg-4 py-3">
      {/* Professional Toolbar */}
      <div className="toolbar-card d-flex flex-column flex-lg-row align-items-center justify-content-between gap-3 mb-4">
        {/* Search Bar */}
        <div className="position-relative w-100" style={{ maxWidth: "450px" }}>
          <div className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted">
            <SearchIcon style={{ fontSize: "20px" }} />
          </div>
          <Form.Control
            type="text"
            placeholder="Search by student name or roll no"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input ps-5 py-2"
            style={{
              paddingLeft: "45px",
              paddingTop: "10px",
              paddingBottom: "10px",
              borderRadius: "12px",
              border: "1px solid rgba(249,115,22,0.3)",
              fontSize: "0.9rem",
            }}
          />
        </div>

        {/* Actions Group */}
        <div className="d-flex align-items-center gap-3 w-100 w-lg-auto justify-content-end flex-wrap">
          {/* Filter */}
          <div className="d-flex align-items-center gap-2">
            <span
              className="text-muted small fw-bold d-none d-md-block"
              style={{ fontSize: "0.75rem", letterSpacing: "0.05em" }}
            >
              COLLEGE:
            </span>
            <Form.Select
              value={filterCollege}
              onChange={(e) => onFilterChange(e.target.value)}
              className="filter-select py-2 ps-3 pe-5"
              style={{ width: "auto", minWidth: "140px" }}
            >
              <option value="">All Campuses</option>
              <option value="KCE">KCE</option>
              <option value="KIT">KIT</option>
              <option value="KAHE">KAHE</option>
            </Form.Select>
          </div>

          <div
            className="vr h-100 mx-1 border-secondary opacity-25 d-none d-md-block"
            style={{ minHeight: "24px" }}
          ></div>

          {/* Result Counter */}
          <span className="text-muted small fw-bold text-uppercase">
            Showing {data.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-
            {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount}
          </span>

          <div
            className="vr h-100 mx-1 border-secondary opacity-25 d-none d-md-block"
            style={{ minHeight: "24px" }}
          ></div>

             {/* Limit Selector */}
          <div className="d-flex align-items-center gap-2">
            <span
              className="text-muted small fw-bold d-none d-md-block"
              style={{ fontSize: "0.75rem", letterSpacing: "0.05em" }}
            >
              LIMIT:
            </span>

            <Form.Select
              value={itemsPerPage}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="filter-select py-2 ps-3 pe-5"
              style={{ width: "auto", minWidth: "100px" }}
            >
              <option value="10">10</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="1000">All</option>
            </Form.Select>
          </div>

          <button
            onClick={onExportExcel}
            className="d-flex align-items-center gap-2 px-3 py-2 rounded-3 border-0 bg-success bg-opacity-10 text-success fw-bold transition-all"
            style={{ fontSize: "0.85rem", cursor: "pointer" }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(25, 135, 84, 0.2)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(25, 135, 84, 0.1)")
            }
          >
            <FileDownloadIcon fontSize="small" /> <span>Excel</span>
          </button>
        </div>
      </div>

      {loading ? (
        <AchieverBoardPlaceholder />
      ) : (
        <>
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
                  data.map((student) => {
                    const type = (student.rewardType || "")
                      .toLowerCase()
                      .trim();
                    const rewardStyle = rewardStyles[type] || {
                      bg: "#fff4ec",
                      text: "#f97316",
                    };

                    const statusKey = (student.status || "pending")
                      .toLowerCase()
                      .trim();
                    const statusStyle =
                      statusStyles[statusKey] || statusStyles.pending;

                    return (
                      <tr
                        key={student._id}
                        onClick={() =>
                          navigate(
                            `/achieve-management/${student.submissionId}`,
                          )
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <td className="ps-4 fw-bold text-dark">
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
                              backgroundColor: rewardStyle.bg,
                              color: rewardStyle.text,
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
                              backgroundColor: statusStyle.bg,
                              color: statusStyle.text,
                            }}
                          >
                            {statusKey}
                          </span>
                        </td>

                        <td className="text-end pe-4">
                          <Button
                            variant="light"
                            size="sm"
                            className="text-danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(student.rollNo, student.submissionId);
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })
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
