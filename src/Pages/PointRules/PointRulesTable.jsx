import { Table, Button, Form, Pagination } from "react-bootstrap";
import EditIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import SearchIcon from "@mui/icons-material/Search";
import { Tooltip } from "@mui/material";
import Swal from "sweetalert2";
import TablePlaceholder from "../../component/TablePlaceholder";
import StarsIcon from "@mui/icons-material/Stars";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

export default function PointRulesTable({
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
  const handleDeleteClick = (id, category) => {
    Swal.fire({
      title: "Confirm Delete",
      text: `Are you sure you want to delete the point rule for "${category}"?`,
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

  const getCategoryIcon = (category) => {
    const cat = category.toLowerCase();
    if (cat.includes("winner") || cat.includes("1st") || cat.includes("first"))
      return <EmojiEventsIcon sx={{ color: "#f59e0b", fontSize: 20 }} />;
    if (cat.includes("certification") || cat.includes("course"))
      return <WorkspacePremiumIcon sx={{ color: "#3b82f6", fontSize: 20 }} />;
    if (cat.includes("runner") || cat.includes("participation"))
      return <StarsIcon sx={{ color: "#10b981", fontSize: 20 }} />;
    if (cat.includes("competition") || cat.includes("event"))
      return <LocalActivityIcon sx={{ color: "#8b5cf6", fontSize: 20 }} />;
    return <MoreHorizIcon sx={{ color: "#64748b", fontSize: 20 }} />;
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
            placeholder="Search by category"
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
                  <th className="ps-4" style={{ width: "55%" }}>
                    Category Name
                  </th>
                  <th className="text-center" style={{ width: "30%" }}>
                    Reward Value
                  </th>
                  <th className="text-end pe-4" style={{ width: "15%" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(data) && data.length > 0 ? (
                  data.map((rule) => (
                    <tr key={rule._id} className="align-middle">
                      <td className="ps-4 py-3">
                        <div className="d-flex align-items-center gap-3">
                          <div
                            className="p-2 rounded-circle bg-light d-flex align-items-center justify-content-center"
                            style={{ width: "40px", height: "40px" }}
                          >
                            {getCategoryIcon(rule.category)}
                          </div>
                          <div>
                            <div className="fw-bold text-dark mb-0">
                              {rule.category}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="text-center py-3">
                        <span
                          className="modern-badge d-inline-flex align-items-center gap-2 px-3 py-2"
                          style={{
                            backgroundColor: "#fff7ed",
                            color: "#c2410c",
                            border: "1px solid #ffedd5",
                            borderRadius: "30px",
                            fontWeight: "700",
                          }}
                        >
                          <StarsIcon style={{ fontSize: "16px" }} />
                          {rule.points} Points
                        </span>
                      </td>
                      <td className="pe-4 text-end py-3">
                        <div className="d-flex justify-content-end gap-1">
                          <Tooltip title="Edit">
                            <button
                              className="action-btn edit text-primary"
                              onClick={() => onEdit(rule)}
                            >
                              <EditIcon fontSize="small" />
                            </button>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <button
                              className="action-btn delete text-danger"
                              onClick={() =>
                                handleDeleteClick(rule._id, rule.category)
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
                    <td colSpan="3" className="text-center py-5">
                      <div className="d-flex flex-column align-items-center justify-content-center p-4">
                        <h6 className="text-secondary fw-bold mb-1">
                          No point rules found
                        </h6>
                        <p className="text-muted small mb-0">
                          Try adjusting your search.
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
