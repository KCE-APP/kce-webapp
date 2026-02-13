import React, { useState } from "react";
import { Table, Badge, Button, Form, Pagination } from "react-bootstrap";
import EditIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import SearchIcon from "@mui/icons-material/Search";
import FileDownloadIcon from "@mui/icons-material/FileDownloadOutlined";
import FilterListIcon from "@mui/icons-material/FilterList";
import TablePlaceholder from "../../component/TablePlaceholder";

export default function UsersTable({
  data,
  loading,
  onEdit,
  onDelete,
  onStatusToggle,
  currentPage,
  totalPages,
  onFilterChange,
  limit,
  onLimitChange,
  onExport,
  searchTerm,
  onSearchChange,
  filterCollege,
  onPageChange,
}) {
  const getBadgeClassOfCollege = (college) => {
    switch (college) {
      case "KCE":
        return "badge-college-kce";
      case "KIT":
        return "badge-college-kit";
      case "KAHE":
        return "badge-college-kahe";
      default:
        return "badge-category";
    }
  };

  return (
    <>
      <div className="toolbar-card mb-4">
        <div className="position-relative" style={{ width: "320px" }}>
          <div className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted">
            <SearchIcon style={{ fontSize: "18px" }} />
          </div>
          <Form.Control
            type="text"
            placeholder="Search by name, email..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input ps-5"
          />
        </div>

        <div className="ms-auto d-flex align-items-center gap-3">
          <div className="d-flex align-items-center gap-2">
            <span className="toolbar-label">CAMPUS:</span>
            <Form.Select
              value={filterCollege}
              onChange={(e) => onFilterChange(e.target.value)}
              className="filter-select"
              style={{ width: "auto", minWidth: "150px" }}
            >
              <option value="">All Campuses</option>
              <option value="KCE">KCE</option>
              <option value="KIT">KIT</option>
              <option value="KAHE">KAHE</option>
            </Form.Select>
          </div>

          <div className="toolbar-separator"></div>

          <div className="d-flex align-items-center gap-2">
            <span className="toolbar-label">LIMIT:</span>
            <Form.Select
              value={limit}
              onChange={(e) => onLimitChange(e.target.value)}
              className="filter-select"
              style={{ width: "auto", minWidth: "80px" }}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </Form.Select>
          </div>

          <button
            onClick={onExport}
            className="export-btn export-btn-excel"
            title="Export to Excel"
          >
            <FileDownloadIcon style={{ fontSize: "18px" }} />
            <span>Excel</span>
          </button>
        </div>
      </div>

      {loading ? (
        <TablePlaceholder />
      ) : (
        <>
          <div className="modern-card table-responsive">
            <Table className="custom-table mb-0 align-middle text-center">
              <thead>
                <tr>
                  <th className="ps-4" style={{ width: "15%" }}>
                    User Details
                  </th>
                  <th style={{ width: "15%" }}>Roll No</th>
                  <th style={{ width: "20%" }}>Email</th>
                  <th style={{ width: "20%" }}>College</th>

                  <th style={{ width: "10%" }}>Role</th>

                  {/* <th className="text-end pe-4" style={{ width: "15%" }}>
                    Actions
                  </th> */}
                </tr>
              </thead>
              <tbody>
                {data && data.length > 0 ? (
                  data.map((u) => (
                    <tr key={u._id}>
                      <td className="ps-4">
                        <span className="fw-bold text-dark d-block">
                          {u.name}
                        </span>
                      </td>
                      <td>
                        {u.rollNo ? (
                          <span className="text-dark fw-medium">
                            {u.rollNo}
                          </span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td>
                        <span className="text-secondary fw-medium">
                          {u.email}
                        </span>
                      </td>
                      <td>
                        {u.collegeName ? (
                          <span
                            className={`modern-badge ${getBadgeClassOfCollege(u.collegeName)}`}
                          >
                            {u.collegeName}
                          </span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td>
                        <span className="text-dark small fw-bold text-uppercase">
                          {u.role || "User"}
                        </span>
                      </td>

                      {/* <td className="text-end pe-4">
                        <div className="d-flex align-items-center justify-content-end gap-2">
                          <Button
                            variant="light"
                            size="sm"
                            className="action-btn text-primary"
                            onClick={() => onEdit(u)}
                          >
                            <EditIcon fontSize="small" />
                          </Button>
                          <Button
                            variant="light"
                            size="sm"
                            className="action-btn text-danger"
                            onClick={() => onDelete(u._id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </Button>
                        </div>
                      </td> */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-5">
                      <div className="d-flex flex-column align-items-center justify-content-center p-4">
                        <FilterListIcon
                          style={{ fontSize: "48px" }}
                          className="text-muted opacity-25 mb-3"
                        />
                        <h6 className="text-secondary fw-bold mb-1">
                          No users found
                        </h6>
                        <p className="text-muted small mb-0">
                          Try adjusting your search or filters
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
    </>
  );
}
