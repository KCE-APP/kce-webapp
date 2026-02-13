import { Table, Form, Pagination } from "react-bootstrap";
import EditIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import SearchIcon from "@mui/icons-material/Search";
import { Tooltip } from "@mui/material";
import Swal from "sweetalert2";
import TablePlaceholder from "../../component/TablePlaceholder";

export default function SemesterTable({
  data,
  loading,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
  searchTerm,
  onSearchChange,
}) {
  const handleDeleteClick = (id, batch, sem) => {
    Swal.fire({
      title: "Confirm Delete",
      text: `Are you sure you want to delete the semester record for Batch ${batch} (Sem ${sem})?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          await onDelete(id);
        } catch (error) {
          Swal.showValidationMessage(`Request failed: ${error}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <div className="toolbar-card d-flex flex-column flex-lg-row align-items-center justify-content-between gap-3 mb-3">
        <div className="position-relative w-100" style={{ maxWidth: "450px" }}>
          <div className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted">
            <SearchIcon style={{ fontSize: "20px" }} />
          </div>
          <Form.Control
            type="text"
            placeholder="Search by batch or semester"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input ps-5 py-2"
          />
        </div>
      </div>

      {loading ? (
        <TablePlaceholder />
      ) : (
        <>
          <div className="modern-card table-responsive">
            <Table className="custom-table mb-0 align-middle">
              <thead>
                <tr>
                  <th className="ps-4">Batch</th>
                  <th>Semester</th>
                  <th>College</th>
                  <th>Duration</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(data) && data.length > 0 ? (
                  data.map((sem) => (
                    <tr key={sem._id}>
                      <td className="ps-4">
                        <span className="fw-bold text-dark">{sem.batch}</span>
                      </td>
                      <td>
                        <span className="modern-badge badge-category">
                          Semester {sem.semester}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`modern-badge ${getBadgeClassOfCollege(sem.collegeName)}`}
                        >
                          {sem.collegeName}
                        </span>
                      </td>
                      <td>
                        <div className="small text-muted">
                          {formatDate(sem.startDate)} -{" "}
                          {formatDate(sem.endDate)}
                        </div>
                      </td>
                      <td className="pe-4 text-end">
                        <div className="d-flex justify-content-end gap-1">
                          <Tooltip title="Edit">
                            <button
                              className="action-btn edit text-primary"
                              onClick={() => onEdit(sem)}
                            >
                              <EditIcon fontSize="small" />
                            </button>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <button
                              className="action-btn delete text-danger"
                              onClick={() =>
                                handleDeleteClick(
                                  sem._id,
                                  sem.batch,
                                  sem.semester,
                                )
                              }
                            >
                              <DeleteIcon fontSize="small" />
                            </button>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-5">
                      <div className="d-flex flex-column align-items-center justify-content-center p-4">
                        <h6 className="text-secondary fw-bold mb-1">
                          No semester records found
                        </h6>
                        <p className="text-muted small mb-0">
                          Try adjusting your search criteria.
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
    </>
  );
}

function getBadgeClassOfCollege(college) {
  if (!college) return "bg-light text-dark";
  switch (college.toUpperCase()) {
    case "KCE":
      return "badge-college-kce";
    case "KIT":
      return "badge-college-kit";
    case "KAHE":
      return "badge-college-kahe";
    default:
      return "badge-category";
  }
}
