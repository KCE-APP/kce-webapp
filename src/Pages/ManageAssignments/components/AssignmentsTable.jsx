import React from "react";
import { Table, Form, Row, Col, Button, Pagination, Dropdown } from "react-bootstrap";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import BusinessIcon from "@mui/icons-material/Business";
import SchoolIcon from "@mui/icons-material/School";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import LayersIcon from "@mui/icons-material/Layers";
import TablePlaceholder from "../../../component/TablePlaceholder";
const DEPARTMENTS = [
  "IT", "CSE", "ECE", "EEE", "ETE", "CST", "CY", "MECH", "CIVIL", "AIDS", "CSBS", "CSD", "MBA", "MCA", "MCT"
];

// const SECTIONS = ["A", "B", "C", "D"];

const AssignmentsTable = ({
  data,
  loading,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
  searchTerm,
  onSearchChange,
  filterDept,
  onFilterDeptChange,
  filterBatch,
  onFilterBatchChange,
  filterSem,
  onFilterSemChange,
}) => {
  return (
    <div className="assignments-table-container">
      {/* Search & Filter Toolbar */}
    <div className="container-fluid p-0">
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="bg-white px-4 py-3 border-bottom d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <div className="input-group" style={{ maxWidth: "350px" }}>
            <span className="input-group-text bg-light border-end-0">
              <SearchIcon className="text-secondary" />
            </span>
            <Form.Control
              type="text"
              placeholder="Search assignments..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-light border-start-0 shadow-none py-2"
            />
          </div>

          <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center gap-2">
              <span className="small text-uppercase fw-bold text-secondary text-nowrap">Filter:</span>
              <Form.Select
                value={filterDept}
                onChange={(e) => onFilterDeptChange(e.target.value)}
                className="bg-light border-1 shadow-none py-2"
                style={{ width: "160px" }}
              >
                <option value="">All Departments</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </Form.Select>
            </div>
            
            <div className="d-flex align-items-center gap-2">
              <Form.Select
                value={filterBatch}
                onChange={(e) => onFilterBatchChange(e.target.value)}
                className="bg-light border-1 shadow-none py-2"
                style={{ width: "130px" }}
              >
                <option value="">All Batches</option>
                {[2020,2021,2022,2023,2024,2025,2026].map(yr => (
                  <option key={yr} value={`${yr}-${yr+4}`}>{yr}-{yr+4}</option>
                ))}
              </Form.Select>
            </div>

            <div className="d-flex align-items-center gap-2">
              <Form.Select
                value={filterSem}
                onChange={(e) => onFilterSemChange(e.target.value)}
                className="bg-light border-1 shadow-none py-2"
                style={{ width: "135px" }}
              >
                <option value="">All Semesters</option>
                {[1,2,3,4,5,6,7,8].map(s => (
                  <option key={s} value={s}>Sem {s}</option>
                ))}
              </Form.Select>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <Table hover borderless className="align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="px-4 py-3 text-secondary small fw-bold text-uppercase">Assignment Details</th>
                <th className="py-3 text-secondary small fw-bold text-uppercase">Target</th>
                <th className="py-3 text-secondary small fw-bold text-uppercase">Status</th>
                <th className="py-3 text-secondary small fw-bold text-uppercase">Due Date</th>
                <th className="py-3 text-secondary small fw-bold text-uppercase text-center">Assigned To</th>
                <th className="py-3 text-secondary small fw-bold text-uppercase">Created By</th>
                <th className="px-4 py-3 text-secondary small fw-bold text-uppercase text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-0 border-0">
                    <TablePlaceholder />
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">
                    No assignments found matching your criteria.
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={item._id} className="border-bottom border-light">
                    <td className="px-4">
                      <div className="d-flex flex-column">
                        <span className="fw-bold text-dark">{item.title}</span>
                        <span className="text-muted small text-truncate" style={{ maxWidth: "200px" }}>
                          {item.description?.replace(/<[^>]+>/g, '') || "No description"}
                        </span>
                        {/* <div className="mt-1">
                          <span className={`badge rounded-pill fw-bold bg-warning-subtle text-warning-emphasis px-2`} style={{ fontSize: '0.65rem' }}>
                            {item.type.toUpperCase()}
                          </span>
                        </div> */}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex flex-column gap-2">
                        <div className="badge bg-secondary-subtle text-secondary-emphasis rounded-2 p-2 fw-semibold d-flex align-items-center gap-2 border border-secondary-subtle" style={{ width: "fit-content" }}>
                          <BusinessIcon style={{ fontSize: "14px" }} />
                          <span style={{ fontSize: "0.75rem" }}>{item.department}</span>
                        </div>
                        <div className="small text-muted fw-bold d-flex align-items-center gap-2 ps-2 border-start border-3 border-secondary-subtle">
                          <SchoolIcon style={{ fontSize: "14px" }} />
                          <span style={{ fontSize: "0.7rem" }}>Batch: {item.batch}</span>
                        </div>
                        <div className="small text-muted fw-bold d-flex align-items-center gap-2 ps-2 border-start border-3 border-warning">
                          <LayersIcon style={{ fontSize: "14px", color: "#f59e0b" }} />
                          <span style={{ fontSize: "0.7rem" }}>Semester: {item.semester || "N/A"}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge rounded-pill px-3 py-1 fw-bold border ${item.status === 'active' ? 'bg-success-subtle text-success-emphasis border-success-subtle' : 'bg-danger-subtle text-danger-emphasis border-danger-subtle'}`} style={{ fontSize: "0.7rem" }}>
                        {item.status === 'active' ? '● ACTIVE' : '○ EXPIRED'}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2 text-muted">
                        <CalendarTodayIcon style={{ fontSize: "16px" }} />
                        <span className="small fw-bold">
                          {item.dueDate ? new Date(item.dueDate).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          }) : "No deadline"}
                        </span>
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="d-inline-flex flex-column align-items-center bg-primary-subtle p-2 rounded-3 border border-primary-subtle" style={{ minWidth: "75px" }}>
                        <PeopleIcon style={{ fontSize: "14px", color: "#0d6efd" }} className="mb-1" />
                        <span className="fw-bold text-primary" style={{ fontSize: "0.95rem" }}>
                          {item.assignedStudents?.length || 0}
                        </span>
                        <span className="text-uppercase fw-bold text-primary-emphasis opacity-50" style={{ fontSize: "0.6rem" }}>Students</span>
                      </div>
                    </td>
                    <td>
                       <div className="d-flex align-items-center gap-3">
                        <div className="bg-light rounded-2 border p-1 d-flex align-items-center justify-content-center" style={{ width: "32px", height: "32px" }}>
                          <PersonIcon style={{ fontSize: "18px", color: "#6c757d" }} />
                        </div>
                        <div className="d-flex flex-column overflow-hidden" style={{ maxWidth: "150px" }}>
                          <span className="fw-bold text-dark small text-truncate">{item.createdBy?.name || "Unknown"}</span>
                          <span className="text-muted text-truncate" style={{ fontSize: "0.65rem" }}>{item.createdBy?.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <button 
                          className="btn btn-sm btn-link text-primary p-1 border-0" 
                          title="Edit"
                          onClick={() => onEdit(item)}
                        >
                          <EditIcon style={{ fontSize: "20px" }} />
                        </button>
                        <button 
                          className="btn btn-sm btn-link text-danger p-1 border-0" 
                          title="Delete"
                          onClick={() => onDelete(item._id, item.title)}
                        >
                          <DeleteOutlineIcon style={{ fontSize: "20px" }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="d-flex justify-content-between align-items-center p-4 border-top">
            <span className="text-muted small">
              Page {currentPage} of {totalPages}
            </span>
            <Pagination className="pagination-modern mb-0">
              <Pagination.Prev 
                disabled={currentPage === 1} 
                onClick={() => onPageChange(currentPage - 1)} 
              />
              {[...Array(totalPages)].map((_, idx) => (
                <Pagination.Item
                  key={idx + 1}
                  active={idx + 1 === currentPage}
                  onClick={() => onPageChange(idx + 1)}
                >
                  {idx + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next 
                disabled={currentPage === totalPages} 
                onClick={() => onPageChange(currentPage + 1)} 
              />
            </Pagination>
          </div>
        )}
      </div>
    </div>
  </div>
  );
};

export default AssignmentsTable;
